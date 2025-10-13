export type Range = { start: number; end: number };
export const RANGES = {
	intro: { start: 0, end: 1000 },
	plane: { start: 500, end: 4200 },
	sky: { start: 0, end: 4200 },
	city: { start: 1800, end: 2100 },
	forest: { start: 2700, end: 4200 }
} as const;
export type RangeKey = keyof typeof RANGES;
