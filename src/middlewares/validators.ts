
export function authInputValidator(body: any) {
    let errors = [];
    if (!body.userName) errors.push("Username is required");
    if (!body.password) errors.push("Password is required");
    return errors;
}