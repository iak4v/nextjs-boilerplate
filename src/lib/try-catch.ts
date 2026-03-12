const tryCatch = async <T>(p: Promise<T>): Promise<[T, undefined] | [undefined, Error]> => {
    try {
        const v = await p;
        return [v, undefined];
    } catch (e) {
        return [undefined, e as Error]
    }
}

export default tryCatch