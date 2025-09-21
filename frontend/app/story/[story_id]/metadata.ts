import { Metadata } from 'next'

type Props = {
  params: { story_id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // You can fetch the story data here if needed
  // For now using static metadata
  return {
    title: 'Artisan Story | KalaConnect',
    description: 'Discover the story behind this artistic journey through KalaConnect',
    icons: {
      icon: '/favicon.ico',
      apple: '/apple-touch-icon.png',
    },
    openGraph: {
      title: 'Artisan Story | KalaConnect',
      description: 'Discover the story behind this artistic journey through KalaConnect',
      images: ['https://res.cloudinary.com/dlspc4akf/image/upload/v1758462061/Screenshot_2025-09-21_125102_lferqv.png'],
      type: 'article',
    },
  }
}