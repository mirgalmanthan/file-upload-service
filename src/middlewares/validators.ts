
export function authInputValidator(body: any) {
    let errors = [];
    if (!body.userName) errors.push("userName is required");
    if (!body.password) errors.push("password is required");
    return errors;
}