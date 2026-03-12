# Nextjs 16.1.6

- DB - AWS Dynamodb
- Media Storage - AWS S3
- Api - Elysia
- Log - Pino
- Deploy - Cloudflare

# Important Configurations

1. `/db/index.ts` - DB_TABLE_NAME
2. `/s3/index.ts` - S3_BUCKET_NAME
3. `AWS_ACCESS_KEY_ID` & `AWS_SECRET_ACCESS_KEY` should've full read/write access to dynamodb table and s3 bucket
4. 