export interface Language {
  code: string;
  flag: string;
  name: string;
}

export interface GeneratedContent {
  instagramPost: string;
  productStory: string;
  videoScript: string;
}

export interface MockPricing {
  suggested: number;
  range: {
    min: number;
    max: number;
  };
  reasoning: string;
}

export interface ContentCardProps {
  title: string;
  content: string;
  cardType: string;
  icon: React.ElementType;
}