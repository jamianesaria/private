import { createClient } from '@sanity/client';
import env from '@next/env';
env.loadEnvConfig(process.cwd());
const client = createClient({ projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, dataset: process.env.NEXT_PUBLIC_SANITY_DATASET, apiVersion: '2026-03-01', token: process.env.SANITY_API_READ_TOKEN, useCdn: false, timeout: 10000, maxRetries: 0 });
const post = await client.fetch('*[_type == "blogPost" && !defined(archivedAt) && defined(slug.current)] | order(_updatedAt desc)[0]{title,"slug":slug.current}');
if (!post?.slug || !post.title) { console.log('No published blog post available to check.'); process.exit(2); }
const base = process.env.QA_BASE_URL || 'https://jamia-backup.jamianesaria.workers.dev';
const response = await fetch(`${base}/blog/${encodeURIComponent(post.slug)}`, { signal: AbortSignal.timeout(15000) });
const html = await response.text();
console.log(JSON.stringify({ status: response.status, publishedTitlePresent: html.includes(post.title) }));
if (!response.ok || !html.includes(post.title)) process.exitCode = 1;
