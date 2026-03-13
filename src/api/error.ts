import { Elysia, status } from "elysia";

const error = new Elysia()
    .onError(({ request: { method }, path, error }) => {
        const err = error as {
            name: string;
            message: string;
            code?: string;
            status?: string;
        };

        if (process.env.NODE_ENV != "production") console.error("error:", err);

        if (err.code === "VALIDATION") {
            if (err.message[0] == "{") err.message = JSON.parse(err.message).summary;
        } else if (err.code === "NOT_FOUND") err.message = `NOT FOUND: ${method} ${path}`;
        else if (err.code === "PARSE") {
            err.message += ": unable to parse request";
        }

        return status("Internal Server Error", { message: err.message });
    })
    .as("global")


export default error;
