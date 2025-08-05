import type { TBaseEntity } from './base-entity';

// Base entity types with timestamps and ID
export type TEntityBase = TBaseEntity;

// Utility type for creating new entities
export type TCreateEntity<T> = Omit<T, keyof TEntityBase>;

// Utility type for updating entities
export type TUpdateEntity<T> = Partial<Omit<T, 'id' | 'createdAt'>> & {
	readonly id: string;
	readonly updatedAt: Date;
};
