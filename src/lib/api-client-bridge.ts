/**
 * API Client Bridge
 * 
 * This utility facilitates communication between the Next.js frontend
 * and the Python FastAPI backend services. 
 * It handles authentication, error mapping, and consistent data structures.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface RequestOptions extends RequestInit {
    params?: Record<string, string>;
}

class ApiBridge {
    private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
        const { params, ...init } = options;

        // Build URL with query parameters
        const url = new URL(`${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`);
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                url.searchParams.append(key, value);
            });
        }

        const response = await fetch(url.toString(), {
            ...init,
            headers: {
                'Content-Type': 'application/json',
                ...init.headers,
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `API Request failed: ${response.statusText}`);
        }

        return response.json();
    }

    // AI Inference Endpoints
    async processChat(message: string, restaurantId: string, context: any = {}) {
        return this.request('/ai/chat', {
            method: 'POST',
            body: JSON.stringify({ message, restaurantId, context }),
        });
    }

    // Menu Retrieval / Search
    async searchMenu(query: string, restaurantId: string) {
        return this.request('/menu/search', {
            method: 'GET',
            params: { q: query, restaurantId },
        });
    }

    // Analytics Engine
    async getAnalytics(restaurantId: string, timeframe: string = '30d') {
        return this.request(`/analytics/${restaurantId}`, {
            method: 'GET',
            params: { timeframe },
        });
    }

    // Generic Methods
    get<T>(endpoint: string, params?: Record<string, string>) {
        return this.request<T>(endpoint, { method: 'GET', params });
    }

    post<T>(endpoint: string, body: any) {
        return this.request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) });
    }
}

export const apiBridge = new ApiBridge();
