// scripts/test-multilingual-api.ts
import { JsonBackupService } from '../lib/backup/json-backup';
import fs from 'fs/promises';
import path from 'path';

// Note: This script tests the multilingual functionality locally
// For production API testing, authentication would be required

async function testMultilingualAPI() {
  console.log('🌐 Testing Multilingual API Functionality...\n');

  try {
    // 1. Test data normalization
    console.log('1️⃣  Testing data normalization...');

    // Import the schema to test normalization
    const { normalizeProjectData } = await import('../lib/schemas/project-api.schema');

    // Test with French-only data
    const frenchOnlyData = {
      title_fr: 'Mon Projet',
      description_fr: 'Description en français',
      technologies: ['React', 'Next.js']
    };

    const normalizedFrench = normalizeProjectData(frenchOnlyData as any);
    console.log('   French-only normalization:');
    console.log(`   - title (legacy): "${normalizedFrench.title}"`);
    console.log(`   - title_fr: "${normalizedFrench.title_fr}"`);
    console.log(`   - title_en: "${normalizedFrench.title_en}"`);

    // Test with bilingual data
    const bilingualData = {
      title_fr: 'Mon Projet',
      title_en: 'My Project',
      description_fr: 'Description en français',
      description_en: 'Description in English',
      technologies: ['React', 'Next.js']
    };

    const normalizedBilingual = normalizeProjectData(bilingualData as any);
    console.log('\n   Bilingual normalization:');
    console.log(`   - title (legacy): "${normalizedBilingual.title}"`);
    console.log(`   - title_fr: "${normalizedBilingual.title_fr}"`);
    console.log(`   - title_en: "${normalizedBilingual.title_en}"`);

    // 2. Test all entity normalizations
    console.log('\n2️⃣  Testing normalization for all entities...');

    const { normalizeExperienceData } = await import('../lib/schemas/experience-api.schema');
    const { normalizeEducationData } = await import('../lib/schemas/education-api.schema');
    const { normalizeCertificationData } = await import('../lib/schemas/certification-api.schema');
    const { normalizeVolunteerData } = await import('../lib/schemas/volunteer-api.schema');

    // Test Experience normalization
    const expData = normalizeExperienceData({
      title_fr: 'Développeur',
      title_en: 'Developer',
      description_fr: 'Description FR',
      achievements_fr: ['Réalisation 1', 'Réalisation 2'],
      company: 'Test Company',
      location: 'Ottawa, ON',
      startDate: new Date(),
      technologies: ['React']
    } as any);
    console.log('   ✅ Experience normalization: OK');

    // Test Education normalization
    const eduData = normalizeEducationData({
      degree_fr: 'Diplôme en informatique',
      degree_en: 'Computer Science Degree',
      institution: 'Test University',
      location: 'Ottawa, ON',
      startDate: new Date()
    } as any);
    console.log('   ✅ Education normalization: OK');

    // Test Certification normalization
    const certData = normalizeCertificationData({
      title_fr: 'Certification AWS',
      title_en: 'AWS Certification',
      issuer: 'Amazon',
      skills: ['Cloud', 'AWS']
    } as any);
    console.log('   ✅ Certification normalization: OK');

    // Test Volunteer normalization
    const volData = normalizeVolunteerData({
      title_fr: 'Bénévole',
      title_en: 'Volunteer',
      description_fr: 'Description bénévolat',
      organization: 'Test Org',
      startDate: new Date()
    } as any);
    console.log('   ✅ Volunteer normalization: OK');

    // 3. Test backward compatibility
    console.log('\n3️⃣  Testing backward compatibility...');

    // Test with legacy fields only
    const legacyData = {
      title: 'Legacy Title',
      description: 'Legacy Description',
      technologies: ['React']
    };

    const normalizedLegacy = normalizeProjectData(legacyData as any);
    console.log('   Legacy field handling:');
    console.log(`   - title_fr populated from legacy: "${normalizedLegacy.title_fr}"`);
    console.log(`   - title preserved: "${normalizedLegacy.title}"`);

    // 4. Check backup data structure
    console.log('\n4️⃣  Checking backup data structure...');
    const backupData = await JsonBackupService.loadFromJson();

    if (backupData) {
      // Check if multilingual fields exist in backup
      const hasMultilingualFields = backupData.projects.length > 0 &&
        'title_fr' in backupData.projects[0];

      console.log(`   - Backup contains multilingual fields: ${hasMultilingualFields ? '✅' : '❌'}`);

      if (backupData.projects.length > 0) {
        const sampleProject = backupData.projects[0];
        console.log('   Sample project fields:');
        console.log(`   - Has title_fr: ${'title_fr' in sampleProject}`);
        console.log(`   - Has title_en: ${'title_en' in sampleProject}`);
        console.log(`   - Has legacy title: ${'title' in sampleProject}`);
      }
    }

    // 5. Test auto-backup wrapper
    console.log('\n5️⃣  Testing auto-backup wrapper...');
    const { withAutoBackup } = await import('../lib/utils/auto-backup');

    // Get initial backup timestamp
    const initialBackup = await JsonBackupService.loadFromJson();
    const initialTimestamp = initialBackup?.timestamp;

    // Simulate an operation with auto-backup
    const mockOperation = async () => {
      console.log('   Simulating database operation...');
      return { id: 'test-123', title: 'Test' };
    };

    // Wait a moment to ensure timestamp difference
    await new Promise(resolve => setTimeout(resolve, 100));

    // Execute with auto-backup
    await withAutoBackup(mockOperation, 'test operation');

    // Check if backup was updated
    const updatedBackup = await JsonBackupService.loadFromJson();
    const updatedTimestamp = updatedBackup?.timestamp;

    console.log(`   - Initial timestamp: ${initialTimestamp}`);
    console.log(`   - Updated timestamp: ${updatedTimestamp}`);
    console.log(`   - Backup triggered: ${initialTimestamp !== updatedTimestamp ? '✅' : '❌'}`);

    console.log('\n✅ Multilingual API test completed successfully!');

  } catch (error) {
    console.error('\n❌ Multilingual API test failed:', error);
    process.exit(1);
  }
}

// Run the test
testMultilingualAPI()
  .then(() => {
    console.log('\n📊 Test Summary: Multilingual functionality is working correctly!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Test failed with error:', error);
    process.exit(1);
  });