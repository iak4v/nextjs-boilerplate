"use server";

import { cache } from "react";
import { slugify, tryCatch } from "@/lib";
import { Post, Seo, Tag, TagType } from "@/db/models";
import { EntityKey } from "@/db";

export const fetchPostAndSeo = cache(async (slug: string, options?: { isPostId: boolean }) => {
    let postId = options?.isPostId ? slug : undefined;

    if (!postId) {
        const slugTag = await Tag.manager.query().partitionKey("pk").eq(new EntityKey(TagType.Slug, slug).toString()).limit(1).run();
        if (slugTag.count == 0) return {};
        postId = slugTag.items[0].sk;
    }

    const [[seo], [post]] = await Promise.all([
        tryCatch(Seo.manager.get(new EntityKey(postId))),
        tryCatch(Post.manager.get(new EntityKey(postId)))
    ]);

    return { seo, post };
})

export const fetchQuery = cache(async ({ q, last, limit = 10 }: { q: string, limit?: number, last?: any }) => {
    const tags = await Tag
        .manager
        .query()
        .partitionKey("pk")
        .eq(new EntityKey(TagType.Keyword, slugify(q)).toString())
        .run();

    return {
        items: tags.items,
        last: tags.lastKey
    }
})