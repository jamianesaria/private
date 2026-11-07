import { receiveSubmission } from '../src/lib/submissions/server';
import { NextRequest } from './next-server';
import manifest from '../.backup-static/manifest.json';

interface Env { ASSETS: { fetch(request: Request): Promise<Response> } }
const routes = manifest.routes as Record<string, { html?: string; rsc?: string; location?: string; status?: number }>;
const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': "frame-ancestors 'self' https://*.sanity.studio https://www.sanity.io",
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.hostname === 'www.nesariamadrasa.com') {
      url.hostname = 'nesariamadrasa.com';
      return Response.redirect(url.href, 308);
    }
    const path = url.pathname.replace(/\/$/, '') || '/';
    const kind = ({ '/api/apply': 'admission', '/api/contact': 'contact', '/api/badri': 'badri' } as const)[path as '/api/apply'];
    if (kind) {
      if (request.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: { Allow: 'POST' } });
      return receiveSubmission(new NextRequest(request), kind);
    }
    if (path === '/api/backup-status') {
      return Response.json({ mode: 'static-public-pages', generatedAt: manifest.generatedAt, sourceCommit: manifest.sourceCommit, pageCount: Object.keys(routes).length }, { headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' } });
    }
    if (path.startsWith('/api/')) {
      return Response.json({ message: 'This static backup uses published snapshots. Draft preview and cache revalidation require a new snapshot build.' }, { status: 501, headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' } });
    }
    if (!['GET', 'HEAD'].includes(request.method)) return new Response('Method not allowed', { status: 405 });
    if (path === '/_next/image') {
      const source = url.searchParams.get('url');
      if (!source) return new Response('Invalid image', { status: 400 });
      const imageUrl = new URL(source, url.origin);
      if (imageUrl.origin === url.origin && imageUrl.pathname !== path) return env.ASSETS.fetch(new Request(imageUrl, request));
      if (imageUrl.protocol === 'https:' && ['cdn.sanity.io', 'images.unsplash.com'].includes(imageUrl.hostname)) {
        if (imageUrl.hostname === 'cdn.sanity.io') {
          const width = Number(url.searchParams.get('w'));
          if (width > 0 && width <= 3840) imageUrl.searchParams.set('w', String(width));
          imageUrl.searchParams.set('auto', 'format');
        }
        return Response.redirect(imageUrl.href, 302);
      }
      return new Response('Invalid image', { status: 400 });
    }
    const entry = routes[path] || (path.startsWith('/studio/') ? routes['/studio'] : undefined);
    if (entry?.location) return new Response(null, { status: entry.status || 308, headers: { Location: entry.location } });
    if (entry) {
      const rsc = request.headers.get('rsc') === '1' || url.searchParams.has('_rsc');
      const target = rsc ? entry.rsc : entry.html;
      if (target) {
        const assetUrl = new URL(target, url.origin);
        const response = await env.ASSETS.fetch(new Request(assetUrl, { method: request.method }));
        const headers = new Headers(response.headers);
        headers.set('Content-Type', rsc ? 'text/x-component; charset=utf-8' : 'text/html; charset=utf-8');
        headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
        headers.set('Vary', 'RSC');
        for (const [key, value] of Object.entries(securityHeaders)) headers.set(key, value);
        return new Response(response.body, { status: response.status, headers });
      }
    }
    // Framework internals, environment files and private records are not routable.
    if (/^\/(?:\.env|\.git|_backup)/.test(path)) return new Response('Not found', { status: 404 });
    return env.ASSETS.fetch(request);
  },
};
