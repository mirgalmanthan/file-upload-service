export interface IJobData {
    file_id: string;
    job_type: JobType;
    status: JobStatus;
    error_message: string;
    started_at: Date;
    completed_at?: Date;
}

export function getJobStatus(status: JobStatus) {
    switch(status) {
        case JobStatus.QUEUED:
            return 'queued'
        case JobStatus.PROCESSING:
            return 'processing'
        case JobStatus.COMPLETED:
            return 'completed'
        case JobStatus.FAILED:
            return 'failed'
        default:
            console.error('No case matched status')
    }
}

export function getJobType(jobType: JobType) {
    switch(jobType) {
        case JobType.EXTRACT_DATA:
            return 'extract_data'
        default:
            console.error('No case matched job type')
    }
}

export enum JobType {
    EXTRACT_DATA
}

export enum JobStatus {
    QUEUED,
    PROCESSING,
    COMPLETED,
    FAILED
}
