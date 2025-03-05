import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '@/libs/s3';

export async function uploadToS3(file: Buffer, fileName: string, contentType: string): Promise<string> {
    const bucketName = process.env.S3_BUCKET_NAME || 'student-athlete-images';

    // Create a unique file name to prevent collisions
    const uniqueFileName = `${Date.now()}-${fileName}`;

    // Set up the parameters for S3 upload
    const params = {
        Bucket: bucketName,
        Key: uniqueFileName,
        Body: file,
        ContentType: contentType,
        ACL: 'public-read' as const, // Make the file publicly accessible
    };

    try {
        // Upload the file to S3
        await s3Client.send(new PutObjectCommand(params));

        // Return the URL where the image can be accessed
        const imageUrl = `${process.env.S3_PUBLIC_URL}/student-athlete-images/${uniqueFileName}`;
        return imageUrl;
    } catch (error) {
        console.error('S3 upload error:', error);
        throw new Error('Failed to upload image to S3');
    }
}
