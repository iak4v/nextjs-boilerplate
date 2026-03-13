import { Elysia, status } from "elysia";
import posts from "./posts";
import auth from "./auth";
import error from "./error";
import tags from "./tags";

const elysia = new Elysia({ prefix: "/api" })
    .get("/", ({ }) => status("OK"))
    .use(error)
    .use(auth)
    .use(posts)
    .use(tags)

export default elysia;