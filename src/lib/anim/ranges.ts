export type Range = { start: number; end: number };
export const RANGES = {
	intro: { start: 0, end: 1000 },
	sky: { start: 1000, end: 2200 },
	city: { start: 2200, end: 3200 },
	forest: { start: 3200, end: 4200 }
} as const;
export type RangeKey = keyof typeof RANGES;
