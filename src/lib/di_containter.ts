/* container.ts */

import { Container } from 'brandi';

import { Database } from '$root/database/db';
import { UserService } from '$root/database/services/users';
import { TOKENS } from './tokens';

const container = new Container();

container.bind(TOKENS.UserService).toInstance(UserService).inSingletonScope();

container.bind(TOKENS.Database).toInstance(Database).inSingletonScope();

export { container };
