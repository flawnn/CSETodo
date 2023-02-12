/** @type {import('./$types').LayoutServerLoad} */
export interface ApplicationData {
	user: UserData;
}

export interface UserData {
	username: string;
}

export async function load(): Promise<ApplicationData> {
	return {
		user: {username: "flawn"}
	};
}
