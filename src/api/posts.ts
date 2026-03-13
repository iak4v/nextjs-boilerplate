import { EntityKey } from "@/db";
import { Post, PostAuthorization, PostVisibility, Seo, Tag, TagType } from "@/db/models";
import { Elysia, status, t } from "elysia";
import { authMacro } from "./auth";
import { uploadToS3 } from "@/s3";
import grayMatter from "gray-matter";

const fromGithub = new Elysia({ prefix: '/github' })
    .use(authMacro)
    .guard({ query: t.Object({ url: t.String() }), auth: true })
    .derive(({ query }) => {
        let url = query.url;

        if (!query.url.includes("githubuser")) {
            url = url.replace("github", "raw.githubusercontent");
            url = url.replace("blob", "refs/heads")
        }

        const slug = url.split('/').slice(-1)[0].split(".")[0];
        if (!slug) return status("Bad Request", { message: "unable to extract slug from url, please provide a valid github url with slug in the end" });
        return { url, slug }
    })
    .macro({
        'extract-postId': (_: true) => ({
            resolve: async ({ query }) => {
                const slug = query.url.split('/').slice(-1)[0].split(".")[0];
                if (!slug) return status("Bad Request", { message: "unable to extract slug from url, please provide a valid github url with slug in the end" });

                const slugTag = await Tag.manager.query().partitionKey("pk").eq(new EntityKey(TagType.Slug, slug).toString()).limit(1).run().then(r => r.items[0]);
                if (!slugTag) return status('Not Found', { message: "post not found" });
                return { postId: slugTag.sk }
            }
        })
    })
    .get("/", async ({ url, slug }) => {
        const res = await fetch(url);
        if (!res.ok) return status("Bad Request", { message: 'github url not found' })

        const md = await res.text();
        const mdx = grayMatter(md) as unknown as { data: { title: string, description: string, updated_at: Date, cover_image?: string, slug: string }, content?: string };

        const keys = Object.keys(mdx.data);
        if (!keys.includes("title")) return status("Failed Dependency", { message: "'title' is not found in metadata" })
        else if (!keys.includes("description")) return status("Failed Dependency", { message: "'description' is not found in metadata" })
        else if (!keys.includes("updated_at")) return status("Failed Dependency", { message: "'updated_at' is not found in metadata" })

        if (!mdx.content) return status("Failed Dependency", { message: "markdown body not found" })

        const isSlugPresent = await Tag.manager.query().partitionKey("pk").eq(new EntityKey(TagType.Slug, slug).toString()).limit(1).run().then(r => !!r.count).catch(() => false);
        if (isSlugPresent) return status('Conflict', { message: "post already created with slug provided" });

        const post = await Post.manager.create(new Post({
            title: mdx.data.title,
            publisher_id: 'ignou',
            content: mdx.content,
            cover_image: mdx.data.cover_image,
            last_updated: mdx.data.updated_at.toISOString(),
            visibility: PostVisibility.Public,
            is_authorized: PostAuthorization.True,
            tags: new Set([new EntityKey(TagType.Slug, slug).toString()]),
        }))

        const [newSlug] = await Promise.all([
            Tag.manager.create(new Tag({
                type: TagType.Slug,
                tag: slug,
                entityId: post.pk
            })),
            Seo.manager.create(new Seo({
                entityId: post.pk,
                title: mdx.data.title,
                description: mdx.data.description,
                updated_at: mdx.data.updated_at,
            })),
        ])

        return status("Created", { id: post.pk, slug: EntityKey.from(newSlug.pk).sk });
    })
    .get("/cover", async ({ url, slug }) => {
        const slugTag = await Tag.manager.query().partitionKey("pk").eq(new EntityKey(TagType.Slug, slug).toString()).limit(1).run();
        if (slugTag.count == 0) return status('Not Found', { message: "post not found" });

        const postId = slugTag.items[0].sk;
        const post = await Post.exists(postId);
        if (!post) return status("Not Found", { message: "post not found" });

        const imageRes = await fetch(url);
        const imageBuffer = await imageRes.arrayBuffer();
        const format = url.split('.').pop() || "jpeg";

        if (!['jpeg', 'jpg', 'png', 'webp'].includes(format)) return status("Bad Request", { message: "unsupported image format, only jpeg, jpg, png, webp are supported" })

        const coverImageUrl = await uploadToS3(new Blob([imageBuffer]), `public/posts/${postId}`, `image/${format}`);
        await Post.manager.update(new EntityKey(postId), { set: { cover_image: coverImageUrl } });

        return status(202, { cover_image: coverImageUrl })
    })
    .get("/seo", async ({ postId, url }) => {
        const res = await fetch(url);
        if (!res.ok) return status("Bad Request", { message: 'github url not found' })

        const md = await res.text();
        const mdx = grayMatter(md) as unknown as { data: { keywords?: string[], title?: string, description?: string, updated_at: Date }, content?: string };

        const keys = Object.keys(mdx.data);
        if (!keys.includes("title")) return status("Failed Dependency", { message: "'title' is not found in metadata" })
        else if (!keys.includes("description")) return status("Failed Dependency", { message: "'description' is not found in metadata" })
        else if (!keys.includes("updated_at")) return status("Failed Dependency", { message: "'updated_at' is not found in metadata" })

        await Seo.manager.update(new EntityKey(postId), {
            set: {
                title: mdx.data.title,
                description: mdx.data.description,
                updated_at: mdx.data.updated_at,
                keywords: mdx.data.keywords ? new Set(mdx.data.keywords) : undefined
            }
        })

        return status("Accepted");

    }, { "extract-postId": true })

