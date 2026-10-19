/**
 * DOSA HOUSE - Recipe & Cooking Data Types
 */

export interface IngredientRequirement {
  id: string;
  name: string;
  icon: string;
  required: boolean;
  amountText: string;
  culinaryRole?: string;
}

export type DosaFoldType = 'triangle' | 'cylinder' | 'half_moon' | 'open_face';

export interface CookingStep {
  stepNumber: number;
  instruction: string;
  targetTemp?: 'low' | 'medium' | 'high';
  durationSeconds?: number;
}

export interface PreparationStage {
  stageNumber: number;
  title: string;
  detail: string;
  icon: string;
  proTip: string;
}

export interface Recipe {
  id: string;
  name: string;
  tamilName: string;
  tagline: string;
  description: string;
  difficulty: 1 | 2 | 3;
  cookingTimeSec: number;
  calories: string;
  foldType: DosaFoldType;
  imageKey: string;
  ingredients: IngredientRequirement[];
  steps: CookingStep[];
  prepStages: PreparationStage[];
  condiments: string[];
  lore: string;
  unlockedByDefault: boolean;
}

export interface CustomerOrder {
  id: string;
  customerName: string;
  tableNumber: number;
  recipeId: string;
  recipeName: string;
  dishImageKey: string;
  crispinessPreference: 'soft' | 'medium' | 'extra_crispy';
  extraGhee: boolean;
  specialNote: string;
  timeLimitSec: number;
  rewardCoins: number;
}

export type TawaHeatState = 'off' | 'warming' | 'ready' | 'too_hot' | 'burnt';

export type CookingPhase = 
  | 'idle'
  | 'seasoning_oil'
  | 'pouring_batter'
  | 'swirling_batter'
  | 'crisping'
  | 'adding_ghee'
  | 'adding_toppings'
  | 'folding'
  | 'plating'
  | 'served';

export interface TawaState {
  temperature: number; // 0 - 100
  heatState: TawaHeatState;
  currentPhase: CookingPhase;
  batterSwirlProgress: number; // 0 - 100%
  goldenRoastProgress: number; // 0 - 100%
  hasGhee: boolean;
  toppingsApplied: string[];
}
