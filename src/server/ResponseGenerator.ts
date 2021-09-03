export function success(content: string | number | boolean | Record<any, any> | any[]): string {
    return JSON.stringify({
        status: true,
        data: content
    });
}

export function error(error: string | Error): string {
    return JSON.stringify({
        status: false,
        error: error.toString()
    });
}
