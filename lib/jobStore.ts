// In-memory job storage (use Redis in production)

export interface Job {
  id: string
  niche: string
  topicCount: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  videoUrl?: string
  error?: string
  createdAt: string
}

export const jobs = new Map<string, Job>()
