import { db } from 'db';
import { sql } from 'drizzle-orm';

export async function getDbMetrics() {
	const start = Date.now();
	try {
		await db.execute(sql`SELECT 1`);
		const latency = Date.now() - start;

		return {
			ok: true,
			latency,
			timestamp: new Date().toISOString(),
		};
	} catch (e: any) {
		return {
			ok: false,
			error: e.message,
			timestamp: new Date().toISOString(),
		};
	}
}
