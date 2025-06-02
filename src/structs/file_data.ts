export class FileData {
    constructor(
        public user_id: string = '',
        public original_filename: string = '',
        public storage_path: string = '',
        public title: string = '',
        public description: string = '',
        public status: FileStatus = FileStatus.UPLOADED,
        public extracted_data: string = ''
    ) {}
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