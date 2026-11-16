import { User } from '../models/User.model.js';
import { Account } from '../models/Account.model.js';
import { Conversation } from '../models/Conversation.model.js';
import { seedUsers, seedAccounts, seedConversations } from '../data/seedData.js';

/**
 * Idempotent Database Seeder for Relay
 * Seeds demo users, connected accounts, and initial executive conversations
 * without duplicating records or overwriting runtime modifications on restarts.
 */
export const seedDatabase = async () => {
  try {
    // 1. Seed Users (idempotent via $setOnInsert)
    for (const user of seedUsers) {
      await User.findOneAndUpdate(
        { id: user.id },
        { $setOnInsert: user },
        { upsert: true, new: true }
      );
    }

    // 2. Seed Accounts (idempotent via $setOnInsert)
    for (const account of seedAccounts) {
      await Account.findOneAndUpdate(
        { id: account.id },
        { $setOnInsert: account },
        { upsert: true, new: true }
      );
    }

    // 3. Seed Conversations (idempotent via $setOnInsert)
    for (const conv of seedConversations) {
      const convData = { ...conv };
      if (convData.needsReview === undefined) {
        convData.needsReview = convData.responsibility === 'review' || (convData.confidenceScore && convData.confidenceScore < 0.75);
      }
      if (convData.isManualOverride === undefined) {
        convData.isManualOverride = false;
      }
      if (convData.pendingSuggestion === undefined) {
        convData.pendingSuggestion = null;
      }
      if (!convData.importantInformation) {
        convData.importantInformation = [];
      }
      if (!convData.identifiedDates) {
        convData.identifiedDates = [];
      }

      await Conversation.findOneAndUpdate(
        { id: convData.id },
        { $setOnInsert: convData },
        { upsert: true, new: true }
      );
    }

    const userCount = await User.countDocuments();
    const accountCount = await Account.countDocuments();
    const convCount = await Conversation.countDocuments();

    console.log(`[Relay Seeder] Database seeded/verified (Users: ${userCount}, Accounts: ${accountCount}, Conversations: ${convCount})`);
  } catch (error) {
    console.error('[Relay Seeder] Seeding error:', error.message);
    throw error;
  }
};
