import s3 from "../config/aws.js";
import { v4 as uuidv4 } from "uuid";

export const uploadFileToS3 = async (file) => {
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${uuidv4()}-${file.originalname}`, 
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read'
    };

    try {
        const data = await s3.upload(params).promise();
        return data.Location;
    } catch (err) {
        console.error('Error uploading file:', err);
        throw new Error('File upload failed');
    }
};