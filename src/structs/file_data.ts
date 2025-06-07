export interface IFileData {
    user_id: string;
    original_filename: string;
    storage_path: string;
    title: string;
    description: string;
    status: FileStatus;
    extracted_data: string;
}

export function getFileStatus(status: FileStatus) {
    switch(status) {
        case FileStatus.UPLOADED:
            return 'uploaded'
        case FileStatus.PROCESSING:
            return 'processing'
        case FileStatus.PROCESSED:
            return 'processed'
        case FileStatus.FAILED:
            return 'failed'
        default:
            console.error('No case matched status')
    }
}
export enum FileStatus {
    UPLOADED,
    PROCESSING,
    PROCESSED,
    FAILED
}