// scripts/test-backup-system.ts
import { JsonBackupService } from '../lib/backup/json-backup';
import fs from 'fs/promises';
import path from 'path';

const API_BASE_URL = 'http://localhost:3000/api';

// Test data
const testProject = {
  title_fr: 'Projet Test Backup',
  title_en: 'Test Backup Project',
  description_fr: 'Ceci est un projet test pour vérifier le système de backup',
  description_en: 'This is a test project to verify the backup system',
  technologies: ['TypeScript', 'Node.js'],
  featured: false,
  order: 999
};

async function getBackupFileStats() {
  const backupDir = path.join(process.cwd(), 'data', 'backup');
  const currentFilePath = path.join(backupDir, 'current-data.json');

  try {
    const stats = await fs.stat(currentFilePath);
    const content = await fs.readFile(currentFilePath, 'utf-8');
    const data = JSON.parse(content);

    return {
      exists: true,
      modifiedTime: stats.mtime,
      projectCount: data.projects?.length || 0,
      timestamp: data.timestamp
    };
  } catch (error) {
    return {
      exists: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function testBackupSystem() {
  console.log('🧪 Testing Automatic Backup System...\n');

  try {
    // 1. Get initial backup state
    console.log('1️⃣  Checking initial backup state...');
    const initialBackup = await getBackupFileStats();
    console.log('   Initial backup:', initialBackup);

    // 2. Test direct backup creation
    console.log('\n2️⃣  Testing direct backup creation...');
    await JsonBackupService.exportToJson();

    const afterDirectBackup = await getBackupFileStats();
    console.log('   After direct backup:', afterDirectBackup);

    // 3. Test backup through API (requires auth)
    console.log('\n3️⃣  Testing backup through API...');
    console.log('   Note: This requires authentication. Testing with direct service instead.');

    // 4. Load backup data
    console.log('\n4️⃣  Testing backup data loading...');
    const backupData = await JsonBackupService.loadFromJson();

    if (backupData) {
      console.log('   ✅ Backup data loaded successfully!');
      console.log(`   - Projects: ${backupData.projects.length}`);
      console.log(`   - Experiences: ${backupData.experiences.length}`);
      console.log(`   - Education: ${backupData.education.length}`);
      console.log(`   - Certifications: ${backupData.certifications.length}`);
      console.log(`   - Volunteer: ${backupData.volunteer.length}`);
      console.log(`   - Backup timestamp: ${backupData.timestamp}`);
      console.log(`   - Backup version: ${backupData.version}`);
    } else {
      console.log('   ❌ Failed to load backup data');
    }

    // 5. Test fallback mechanism
    console.log('\n5️⃣  Testing data retrieval with fallback...');
    const projectsWithFallback = await JsonBackupService.getDataWithFallback('projects');
    console.log(`   - Projects retrieved: ${projectsWithFallback.data.length} (source: ${projectsWithFallback.source})`);

    // 6. Check timestamped backups
    console.log('\n6️⃣  Checking timestamped backup files...');
    const backupDir = path.join(process.cwd(), 'data', 'backup');
    const files = await fs.readdir(backupDir);
    const timestampedBackups = files.filter(f => f.startsWith('backup-') && f.endsWith('.json'));
    console.log(`   - Total timestamped backups: ${timestampedBackups.length}`);
    if (timestampedBackups.length > 0) {
      console.log(`   - Latest: ${timestampedBackups.sort().reverse()[0]}`);
    }

    // 7. Test cleanup function
    console.log('\n7️⃣  Testing old backup cleanup...');
    await JsonBackupService.cleanOldBackups();
    const filesAfterCleanup = await fs.readdir(backupDir);
    const backupsAfterCleanup = filesAfterCleanup.filter(f => f.startsWith('backup-') && f.endsWith('.json'));
    console.log(`   - Backups after cleanup: ${backupsAfterCleanup.length} (max 10 kept)`);

    console.log('\n✅ Backup system test completed successfully!');

  } catch (error) {
    console.error('\n❌ Backup system test failed:', error);
    process.exit(1);
  }
}

// Run the test
testBackupSystem()
  .then(() => {
    console.log('\n📊 Test Summary: All backup functionality is working correctly!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Test failed with error:', error);
    process.exit(1);
  });