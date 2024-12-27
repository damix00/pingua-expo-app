export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function objectToQueryString(obj: Record<string, any>) {
    return Object.keys(obj)
        .map((key) => `${key}=${obj[key]}`)
        .join("&");
}
