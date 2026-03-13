import { ulid, ulidToUUID } from "ulid";

export const slugify = (s: string) => s.replaceAll(" ", '-').toLowerCase()

export const uuid = () => ulidToUUID(ulid()).toLowerCase()

export const baseUrlBuilder = (path: `/${string}` | "" = "") =>
    envvar("NEXT_PUBLIC_BASE_URL") + path;

export const tryCatch = async <T>(p: Promise<T>): Promise<[T, undefined] | [undefined, Error]> => {
    try {
        const v = await p;
        return [v, undefined];
    } catch (e) {
        return [undefined, e as Error]
    }
}

/**
 * A helper function to get environment variables. It throws an error if the variable is not set.
 */
export const envvar = (key: string): string => {
    const value = process.env[key];
    if (!value) throw new Error(`Environment variable ${key} is not set`);
    return value;
}