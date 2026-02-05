# YouTube Ranking Video Autopilot

Automatically generate and publish ranking videos (Top 5, Top 10, etc.) by clipping same-niche videos together.

## Features

- 🎬 Automated ranking video generation
- 🤖 AI-powered content ranking
- 📹 YouTube video search and clip extraction
- 🎥 Automatic video compilation with FFmpeg
- 📤 Direct YouTube upload
- 📊 Job queue management
- 🎨 Modern web UI

## Setup

### Prerequisites

1. Node.js 18+ and npm
2. FFmpeg installed on your system
3. YouTube Data API v3 credentials
4. OpenAI API key (optional, for AI rankings)
5. Redis (optional, for production job queue)

### Installation

```bash
npm install
```

### Configuration

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Get YouTube API credentials:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project
   - Enable YouTube Data API v3
   - Create OAuth 2.0 credentials
   - Get refresh token using OAuth playground

3. Get OpenAI API key:
   - Go to [OpenAI Platform](https://platform.openai.com/)
   - Create API key

4. Update `.env.local` with your credentials

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production

```bash
npm run build
npm start
```

## How It Works

1. **Input**: User specifies niche and number of items (1-10)
2. **AI Generation**: System generates ranked list of items
3. **Video Search**: Finds relevant YouTube videos for each item
4. **Clip Extraction**: Downloads and extracts clips from videos
5. **Video Compilation**: Combines clips with countdown overlays
6. **Upload**: Automatically uploads to YouTube with metadata
7. **Tracking**: Monitor progress via web UI

## Architecture

- **Frontend**: Next.js + React + Tailwind CSS
- **Backend**: Next.js API Routes
- **Video Processing**: FFmpeg (fluent-ffmpeg)
- **AI Content**: OpenAI GPT-4
- **YouTube**: Google APIs
- **Job Queue**: Bull + Redis (or in-memory for demo)

## API Endpoints

- `POST /api/generate` - Create new ranking video job
- `GET /api/jobs` - Get all jobs and their status

## Production Considerations

### Required Services

1. **Video Processing Server**: FFmpeg-enabled server with sufficient CPU/RAM
2. **Storage**: S3 or similar for temporary video files
3. **Redis**: For job queue persistence
4. **YouTube Quota**: Monitor daily API quota usage

### Scaling

- Use worker processes for video processing
- Implement rate limiting for YouTube API
- Use CDN for static assets
- Consider serverless functions for API endpoints

### Legal Considerations

⚠️ **Important**: Ensure you have rights to use video content:
- Only use Creative Commons or licensed content
- Respect copyright and fair use laws
- Add proper attribution
- Consider using stock footage instead

## Limitations (Demo Mode)

This demo includes simulated:
- Video clip downloading
- Video compilation
- YouTube upload

To enable full functionality:
1. Implement actual YouTube video downloading (yt-dlp)
2. Implement FFmpeg video compilation
3. Configure YouTube OAuth for uploads
4. Set up Redis for job persistence

## License

MIT