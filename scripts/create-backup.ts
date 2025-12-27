// scripts/create-backup.ts
import { JsonBackupService } from '../lib/backup/json-backup';

async function createBackup() {
  try {
    console.log('Creating initial JSON backup...');
    await JsonBackupService.exportToJson();
    console.log('✅ Backup created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Backup failed:', error);
    process.exit(1);
  }
}

createBackup();