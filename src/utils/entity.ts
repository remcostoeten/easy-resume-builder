import { nanoid } from 'nanoid';
import type { TCreateEntity, TEntityBase } from '../types/base';

export function createEntity<T extends TEntityBase>(data: TCreateEntity<T>): T {
	const now = new Date();
	return {
		...data,
		id: nanoid(),
		createdAt: now,
		updatedAt: now,
	} as T;
}

export function updateEntity<T extends TEntityBase>(
	entity: T,
	updates: Partial<Omit<T, keyof TEntityBase>>
): T {
	return {
		...entity,
		...updates,
		updatedAt: new Date(),
	};
}
