import { EntityKey } from "@/db";
import { Tag } from "@/db/models";
import Elysia, { t } from "elysia";
import { authMacro } from "./auth";

const tags = new Elysia({ prefix: "/tags" })
    .use(authMacro)
    .guard({ params: t.Object({ tagId: t.String({ pattern: '^[^@]+@[^@]+$' }) }), auth: true })
    .derive(({ params }) => {
        const [type, tag] = params.tagId.split('@');
        return { tagId: { type, tag } }
    })
    .get("/:tagId/exist", async ({ tagId }) => {
        const { type, tag } = tagId;
        const totalTags = await Tag.manager.query().partitionKey("pk").eq(new EntityKey(type, tag).toString()).limit(1).run();
        return !!totalTags.count;
    })
    .get("/:tagId/total", async ({ tagId }) => {
        const { type, tag } = tagId;
        const totalTags = await Tag.manager.query().partitionKey("pk").eq(new EntityKey(type, tag).toString()).count().run();
        return totalTags.count;
    })

export default tags;