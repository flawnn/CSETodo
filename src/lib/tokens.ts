import type { IDatabase } from '$root/types/database/IDatabase';
import type { IUserService } from '$root/types/database/IUserService';
import { token } from 'brandi';

export const TOKENS = {
	UserService: token<IUserService>('UserService'),
	Database: token<IDatabase>('Database')
};
