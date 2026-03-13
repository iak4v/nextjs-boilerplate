import { S3_BUCKET_NAME, S3_BUCKET_REGION } from "@/constants";
import { envvar } from "@/lib";
import {
    S3Client,
    DeleteObjectCommand,
    DeleteObjectCommandInput,
    GetObjectCommand,
    PutObjectCommand,
    PutObjectCommandInput
} from "@aws-sdk/client-s3";

const bucketName = `${S3_BUCKET_NAME}-${process.env.NODE_ENV === "production" ? "prod" : "dev"}-s3`

const s3Client = new S3Client({
    region: S3_BUCKET_REGION,
    credentials: {
        accessKeyId: envvar("AWS_ACCESS_KEY_ID"),
        secretAccessKey: envvar("AWS_SECRET_ACCESS_KEY")
    }
})

export const getS3Object = (key: string) =>
    s3Client.send(new GetObjectCommand({ Bucket: bucketName, Key: key }));

export const getS3ObjectUrl = (s3Key: string) => {
    const prefix = `https://${bucketName}.s3.${S3_BUCKET_REGION}.amazonaws.com/`;
    return prefix + s3Key;
};

/**
 * upload to the s3 bucket
 * @param file Blob of file to upload
 * @param s3Key store location ie. folder/file.ext should not start with "/" ex. public/og/hello.png, oops.pdf
 * @returns s3Key where the file is saved
 */
export async function uploadToS3(file: Blob, s3Key: string, content_type: string) {
    const params = {
        Bucket: bucketName,
        Key: s3Key,
        Body: (await file.arrayBuffer()) as unknown as Buffer,
        ContentType: content_type ?? file.type,
    } satisfies PutObjectCommandInput;

    const command = new PutObjectCommand(params);

    return s3Client.send(command).then((res) => {
        if (res.$metadata.httpStatusCode == 200) return params.Key;
        else throw new Error("Error uploading file to s3");
    });
}

export const deleteFromS3 = (...keys: (string | undefined)[]) => {
    const commands = [];
    for (const key of keys) {
        if (!key) continue;

        const params = {
            Bucket: bucketName,
            Key: key,
        } satisfies DeleteObjectCommandInput;

        const command = new DeleteObjectCommand(params);
        commands.push(s3Client.send(command));
    }

    return Promise.all(commands);
};
