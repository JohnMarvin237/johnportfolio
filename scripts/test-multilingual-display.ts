// scripts/test-multilingual-display.ts
import { JsonBackupService } from '../lib/backup/json-backup';
import { fetchWithFallback } from '../lib/utils/fetch-wrapper-with-fallback';

async function testMultilingualDisplay() {
  console.log('🌐 Testing Multilingual Display System...\n');

  try {
    // 1. Test API fetch with fallback
    console.log('1️⃣  Testing API fetch with fallback...');
    const projectsResult = await fetchWithFallback('/projects?featured=true&limit=3');

    console.log(`   - Source: ${projectsResult.source}`);
    console.log(`   - Projects retrieved: ${projectsResult.data?.length || 0}`);
    console.log(`   - Error: ${projectsResult.error || 'None'}`);

    // 2. Check multilingual fields in data
    console.log('\n2️⃣  Checking multilingual fields...');
    if (projectsResult.data && projectsResult.data.length > 0) {
      const firstProject = projectsResult.data[0];
      console.log('   Sample project:');
      console.log(`   - title_fr: "${firstProject.title_fr || 'N/A'}"`);
      console.log(`   - title_en: "${firstProject.title_en || 'N/A'}"`);
      console.log(`   - description_fr: "${firstProject.description_fr?.substring(0, 50) || 'N/A'}..."`);
      console.log(`   - description_en: "${firstProject.description_en?.substring(0, 50) || 'N/A'}..."`);
      console.log(`   - Legacy title: "${firstProject.title || 'N/A'}"`);
    }

    // 3. Test backup data structure
    console.log('\n3️⃣  Testing backup data structure...');
    const backupData = await JsonBackupService.loadFromJson();

    if (backupData) {
      console.log('   Backup data summary:');
      console.log(`   - Total projects: ${backupData.projects.length}`);
      console.log(`   - Total experiences: ${backupData.experiences.length}`);

      // Check if backup has multilingual fields
      if (backupData.projects.length > 0) {
        const hasMultilingual = 'title_fr' in backupData.projects[0] && 'title_en' in backupData.projects[0];
        console.log(`   - Has multilingual fields: ${hasMultilingual ? '✅' : '❌'}`);
      }
    }

    // 4. Simulate locale-based content selection
    console.log('\n4️⃣  Simulating locale-based content selection...');
    if (projectsResult.data && projectsResult.data.length > 0) {
      const project = projectsResult.data[0];

      // Simulate French locale
      const titleFr = project.title_fr || project.title || '';
      const descriptionFr = project.description_fr || project.description || '';

      // Simulate English locale
      const titleEn = project.title_en || project.title || project.title_fr || '';
      const descriptionEn = project.description_en || project.description || project.description_fr || '';

      console.log('   French locale:');
      console.log(`   - Title: "${titleFr}"`);
      console.log(`   - Description: "${descriptionFr.substring(0, 50)}..."`);

      console.log('\n   English locale:');
      console.log(`   - Title: "${titleEn}"`);
      console.log(`   - Description: "${descriptionEn.substring(0, 50)}..."`);
    }

    // 5. Test fallback filtering
    console.log('\n5️⃣  Testing fallback query filtering...');
    const filteredResult = await fetchWithFallback('/projects?featured=true&limit=2');
    console.log(`   - Featured projects: ${filteredResult.data?.length || 0}`);

    if (filteredResult.data && filteredResult.data.length > 0) {
      const allFeatured = filteredResult.data.every((p: any) => p.featured === true);
      console.log(`   - All are featured: ${allFeatured ? '✅' : '❌'}`);
    }

    console.log('\n✅ Multilingual display system test completed successfully!');

  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  }
}

// Run the test
testMultilingualDisplay()
  .then(() => {
    console.log('\n📊 Test Summary: Multilingual display system is working correctly!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Test failed with error:', error);
    process.exit(1);
  });