import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = ['', '/quiz', '/courses', '/colleges'].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : route === '/quiz' ? 0.9 : 0.8,
  }));

  return [...routes];
}
