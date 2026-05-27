export function formatZodErrors(error, fieldName = "value") {
    return error.issues.map((issue) => ({
        field: issue.path.length > 0 ? issue.path.join(".") : fieldName,
        message: issue.message,
    }));
}