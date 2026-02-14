import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const storageBucket = process.env.STORAGE_BUCKET;
const storageRegion = process.env.STORAGE_REGION;
const storageAccessKeyId = process.env.STORAGE_ACCESS_KEY_ID;
const storageSecretAccessKey = process.env.STORAGE_SECRET_ACCESS_KEY;
const storageEndpoint = process.env.STORAGE_ENDPOINT || undefined;
const storageForcePathStyle = process.env.STORAGE_FORCE_PATH_STYLE === 'true';

const storageEnabled =
  !!storageBucket && !!storageRegion && !!storageAccessKeyId && !!storageSecretAccessKey;

const s3Client = storageEnabled
  ? new S3Client({
      region: storageRegion,
      endpoint: storageEndpoint,
      forcePathStyle: storageForcePathStyle,
      credentials: {
        accessKeyId: storageAccessKeyId as string,
        secretAccessKey: storageSecretAccessKey as string,
      },
    })
  : null;

export const storageConfig = {
  enabled: storageEnabled,
  bucket: storageBucket ?? '',
};

const ensureStorage = () => {
  if (!storageEnabled || !s3Client) {
    throw new Error('Storage is not configured');
  }
  if (!storageBucket) {
    throw new Error('Storage bucket is not configured');
  }
};

export async function createUploadUrl(options: {
  key: string;
  contentType: string;
  expiresIn?: number;
}): Promise<string> {
  ensureStorage();
  const command = new PutObjectCommand({
    Bucket: storageBucket,
    Key: options.key,
    ContentType: options.contentType,
  });
  return getSignedUrl(s3Client as S3Client, command, { expiresIn: options.expiresIn ?? 900 });
}

export async function createDownloadUrl(options: {
  key: string;
  expiresIn?: number;
}): Promise<string> {
  ensureStorage();
  const command = new GetObjectCommand({
    Bucket: storageBucket,
    Key: options.key,
  });
  return getSignedUrl(s3Client as S3Client, command, { expiresIn: options.expiresIn ?? 900 });
}
