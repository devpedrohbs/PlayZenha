export type GamePlan = 'free' | 'premium' | 'ultimate';

export type GameStatus = 'available' | 'coming-soon' | 'disabled';

export type GameDifficulty = 'easy' | 'medium' | 'hard';

export interface Game {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  category: string;
  minPlayers: number;
  maxPlayers: number;
  averageDurationMinutes: number;
  difficulty: GameDifficulty;
  status: GameStatus;
  requiredPlan: GamePlan;
  tags: readonly string[];
  featured: boolean;
  isNew: boolean;
  icon: string | null;
  colors: readonly string[];
}
