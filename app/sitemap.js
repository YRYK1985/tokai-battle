import { FILTERED_VIDEOS } from '../lib/videos';

export default function sitemap() {
  const baseUrl = 'https://tokairanking.com';

  // 静的ページ
  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: new Date('2026-03-27'), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: new Date('2026-03-27'), changeFrequency: 'monthly', priority: 0.3 },
  ];

  // 動画個別ページ（3,000+ページ）
  const videoPages = FILTERED_VIDEOS.map((video) => ({
    url: `${baseUrl}/video/${video.id}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.7,
  }));

  return [...staticPages, ...videoPages];
}
