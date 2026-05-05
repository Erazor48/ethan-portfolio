import { StructuredTool } from '@langchain/core/tools';
import { z } from 'zod';

async function safeFetch(url: string, options?: RequestInit) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 10000);
    try {
        const res = await fetch(url, { ...options, signal: controller.signal });
        const contentType = res.headers.get('content-type') || '';
        const text = await res.text();
        return {
            status: res.status,
            contentType,
            body: text.slice(0, 4000)
        };
    } finally {
        clearTimeout(id);
    }
}

export class WebSearchTool extends StructuredTool {
    name = 'web_search';
    description = 'Search the web for up-to-date information. Returns a list of results with title, url, and snippet.';
    schema = z.object({
        query: z.string().min(2),
        limit: z.number().int().min(1).max(10).default(5)
    });

    async _call(input: z.infer<typeof this.schema>) {
        const apiKey = process.env.SERPAPI_API_KEY;
        const q = encodeURIComponent(input.query);

        // Prefer SerpAPI if configured
        if (apiKey) {
            const serpUrl = `https://serpapi.com/search.json?engine=google&q=${q}&api_key=${apiKey}`;
            const res = await fetch(serpUrl);
            if (!res.ok) {
                return `Error searching (SerpAPI HTTP ${res.status}).`;
            }
            const json: any = await res.json();
            const items = (json.organic_results || []).slice(0, input.limit).map((r: any) => ({
                title: r.title,
                url: r.link,
                snippet: r.snippet,
                position: r.position
            }));
            return JSON.stringify({ engine: 'serpapi', results: items }, null, 2);
        }

        // Fallback: DuckDuckGo HTML (no API key)
        const url = `https://html.duckduckgo.com/html/?q=${q}`;
        const page = await safeFetch(url);
        return JSON.stringify({ engine: 'duckduckgo_html', source: url, length: page.body.length }, null, 2);
    }
}

export class WebFetchTool extends StructuredTool {
    name = 'web_fetch';
    description = 'Fetch the content of a given URL (GET only). Returns status, contentType and truncated body.';
    schema = z.object({ url: z.string().url() });

    async _call(input: z.infer<typeof this.schema>) {
        const page = await safeFetch(input.url);
        return JSON.stringify(page, null, 2);
    }
}

export const webTools = [new WebSearchTool(), new WebFetchTool()];
