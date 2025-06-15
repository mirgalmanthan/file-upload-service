import AWS from 'aws-sdk';
import * as fs from 'fs';
import * as path from 'path';

export async function fetchFileFromS3(filePath: string, bucketName: string, filename: string) {
    // Create the downloaded_files directory if it doesn't exist
    const downloadDir = path.join(__dirname, '../downloaded_files');
    if (!fs.existsSync(downloadDir)) {
        fs.mkdirSync(downloadDir, { recursive: true });
    }

    const s3Client = new AWS.S3({
        region: process.env.AWS_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    });
    
    const params = {
        Bucket: bucketName, 
        Key: filePath
    };
    
    const outputPath = path.join(downloadDir, filename);
    const fileStream = fs.createWriteStream(outputPath);

    try {
        await new Promise((resolve, reject) => {
            s3Client.getObject(params)
                .createReadStream()
                .on('error', (err) => {
                    fileStream.destroy();
                    reject(err);
                })
                .pipe(fileStream)
                .on('error', (err) => reject(err))
                .on('close', () => resolve(true));
        });
        
        return {
            success: true,
            message: `Successfully fetched file from S3: ${filePath}`,
            filePath: outputPath
        };
    } catch (error) {
        // Clean up the file if it was partially written
        if (fs.existsSync(outputPath)) {
            fs.unlinkSync(outputPath);
        }
        return {
            success: false,
            message: error instanceof Error ? error.message : String(error),
            filePath: ''
        };
    }
}
