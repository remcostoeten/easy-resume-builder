// Base entity types with timestamps and ID
export type TEntityBase = {
  readonly id: string
  readonly createdAt: Date
  readonly updatedAt: Date
}

export type TTimestamps = Pick<TEntityBase, "createdAt" | "updatedAt">

// Utility type for creating new entities
export type TCreateEntity<T> = Omit<T, keyof TEntityBase>

// Utility type for updating entities
export type TUpdateEntity<T> = Partial<Omit<T, "id" | "createdAt">> & {
  readonly id: string
  readonly updatedAt: Date
}
