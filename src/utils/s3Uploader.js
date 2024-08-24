import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import s3 from "../config/aws.js";

export const uploadFileToS3 = async (file) => {
    const bucketName = process.env.S3_BUCKET_NAME;
    if (!bucketName) {
        throw new Error('S3 bucket name is not defined in environment variables');
    }

    const params = {
        Bucket: bucketName,
        Key: `${uuidv4()}-${file.originalname}`, 
        Body: file.buffer,
        ContentType: file.mimetype,
    };

    try {
        const command = new PutObjectCommand(params);
        const data = await s3.send(command);
        const location = `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
        return location;
    } catch (err) {
        console.error('Error uploading file:', err);
        throw new Error('File upload failed');
    }
};
