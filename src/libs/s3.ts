import { S3Client } from '@aws-sdk/client-s3';

const s3Global = global as unknown as { s3Client?: S3Client };

export const s3Client = s3Global.s3Client || new S3Client({
  forcePathStyle: true,
  region: process.env.S3_REGION!,
  endpoint: process.env.S3_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  }
});

if (process.env.NODE_ENV !== 'production') {
  s3Global.s3Client = s3Client;
}
