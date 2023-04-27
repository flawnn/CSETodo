/* container.ts */

import { Container } from 'brandi';

import { DatabaseService } from '$root/database/db';
import { UserService } from '$root/database/services/users';
import { TOKENS } from './tokens';

const container = new Container();

container.bind(TOKENS.UserService).toInstance(UserService).inSingletonScope();

container.bind(TOKENS.Database).toInstance(DatabaseService).inSingletonScope();

export { container };
