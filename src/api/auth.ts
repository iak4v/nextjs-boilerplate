import { envvar, tryCatch } from "@/lib";
import { Elysia, status, t } from "elysia";
import { SignJWT, jwtVerify, base64url } from 'jose';

const auth = new Elysia({ prefix: '/auth' })
    .get("/header", async ({ query, cookie }) => {
        if (!query.auth || query.auth !== envvar("AUTH_SECRET") + envvar("AUTH_SECRET").length) return status("Unauthorized", { message: "authorization header is missing" })

        const jwt = await new SignJWT({ publisher_id: "ignou" })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('7d')
            .sign(base64url.decode(envvar("AUTH_SECRET")));

        cookie['im.auth-token'].set({
            value: jwt,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
            domain: process.env.NODE_ENV === "production" ? "ignoumax.com" : undefined,
        })
        return status("OK", { message: "authorized" })
    }, { query: t.Object({ auth: t.String() }) })

export const authMacro = new Elysia({ name: "auth-macro" })
    .macro("auth", (_: true) => ({
        beforeHandle: async ({ cookie }) => {
            const token = cookie['im.auth-token'].value as string | undefined;
            if (!token) return status("Unauthorized", { message: "authorization header is missing" })
            const [_, parseError] = await tryCatch(jwtVerify(token, base64url.decode(envvar("AUTH_SECRET")), {
                algorithms: ['HS256'],
            }));
            if (parseError) return status("Unauthorized", { message: "invalid token" })
        }
    })
    )

export default auth;