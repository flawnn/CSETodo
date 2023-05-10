import type { Todos } from '$root/types/helper/Todo';
import { Config } from '../../../config';

export const ComponentFixtures = {
	todos: Config.defaultTodos,
	todosAmount: 4,
	todo: { id: '420', text: 'TEST', completed: true } satisfies Todos
};
