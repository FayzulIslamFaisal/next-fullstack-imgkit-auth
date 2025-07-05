type FetchOptions= {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    body?: any;
    headers?: Record<string, string>;
};

class ApiClient {
    privateasync fetch<T> (endPoint: string, options: FetchOptions={}): Promise<T> {
        const { method="GET", body, headers={} } = options;
        const defaultHeaders = {
            "Content-Type": "application/json",
            ...headers,
        }
        const response = await fetch(`api/${endPoint}`, {
            method,
            headers: defaultHeaders,
            body: body ? JSON.stringify(body) : undefined,
        });
        if (!response.ok) {
            throw new Error(await response.statusText);
        }
        return response.json();
    }
    async getVideos() {
        return this.fetch("/videos");
    }
    async createVideo(video: Video) {
        return this.fetch("/videos", {
            method: "POST",
            body: video,
        });
    }
}

export const apiClient = new ApiClient();
