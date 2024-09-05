export interface GameState {
  player_wins: number;
  ai_wins: number;
  games_played: number;
  draws: number;
}

export interface GameEvent {
  data: {
    player_choice: string;
    ai_choice: string;
    result: string;
  };
  sequence_number: string;
  type: string;
}

export interface Achievement {
  id: number;
  name: string;
  description: string;
  unlocked: boolean;
  claimed: boolean;
}

export interface AchievementsResource {
  achievements: Achievement[];
}