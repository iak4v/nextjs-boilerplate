import { getS3ObjectUrl } from "@/s3";
import Markdown from "@/components/markdown";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { fetchPostAndSeo } from "@/dal/posts";
import { isValid } from "ulid";
import { baseUrlBuilder } from "@/lib";

type Params = { slug: string };

export const revalidate = 26_20_000; // 1 Month
export const dynamic = "force-static";

export const generateMetadata = async ({
    params,
}: {
    params: Promise<Params>;
}): Promise<Metadata> => {
    const { slug } = await params;

    const { seo } = await fetchPostAndSeo(slug, { isPostId: isValid(slug) });
    if (!seo) return notFound();
    seo.keywords.delete("");

    const baseUrl = baseUrlBuilder();

    return {
        title: seo.title,
        description: seo.description,
        keywords: Array.from(seo.keywords),
        icons: {
            icon: getS3ObjectUrl("/misc/icon.svg"),
            apple: getS3ObjectUrl("/misc/icon-apple-touch.png"),
        },
        manifest: getS3ObjectUrl("/misc/manifest.json"),
        metadataBase: new URL(baseUrl),
        robots: "index, follow",
        alternates: {
            canonical: baseUrlBuilder(`/posts/${slug}`),
        },
        openGraph: {
            type: "article",
            title: seo.title,
            description: seo.description,
            modifiedTime: seo.updated_at?.toISOString(),
            images: seo.opengraph,
        },
        twitter: {
            title: seo.title,
            description: seo.description,
            images: seo.opengraph,
            card: "summary_large_image",
            site: baseUrl,
        },
    };
};

const PostPage = async ({ params }: { params: Promise<Params> }) => {
    const { slug } = await params;
    const { post } = await fetchPostAndSeo(slug, { isPostId: isValid(slug) });
    if (!post) return notFound();

    return (
        <>
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight transition-colors">
                {post.title}
            </h1>
            {post.cover_image ? (
                <Image src={getS3ObjectUrl(post.cover_image)} width={1200} height={630} alt={slug} className="rounded-lg" />
            ) : undefined}
            <Markdown className="space-y-4" content={post.content} />
        </>
    );
};

export default PostPage;