const posts = new Elysia({ prefix: "/posts" })
    .use(authMacro)
    .use(fromGithub)
    .guard({ params: t.Object({ slug: t.String({ pattern: "^[a-z](-?[a-z0-9]+)*$" }) }) })
    .derive(async ({ params }) => {
        const tagSlug = await Tag.manager.query().partitionKey("pk").eq(new EntityKey(TagType.Slug, params.slug).toString()).limit(1).run();
        if (!tagSlug.items.length) return status('Not Found', { message: "post not found" });

        const postId = tagSlug.items[0].sk;
        const doesPostExists = await Post.exists(postId);
        if (!doesPostExists) return status("Not Found", { message: "post not found" });

        return { postId }
    })
    .get("/:slug/tags", async ({ postId, query }) => {

        if (!query.add && !query.remove) {
            const post = await Post.manager.get(new EntityKey(postId), { attributes: ['tags'] });
            return { tags: Array.from(post.tags) }
        }

        if (query.add) {
            const [type, tag] = query.add.split('@');
            const Type = type.charAt(0).toUpperCase() + type.slice(1);
            if (!Object.keys(TagType).includes(Type)) return status("Bad Request", { message: `invalid tag type: ${type} in ${query.add}` });

            const tagType = TagType[Type as keyof typeof TagType];
            const tagId = new EntityKey(tagType, tag).toString();
            const isTagAlready = await Tag.exists(tagId, postId);
            if (isTagAlready) return status("Not Modified", { message: "tag already exists" })

            await Promise.all([
                Post.manager.update(new EntityKey(postId), { add: { tags: new Set([tagId]) } }),
                Tag.manager.create(new Tag({ type: tagType, tag: tag, entityId: postId }))
            ])

            return status("Accepted")
        }

        if (query.remove) {
            const [type, tag] = query.remove.split('@');
            const Type = type.charAt(0).toUpperCase() + type.slice(1);
            if (!Object.keys(TagType).includes(Type)) return status("Bad Request", { message: `invalid tag type: ${type} in ${query.remove}` });

            const tagType = TagType[Type as keyof typeof TagType];
            const tagId = new EntityKey(tagType, tag).toString();
            const isTagAlready = await Tag.exists(tagId, postId);
            if (!isTagAlready) return status("Not Modified", { message: "tag not present, not removed" })

            await Promise.all([
                Post.manager.update(new EntityKey(postId), { delete: { tags: new Set([tagId]) } }),
                Tag.manager.delete(new Tag({ type: tagType, tag: tag, entityId: postId }))
            ])

            return status("Accepted")
        }
    }, {
        query: t.Object({
            add: t.Optional(t.String({ pattern: "^[^@]+@[^@]+$" })),
            remove: t.Optional(t.String({ pattern: "^[^@]+@[^@]+$" })),
        })
    })
    .get("/:slug/slug", async ({ params, postId, query }) => {
        const isNewSlugPresent = await Tag.manager.query().partitionKey("pk").eq(new EntityKey(TagType.Slug, query.new).toString()).limit(1).run()
        if (isNewSlugPresent.items.length) return status('Conflict', { message: `slug: '${query.new}' already exists` });

        await Tag.manager.delete(new EntityKey(new EntityKey(TagType.Slug, params.slug).toString(), postId));
        await Promise.all([
            Tag.manager.create(new Tag({ type: TagType.Slug, tag: query.new, entityId: postId })),
            Post.manager.update(new EntityKey(postId), { add: { tags: new Set([Tag.buildPk(TagType.Slug, query.new)]) } }),
            Post.manager.update(new EntityKey(postId), { delete: { tags: new Set([Tag.buildPk(TagType.Slug, params.slug)]) } })
        ])
        return status("Accepted")
    }, { query: t.Object({ new: t.String({ pattern: "^[a-z](-?[a-z0-9]+)*$" }) }) })



export default posts;