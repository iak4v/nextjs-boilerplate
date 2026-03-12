/**
 * A helper function to get environment variables. It throws an error if the variable is not set.
 */
const envvar = (key: string): string => {
    const value = process.env[key];
    if (!value) throw new Error(`Environment variable ${key} is not set`);
    return value;
}

export default envvar;