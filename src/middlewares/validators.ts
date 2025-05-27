
export function authInputValidator(body: any) {
    let errors = [];
    if (!body.userName) errors.push("userName is required");
    if (!body.password) errors.push("password is required");
    return errors;
}

export function fileInputValidator(file: Express.Multer.File, body: any) {
    let errors: string[] = [];
    if (file.mimetype !== 'application/pdf') errors.push("File must be a PDF");
    // if (!body.operation) errors.push("operation is required");
    return errors;
}