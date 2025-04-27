export type WordType = {
  id: string;
  term: string;
  definition: string;
  phonetic: string;
  tags: string[];
  createdAt: Date;
  lastReviewed: Date | null;
  reviewCount: number;
  mastery: number;
};