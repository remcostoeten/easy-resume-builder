'use server';

import { createResumeFactory } from '../factories';
import type { TCreateResume, TResume } from '../schemas';

const resumeFactory = createResumeFactory();

export async function listUserResumes(userId: string): Promise<TResume[]> {
	return await resumeFactory.listByUserId(userId);
}

export async function createUserResume(
	data: Omit<TCreateResume, 'id' | 'created_at' | 'updated_at'>
): Promise<TResume> {
	return await resumeFactory.create(data);
}

export async function getUserResume(id: number): Promise<TResume | null> {
	return await resumeFactory.read(id);
}

export async function updateUserResume(id: number, data: Partial<TCreateResume>): Promise<TResume> {
	return await resumeFactory.update(id, data);
}

export async function deleteUserResume(id: number): Promise<void> {
	return await resumeFactory.destroy(id);
}
