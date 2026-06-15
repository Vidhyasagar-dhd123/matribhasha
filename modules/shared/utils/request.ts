export function getRequestHeaders(includeJson = true): HeadersInit {
    const headers: Record<string, string> = {}

    if (includeJson) {
        headers["Content-Type"] = "application/json"
    }

    if (typeof window !== "undefined") {
        const token = localStorage.getItem("token")
        if (token) {
            headers.Authorization = `Bearer ${token}`
        }
    }

    return headers
}