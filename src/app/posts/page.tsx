import { Post } from "@/db/models"
import { Condition } from "dynamode";

const PostsPage = async () => {
    const posts = await Post.manager.scan().limit(10).attributes(['title']).indexName("lsi1")..startAt().run();
    return (
        <main data-id={posts.lastKey}>
            <p>Latest Posts</p>
            {
                posts.items.map((p) => <div key={p.pk}>{p.title}</div>)
            }
        </main>
    )
}

export default PostsPage
