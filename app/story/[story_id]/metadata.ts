import { Metadata } from 'next'

type Props = {
  params: { story_id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // You can fetch the story data here if needed
  // For now using static metadata
  return {
    title: 'Story | Art Journey',
    description: 'Discover the story behind this artistic journey',
    openGraph: {
      title: 'Story | Art Journey',
      description: 'Discover the story behind this artistic journey',
      type: 'article',
    },
  }
}