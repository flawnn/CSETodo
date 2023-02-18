import { v4 as uuidv4 } from 'uuid';
import type { LayoutServerLoad } from "./$types";

export const load = (async () => {
	let uuid = window.localStorage.getItem("device_id");

	if(uuid == null){
		uuid = uuidv4();
		window.localStorage.setItem("device_id", uuid);
	} 
	
	return {
		device_id: uuid,
	};
}) satisfies LayoutServerLoad;
