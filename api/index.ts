import type { IncomingMessage, ServerResponse } from 'http';
import { createApiApp } from '../backend/app';

const app = createApiApp();

export default function handler(
  req: IncomingMessage & { url?: string },
  res: ServerResponse,
) {
  if (req.url) {
    try {
      const urlObj = new URL(req.url, 'http://localhost');
      const rewrittenPath = urlObj.searchParams.get('__path');
      if (rewrittenPath !== null) {
        urlObj.searchParams.delete('__path');
        const qs = urlObj.searchParams.toString();
        const normalized = rewrittenPath.replace(/^\/+/, '');
        req.url = `/api/${normalized}${qs ? `?${qs}` : ''}`;
      }
    } catch {
      // Leave req.url as-is if URL parsing fails
    }
  }
  return app(
    req as unknown as Parameters<typeof app>[0],
    res as unknown as Parameters<typeof app>[1],
  );
}
