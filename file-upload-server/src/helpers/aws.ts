import * as AWS from 'aws-sdk';


export async function saveToS3(content: Buffer, bucketName: string, path: string, fileName: string) {
    let s3Client = new AWS.S3({
        region: process.env.AWS_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    });
    try {
        let params = {
            Bucket: `${bucketName}/${path}`,
            Key: fileName,
            Body: content,
            ContentType: "application/pdf",
            ACL: 'public-read-write'
        }
        await s3Client.upload(params).promise()
        return {
            success: true,
            message: `Successfully dumped to ${bucketName}/${path}/${fileName}`
        }
    } catch (e) {
        console.log("Error in dump : ", e)
        return {
            success: false,
            message: e
        }
    }
}