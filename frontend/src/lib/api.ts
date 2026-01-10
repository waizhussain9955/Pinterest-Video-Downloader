export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  disclaimer?: string;
}

export interface PinterestDownloadResponse {
  sourceUrl: string;
  videoUrl: string;
  qualities: { 
    url: string; 
    qualityLabel?: string;
    width?: number;
    height?: number;
    fileSize?: number;
    bitrate?: number;
  }[];
  title?: string;
  author?: string;
  durationSeconds?: number | null;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  category: string;
  tags: string[];
  featured: boolean;
  imageUrl?: string;
}

export interface BlogListResponse {
  posts: BlogPost[];
  categories: string[];
  total: number;
}

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8080';

export const downloadPinterestVideo = async (
  url: string
): Promise<ApiResponse<PinterestDownloadResponse>> => {
  const res = await fetch(`${API_BASE_URL}/api/v1/pinterest/download`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  });

  const json = (await res.json()) as ApiResponse<PinterestDownloadResponse>;

  if (!res.ok) {
    throw new Error(json.error || 'Request failed');
  }

  return json;
};

export const getBlogPosts = async (params?: {
  category?: string;
  featured?: boolean;
}): Promise<ApiResponse<BlogListResponse>> => {
  const queryParams = new URLSearchParams();
  if (params?.category) queryParams.append('category', params.category);
  if (params?.featured) queryParams.append('featured', 'true');

  const url = `${API_BASE_URL}/api/v1/blog${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
  const res = await fetch(url);

  const json = (await res.json()) as ApiResponse<BlogListResponse>;

  if (!res.ok) {
    throw new Error(json.error || 'Failed to fetch blog posts');
  }

  return json;
};

export const getBlogPost = async (slug: string): Promise<ApiResponse<BlogPost>> => {
  const res = await fetch(`${API_BASE_URL}/api/v1/blog/${slug}`);

  const json = (await res.json()) as ApiResponse<BlogPost>;

  if (!res.ok) {
    throw new Error(json.error || 'Blog post not found');
  }

  return json;
};
