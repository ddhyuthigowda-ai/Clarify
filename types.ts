export enum SimplificationLevel {
  MiddleSchool = "Very Simple (Middle School)",
  HighSchool = "Simple (High School)",
  BulletPoints = "Actionable Bullet Points"
}

export interface SimplifyOptions {
  level: SimplificationLevel;
  includeExamples: boolean;
  highlightDeadlines: boolean;
}

export interface SimplifiedResult {
  original: string;
  simplified: string;
  timestamp: number;
}