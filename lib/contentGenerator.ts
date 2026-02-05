// AI-powered content generation

export interface RankingContent {
  rank: number
  title: string
  description: string
  reasoning: string
}

export class ContentGenerator {
  private apiKey: string

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || ''
  }

  /**
   * Generates a ranked list for a given niche
   */
  async generateRankingList(niche: string, count: number): Promise<RankingContent[]> {
    if (!this.apiKey) {
      console.warn('OpenAI API key not configured, using fallback')
      return this.generateFallbackList(niche, count)
    }

    try {
      // In production, use OpenAI API:
      // const openai = new OpenAI({ apiKey: this.apiKey })
      // const response = await openai.chat.completions.create({
      //   model: 'gpt-4',
      //   messages: [{
      //     role: 'user',
      //     content: `Generate a top ${count} ranking list for "${niche}".
      //               Return JSON array with: rank, title, description, reasoning.
      //               Make it engaging for YouTube viewers.`
      //   }],
      //   response_format: { type: 'json_object' }
      // })
      // return JSON.parse(response.choices[0].message.content)

      return this.generateFallbackList(niche, count)
    } catch (error) {
      console.error('Error generating content:', error)
      return this.generateFallbackList(niche, count)
    }
  }

  private generateFallbackList(niche: string, count: number): RankingContent[] {
    const items: RankingContent[] = []
    for (let i = 1; i <= count; i++) {
      items.push({
        rank: i,
        title: `${niche} - Choice #${i}`,
        description: `This is an excellent option in the ${niche.toLowerCase()} category.`,
        reasoning: `Ranked #${i} for its outstanding features and performance.`
      })
    }
    return items
  }

  /**
   * Generates video title and description
   */
  async generateVideoMetadata(niche: string, rankings: RankingContent[]): Promise<{
    title: string
    description: string
    tags: string[]
  }> {
    const title = `Top ${rankings.length} ${niche} You Need to Know!`
    const description = `🔥 Check out our ranking of the best ${niche}!\n\n` +
      rankings.map(r => `#${r.rank}: ${r.title}\n${r.description}`).join('\n\n') +
      '\n\n' +
      '👍 Like and Subscribe for more rankings!\n' +
      '#ranking #top' + rankings.length + ' #' + niche.replace(/\s+/g, '')

    const tags = [
      niche,
      'ranking',
      `top ${rankings.length}`,
      'best',
      'review',
      'comparison'
    ]

    return { title, description, tags }
  }
}

export const contentGenerator = new ContentGenerator()
