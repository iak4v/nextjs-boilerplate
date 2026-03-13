export const PROJECT_NAME = "IGNOUMax";

export const DDB_TABLE_NAME: string = "ignoumax";
export const DDB_TABLE_REGION: string = "ap-south-1";

export const S3_BUCKET_REGION: string = "ap-south-1";
export const S3_BUCKET_NAME: string = "ignoumax";

export const IGNOUMAX_GH = (repo: "core" | "posts" | "covers", loc: string) => `https://raw.githubusercontent.com/ignoumax/${repo}/refs/heads/main/${loc}`;
export const THEME_COLOR = "#155dfc";