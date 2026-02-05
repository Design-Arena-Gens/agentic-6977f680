import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { jobs } from '@/lib/jobStore'

export async function POST(request: NextRequest) {
  try {
    const { niche, topicCount } = await request.json()

    if (!niche || !topicCount) {
      return NextResponse.json(
        { error: 'Niche and topic count are required' },
        { status: 400 }
      )
    }

    const jobId = uuidv4()
    const job = {
      id: jobId,
      niche,
      topicCount,
      status: 'pending' as const,
      progress: 0,
      createdAt: new Date().toISOString()
    }

    jobs.set(jobId, job)

    // Start processing in background
    processJob(jobId, niche, topicCount).catch(error => {
      const job = jobs.get(jobId)
      if (job) {
        job.status = 'failed'
        job.error = error.message
        jobs.set(jobId, job)
      }
    })

    return NextResponse.json({ jobId, message: 'Job created successfully' })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

async function processJob(jobId: string, niche: string, topicCount: number) {
  const job = jobs.get(jobId)
  if (!job) return

  try {
    job.status = 'processing'
    job.progress = 10
    jobs.set(jobId, job)

    // Step 1: Generate ranking list
    job.progress = 20
    jobs.set(jobId, job)
    const rankings = await generateRankingList(niche, topicCount)

    // Step 2: Find video clips
    job.progress = 40
    jobs.set(jobId, job)
    const videoClips = await findVideoClips(rankings)

    // Step 3: Download clips (simulated)
    job.progress = 60
    jobs.set(jobId, job)
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Step 4: Compile video (simulated)
    job.progress = 80
    jobs.set(jobId, job)
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Step 5: Upload to YouTube (simulated)
    job.progress = 95
    jobs.set(jobId, job)
    const videoUrl = await uploadToYouTube(niche, rankings)

    job.status = 'completed'
    job.progress = 100
    job.videoUrl = videoUrl
    jobs.set(jobId, job)

  } catch (error: any) {
    job.status = 'failed'
    job.error = error.message
    jobs.set(jobId, job)
  }
}

async function generateRankingList(niche: string, count: number) {
  // Simulated AI-generated rankings
  const items = []
  for (let i = 1; i <= count; i++) {
    items.push({
      rank: i,
      title: `${niche} Option ${i}`,
      description: `This is a great choice for ${niche.toLowerCase()}`
    })
  }
  return items
}

async function findVideoClips(rankings: any[]) {
  // Simulated video search
  return rankings.map(item => ({
    ...item,
    videoId: `sim_video_${item.rank}`,
    clipUrl: `https://example.com/clip_${item.rank}.mp4`
  }))
}

async function uploadToYouTube(niche: string, rankings: any[]) {
  // Simulated YouTube upload
  // In production, this would use googleapis to upload
  return `https://youtube.com/watch?v=DEMO_${Date.now()}`
}
