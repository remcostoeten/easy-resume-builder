#!/usr/bin/env bun

/**
 * One-off script to mark initial admins
 * 
 * Usage:
 *   1. First, list existing users: bun scripts/list-users.ts
 *   2. Edit the adminUsers array below with real user emails or IDs
 *   3. Run: bun scripts/seed-admin.ts
 * 
 * This script updates user rows by id/email setting admin = true
 */

import { eq, or } from 'drizzle-orm';
import { db } from '../src/server/db';
import { user } from '../src/features/auth/server/better-auth-schema';

type TAdminUser = {
  id?: string;
  email?: string;
};

async function seedAdmins() {
  console.log('🔧 Seeding admin users...\n');
  
  const adminUsersRaw = process.env.ADMIN_USERS;

  if (!adminUsersRaw) {
    console.error('❌ Error: ADMIN_USERS environment variable is not set.');
    console.log('Please set it to a comma-separated list of user emails or IDs.');
    process.exit(1);
  }

  const adminUsers: TAdminUser[] = adminUsersRaw.split(',').map(u => u.trim()).map(identifier => {
    // A simple check to differentiate between email and ID
    if (identifier.includes('@')) {
      return { email: identifier };
    } else {
      return { id: identifier };
    }
  });

  const results = [];
  
  for (const adminUser of adminUsers) {
    try {
      const whereCondition = adminUser.id 
        ? eq(user.id, adminUser.id)
        : eq(user.email, adminUser.email!);
      
      const existingUsers = await db
        .select()
        .from(user)
        .where(whereCondition);
      
      if (existingUsers.length === 0) {
        console.log(`⚠️  User not found: ${adminUser.id || adminUser.email}`);
        results.push({ 
          identifier: adminUser.id || adminUser.email, 
          status: 'not_found' 
        });
        continue;
      }
      
      const existingUser = existingUsers[0];
      
      if (existingUser.admin) {
        console.log(`✅ User already admin: ${existingUser.email}`);
        results.push({ 
          identifier: existingUser.email, 
          status: 'already_admin' 
        });
        continue;
      }
      
      const [updatedUser] = await db
        .update(user)
        .set({ 
          admin: true,
          updatedAt: new Date()
        })
        .where(whereCondition)
        .returning();
      
      console.log(`🚀 Promoted to admin: ${updatedUser.email}`);
      results.push({ 
        identifier: updatedUser.email, 
        status: 'promoted' 
      });
      
    } catch (error) {
      console.error(`❌ Error processing ${adminUser.id || adminUser.email}:`, error);
      results.push({ 
        identifier: adminUser.id || adminUser.email, 
        status: 'error' 
      });
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('📋 ADMIN SEEDING SUMMARY');
  console.log('='.repeat(50));
  
  const promoted = results.filter(r => r.status === 'promoted');
  const alreadyAdmin = results.filter(r => r.status === 'already_admin');
  const notFound = results.filter(r => r.status === 'not_found');
  const errors = results.filter(r => r.status === 'error');
  
  console.log(`✅ Newly promoted: ${promoted.length}`);
  console.log(`🔄 Already admin: ${alreadyAdmin.length}`);
  console.log(`❓ Not found: ${notFound.length}`);
  console.log(`❌ Errors: ${errors.length}`);
  
  if (promoted.length > 0) {
    console.log('\n🎉 Successfully promoted:');
    promoted.forEach(result => console.log(`   - ${result.identifier}`));
  }
  
  if (notFound.length > 0) {
    console.log('\n⚠️  Users not found:');
    notFound.forEach(result => console.log(`   - ${result.identifier}`));
  }
  
  console.log('='.repeat(50));
}

if (require.main === module) {
  seedAdmins()
    .then(() => {
      console.log('\n✅ Admin seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Admin seeding failed:', error);
      process.exit(1);
    });
}
