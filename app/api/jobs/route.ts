import { NextResponse } from 'next/server'
import { jobs } from '@/lib/jobStore'

export async function GET() {
  try {
    const allJobs = Array.from(jobs.values()).sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    return NextResponse.json(allJobs)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
