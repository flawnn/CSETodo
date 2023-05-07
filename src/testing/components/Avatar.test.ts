/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { fireEvent, queryByAttribute, render } from '@testing-library/svelte';
import { describe } from 'vitest';

const getById = queryByAttribute.bind(null, 'id');

const logoutMock = vi.fn();

vi.mock('../../components/utils/user_ops', () => {
	return {
		ops: {
			logout: logoutMock
		}
	};
});

import AvatarElement from '../../components/Avatar.svelte';

describe('Avatar Component', () => {
	afterEach(async () => {
		vi.restoreAllMocks();
	});

	it('logs out', async () => {
		const comp = render(AvatarElement, {
			client_id: '',
			public_key: ''
		});

		const avatarHitbox = getById(comp.container, 'dropdownDividerButton');
		expect(avatarHitbox).not.toBeNull();

		await fireEvent.click(avatarHitbox!);

		const logoutButton = comp.getByLabelText('Logout User');
		expect(logoutButton).not.toBeNull();

		await fireEvent.click(logoutButton!);

		expect(logoutMock).toHaveBeenCalled();
	});
});
