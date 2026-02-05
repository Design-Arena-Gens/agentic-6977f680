'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

interface Job {
  id: string
  niche: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  videoUrl?: string
  error?: string
  createdAt: string
}

export default function Home() {
  const [niche, setNiche] = useState('')
  const [topicCount, setTopicCount] = useState(5)
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchJobs()
    const interval = setInterval(fetchJobs, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchJobs = async () => {
    try {
      const response = await axios.get('/api/jobs')
      setJobs(response.data)
    } catch (error) {
      console.error('Error fetching jobs:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await axios.post('/api/generate', {
        niche,
        topicCount
      })
      alert(`Job created! ID: ${response.data.jobId}`)
      setNiche('')
      fetchJobs()
    } catch (error: any) {
      alert(`Error: ${error.response?.data?.error || error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600'
      case 'processing': return 'text-blue-600'
      case 'failed': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          YouTube Ranking Video Autopilot
        </h1>

        <div className="bg-white rounded-lg shadow-xl p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Create New Ranking Video</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Niche / Topic
              </label>
              <input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="e.g., Best Gaming Laptops, Top Horror Movies, etc."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Items (1-10)
              </label>
              <input
                type="number"
                value={topicCount}
                onChange={(e) => setTopicCount(Number(e.target.value))}
                min="1"
                max="10"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Creating Job...' : 'Generate Ranking Video'}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-6">
          <h2 className="text-2xl font-semibold mb-4">Job Queue</h2>

          {jobs.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No jobs yet. Create your first ranking video above!</p>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{job.niche}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(job.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <span className={`font-semibold uppercase text-sm ${getStatusColor(job.status)}`}>
                      {job.status}
                    </span>
                  </div>

                  {job.status === 'processing' && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full transition-all"
                          style={{ width: `${job.progress}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{job.progress}% complete</p>
                    </div>
                  )}

                  {job.status === 'completed' && job.videoUrl && (
                    <a
                      href={job.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View on YouTube →
                    </a>
                  )}

                  {job.status === 'failed' && job.error && (
                    <p className="text-red-600 text-sm mt-2">Error: {job.error}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 bg-yellow-100 border border-yellow-400 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">Setup Instructions:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-800">
            <li>Set up YouTube Data API v3 credentials in Google Cloud Console</li>
            <li>Add OAuth 2.0 credentials and get refresh token</li>
            <li>Add your API keys to .env.local file</li>
            <li>For production: Use Redis for job queue management</li>
            <li>Install FFmpeg on your server for video processing</li>
          </ol>
        </div>
      </div>
    </main>
  )
}
