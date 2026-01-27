// lib/utils/auto-backup.ts
import { JsonBackupService } from '@/lib/backup/json-backup';

/**
 * Wrapper to automatically create JSON backup after database modifications
 */
export async function withAutoBackup<T>(
  operation: () => Promise<T>,
  operationName?: string
): Promise<T> {
  // Execute the database operation
  const result = await operation();

  // Run backup in the background (non-blocking)
  JsonBackupService.exportToJson()
    .then(() => {
      console.log(`✅ Auto-backup completed after: ${operationName || 'database operation'}`);
    })
    .catch((error) => {
      console.error('❌ Auto-backup failed:', error);
      // Don't throw - we don't want backup failures to break the main operation
    });

  return result;
}

/**
 * Manual backup trigger
 */
export async function triggerBackup(): Promise<void> {
  await JsonBackupService.exportToJson();
  await JsonBackupService.cleanOldBackups();
}