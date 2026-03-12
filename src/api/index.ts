import { Elysia, status } from "elysia";

const elysia = new Elysia()
    .get("/", ({ }) => status("OK"))

export default elysia;