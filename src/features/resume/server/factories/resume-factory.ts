import { and, eq } from 'drizzle-orm';
import { db } from '@/server/db';
import type { TCreateResume, TResume } from '../schemas';
import { resumeTable } from '../schemas';

type TResumeFactory = {
	create: (data: Omit<TCreateResume, 'id' | 'created_at' | 'updated_at'>) => Promise<TResume>;
	read: (id: number) => Promise<TResume | null>;
	update: (id: number, data: Partial<TCreateResume>) => Promise<TResume>;
	destroy: (id: number) => Promise<void>;
	listByUserId: (userId: string) => Promise<TResume[]>;
};

export function createResumeFactory(): TResumeFactory {
	async function create(data: Omit<TCreateResume, 'id' | 'created_at' | 'updated_at'>) {
		const [result] = await db.insert(resumeTable).values(data).returning();
		return result;
	}

	async function read(id: number) {
		const [result] = await db.select().from(resumeTable).where(eq(resumeTable.id, id));
		return result || null;
	}

	async function update(id: number, data: Partial<TCreateResume>) {
		const updateData = {
			...data,
			lastModified: new Date(),
			updated_at: new Date(),
		};
		const [result] = await db
			.update(resumeTable)
			.set(updateData)
			.where(eq(resumeTable.id, id))
			.returning();
		return result;
	}

	async function destroy(id: number) {
		await db.delete(resumeTable).where(eq(resumeTable.id, id));
	}

	async function listByUserId(userId: string) {
		const results = await db
			.select()
			.from(resumeTable)
			.where(and(eq(resumeTable.userId, userId), eq(resumeTable.isActive, true)));
		return results;
	}

	return {
		create,
		read,
		update,
		destroy,
		listByUserId,
	};
}
