export type Todos = {
	id: string;
	text: string;
	completed: boolean;
};

export enum FiltersType {
	all,
	active,
	completed
}

export const FiltersTypeKeys = Object.keys(FiltersType).map((el) => el as keyof typeof FiltersType);
