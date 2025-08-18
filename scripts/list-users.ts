#!/usr/bin/env bun

/**
 * Script to list all users in the database
 * Usage: bun scripts/list-users.ts
 */

import { db } from '../src/server/db';
import { user } from '../src/lib/db/schema';

async function listUsers() {
  console.log('📋 Fetching all users from database...\n');
  
  try {
    const users = await db.select().from(user);
    
    if (users.length === 0) {
      console.log('❌ No users found in the database.');
      console.log('\n💡 To create a user:');
      console.log('   1. Start the app: bun run dev');
      console.log('   2. Navigate to http://localhost:3003/register');
      console.log('   3. Create an account');
      console.log('   4. Then run: bun scripts/seed-admin.ts to promote users to admin');
      return;
    }
    
    console.log(`Found ${users.length} user(s):\n`);
    console.log('='.repeat(80));
    
    users.forEach((u, index) => {
      console.log(`User #${index + 1}`);
      console.log(`  ID:              ${u.id}`);
      console.log(`  Name:            ${u.name}`);
      console.log(`  Email:           ${u.email}`);
      console.log(`  Role:            ${u.role || 'user'}`);
      console.log(`  Email Verified:  ${u.emailVerified ? '✓' : '✗'}`);
      console.log(`  2FA Enabled:     ${u.twoFactorEnabled ? '✓' : '✗'}`);
      console.log(`  Created:         ${u.createdAt}`);
      console.log(`  Updated:         ${u.updatedAt}`);
      console.log('-'.repeat(80));
    });
    
    // Summary
    const adminCount = users.filter(u => u.role === 'admin').length;
    const verifiedCount = users.filter(u => u.emailVerified).length;
    
    console.log('\n📊 Summary:');
    console.log(`  Total Users:     ${users.length}`);
    console.log(`  Admins:          ${adminCount}`);
    console.log(`  Regular Users:   ${users.length - adminCount}`);
    console.log(`  Verified Emails: ${verifiedCount}`);
    
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  listUsers()
    .then(() => {
      console.log('\n✅ Done');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Failed:', error);
      process.exit(1);
    });
}
