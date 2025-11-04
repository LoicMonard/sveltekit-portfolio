export type Experience = {
	companyName: string;
	dateStart: Date;
	dateEnd: Date;
	description?: string;
	icon?: string;
	iconBgColor?: string;
	isFreelance?: boolean;
	skills?: string[];
	component?: any; // Svelte component for rendering the experience
};
export type ExperienceList = Experience[];
