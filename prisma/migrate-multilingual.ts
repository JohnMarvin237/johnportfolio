// prisma/migrate-multilingual.ts
import { PrismaClient } from '@/app/generated/prisma';

const prisma = new PrismaClient();

async function migrateMultilingualData() {
  console.log('Starting multilingual data migration...');

  try {
    // Migrate Projects
    console.log('Migrating projects...');
    const projects = await prisma.project.findMany();
    for (const project of projects) {
      await prisma.project.update({
        where: { id: project.id },
        data: {
          title_fr: project.title || '',
          title_en: project.title || '',
          description_fr: project.description || '',
          description_en: project.description || '',
          longDesc_fr: project.longDesc,
          longDesc_en: project.longDesc,
        },
      });
    }
    console.log(`✓ Migrated ${projects.length} projects`);

    // Migrate Experiences
    console.log('Migrating experiences...');
    const experiences = await prisma.experience.findMany();
    for (const experience of experiences) {
      await prisma.experience.update({
        where: { id: experience.id },
        data: {
          title_fr: experience.title || '',
          title_en: experience.title || '',
          description_fr: experience.description || '',
          description_en: experience.description || '',
          achievements_fr: experience.achievements || [],
          achievements_en: experience.achievements || [],
        },
      });
    }
    console.log(`✓ Migrated ${experiences.length} experiences`);

    // Migrate Education
    console.log('Migrating education...');
    const educations = await prisma.education.findMany();
    for (const education of educations) {
      await prisma.education.update({
        where: { id: education.id },
        data: {
          degree_fr: education.degree || '',
          degree_en: education.degree || '',
          field_fr: education.field,
          field_en: education.field,
          description_fr: education.description,
          description_en: education.description,
          note_fr: education.note,
          note_en: education.note,
        },
      });
    }
    console.log(`✓ Migrated ${educations.length} education records`);

    // Migrate Certifications
    console.log('Migrating certifications...');
    const certifications = await prisma.certification.findMany();
    for (const certification of certifications) {
      await prisma.certification.update({
        where: { id: certification.id },
        data: {
          title_fr: certification.title || '',
          title_en: certification.title || '',
          description_fr: certification.description,
          description_en: certification.description,
        },
      });
    }
    console.log(`✓ Migrated ${certifications.length} certifications`);

    // Migrate Volunteer
    console.log('Migrating volunteer records...');
    const volunteers = await prisma.volunteer.findMany();
    for (const volunteer of volunteers) {
      await prisma.volunteer.update({
        where: { id: volunteer.id },
        data: {
          title_fr: volunteer.title || '',
          title_en: volunteer.title || '',
          description_fr: volunteer.description || '',
          description_en: volunteer.description || '',
        },
      });
    }
    console.log(`✓ Migrated ${volunteers.length} volunteer records`);

    console.log('\n✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration
migrateMultilingualData()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });