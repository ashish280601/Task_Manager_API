import { S3Client } from "@aws-sdk/client-s3";

console.log("aws regions", process.env.AWS_REGION);
console.log("aws access key", process.env.AWS_ACCESS_KEY_ID);
console.log("aws secret key", process.env.AWS_SECRET_ACCESS_KEY);

// Configure AWS S3 client with access key, secret key, and region
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

export default s3;
