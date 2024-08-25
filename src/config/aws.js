import { S3Client } from "@aws-sdk/client-s3";


// Configure AWS S3 client with access key, secret key, and region
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

export default s3;
