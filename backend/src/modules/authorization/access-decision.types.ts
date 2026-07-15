export type GameAccessSource = 'subscription' | 'administrator' | 'allGamesGrant';

export interface AuthorizedGame {
  source: GameAccessSource;
  game: {
    id: string;
    slug: string;
    name: string;
    requiredPlan: 'free' | 'premium' | 'ultimate';
  };
  content: unknown;
  contentVersion: number;
}
