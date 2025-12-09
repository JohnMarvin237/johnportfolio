// prisma/seed.ts
import { PrismaClient } from '../app/generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  // ============================================
  // 1. CREATE ADMIN USER
  // ============================================
  console.log('👤 Creating admin user...');

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@portfolio.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
  const adminName = process.env.ADMIN_NAME || 'John Admin';

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: adminName,
      role: 'admin',
    },
  });

  console.log(`✅ Admin user created: ${admin.email}\n`);

  // ============================================
  // 2. CREATE SAMPLE PROJECTS
  // ============================================
  console.log('📦 Creating sample projects...');

  const projects = await prisma.project.createMany({
    data: [
      {
        title: 'Portfolio Full-Stack Next.js',
        description: 'Portfolio professionnel avec système de gestion de contenu dynamique et dashboard admin.',
        longDesc: 'Un portfolio moderne développé avec Next.js 16, React 19, TypeScript, et PostgreSQL. Comprend un système de CMS complet avec authentification, gestion de projets, expériences, formations, certifications, et messages de contact. Design responsive avec Tailwind CSS v4.',
        technologies: ['Next.js 16', 'React 19', 'TypeScript', 'PostgreSQL', 'Prisma', 'Tailwind CSS v4'],
        imageUrl: '/images/projects/portfolio.png',
        demoUrl: 'https://portfolio.example.com',
        githubUrl: 'https://github.com/john/portfolio',
        featured: true,
        order: 1,
        startDate: new Date('2024-11-01'),
        organization: 'Personnel',
      },
      {
        title: 'Système de Tracking IA',
        description: 'Optimisation d\'algorithmes de suivi d\'objets en temps réel avec Computer Vision.',
        longDesc: 'Développement et optimisation d\'algorithmes de tracking utilisant OS-Net, IoU Tracking, et ReID. Amélioration de la précision de détection de 95% à 97% grâce à l\'optimisation des hyperparamètres et l\'entraînement de modèles personnalisés.',
        technologies: ['Python', 'TensorFlow', 'PyTorch', 'OpenCV', 'YOLO', 'Computer Vision'],
        featured: true,
        order: 2,
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-06-30'),
        organization: 'InnovaCité',
      },
      {
        title: 'Application Web E-Commerce',
        description: 'Plateforme e-commerce complète avec gestion de panier, paiements Stripe, et backoffice.',
        longDesc: 'Développement d\'une plateforme e-commerce full-stack avec React, Node.js, et MongoDB. Intégration de Stripe pour les paiements, système de gestion des produits, panier d\'achats, et interface d\'administration.',
        technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Stripe', 'AWS S3'],
        featured: false,
        order: 3,
        startDate: new Date('2023-03-01'),
        endDate: new Date('2023-08-15'),
        organization: 'Freelance',
      },
    ],
  });

  console.log(`✅ Created ${projects.count} projects\n`);

  // ============================================
  // 3. CREATE SAMPLE EXPERIENCES
  // ============================================
  console.log('💼 Creating work experiences...');

  const experiences = await prisma.experience.createMany({
    data: [
      {
        title: 'Développeur Full-Stack & IA',
        company: 'InnovaCité, La Cité Collégiale',
        companyUrl: 'https://www.collegelacite.ca/innovacite',
        location: 'Ottawa, ON, Canada',
        startDate: new Date('2024-11-01'),
        current: true,
        description: 'Développement d\'applications web full-stack et optimisation d\'algorithmes d\'intelligence artificielle pour des projets innovants en collaboration avec des entreprises partenaires.',
        achievements: [
          'Optimisation des algorithmes de suivi d\'objets (OS-Net, IoU Tracking, ReID) en Python',
          'Amélioration de la précision de détection de 95% à 97%',
          'Collaboration avec équipes multidisciplinaires (développeurs, data scientists, clients)',
          'Développement de dashboards de visualisation de données en temps réel',
        ],
        technologies: ['Python', 'TensorFlow', 'PyTorch', 'React', 'Node.js', 'PostgreSQL', 'Docker'],
        order: 1,
      },
      {
        title: 'Développeur Web Front-End',
        company: 'Tech Solutions Inc.',
        location: 'Gatineau, QC, Canada',
        startDate: new Date('2023-01-15'),
        endDate: new Date('2024-10-31'),
        current: false,
        description: 'Développement d\'interfaces utilisateur modernes et responsives pour applications web d\'entreprise.',
        achievements: [
          'Développement de 15+ composants React réutilisables',
          'Migration de jQuery vers React avec amélioration de 40% des performances',
          'Intégration d\'APIs RESTful et GraphQL',
          'Mentorat de 2 développeurs juniors',
        ],
        technologies: ['React', 'TypeScript', 'Next.js', 'GraphQL', 'Tailwind CSS', 'Jest'],
        order: 2,
      },
      {
        title: 'Stagiaire Développeur Full-Stack',
        company: 'StartupX',
        location: 'Ottawa, ON, Canada',
        startDate: new Date('2022-05-01'),
        endDate: new Date('2022-12-31'),
        current: false,
        description: 'Stage de développement full-stack dans une startup technologique en forte croissance.',
        achievements: [
          'Développement de features pour plateforme SaaS (authentification, dashboard)',
          'Participation aux daily standups et sprint planning (Agile/Scrum)',
          'Écriture de tests unitaires et d\'intégration',
        ],
        technologies: ['JavaScript', 'Node.js', 'Express', 'MongoDB', 'React', 'AWS'],
        order: 3,
      },
    ],
  });

  console.log(`✅ Created ${experiences.count} experiences\n`);

  // ============================================
  // 4. CREATE SAMPLE EDUCATION
  // ============================================
  console.log('🎓 Creating education records...');

  const education = await prisma.education.createMany({
    data: [
      {
        degree: 'Diplôme en Programmation Informatique',
        institution: 'La Cité Collégiale',
        location: 'Ottawa, ON, Canada',
        field: 'Computer Programming',
        startDate: new Date('2021-09-01'),
        endDate: new Date('2023-06-30'),
        current: false,
        description: 'Programme intensif de 2 ans couvrant le développement web full-stack, les bases de données, la programmation orientée objet, et le développement mobile.',
        gpa: '3.8/4.0',
        note: 'Diplôme reconnu par l\'industrie canadienne',
        order: 1,
      },
      {
        degree: 'Baccalauréat en Informatique',
        institution: 'Université d\'Ottawa',
        location: 'Ottawa, ON, Canada',
        field: 'Computer Science',
        startDate: new Date('2024-09-01'),
        current: true,
        description: 'Poursuite des études universitaires en informatique avec spécialisation en Intelligence Artificielle et apprentissage automatique.',
        order: 2,
      },
    ],
  });

  console.log(`✅ Created ${education.count} education records\n`);

  // ============================================
  // 5. CREATE SAMPLE CERTIFICATIONS
  // ============================================
  console.log('🏆 Creating certifications...');

  const certifications = await prisma.certification.createMany({
    data: [
      {
        title: 'AWS Certified Solutions Architect - Associate',
        issuer: 'Amazon Web Services',
        issueDate: new Date('2024-03-15'),
        expiryDate: new Date('2027-03-15'),
        credentialId: 'AWS-CSA-123456',
        credentialUrl: 'https://aws.amazon.com/verification',
        description: 'Certification validant les compétences en conception et déploiement de systèmes évolutifs sur AWS.',
        skills: ['AWS EC2', 'S3', 'RDS', 'Lambda', 'CloudFormation', 'VPC'],
        order: 1,
      },
      {
        title: 'Meta Front-End Developer Professional Certificate',
        issuer: 'Meta (via Coursera)',
        issueDate: new Date('2023-08-20'),
        credentialUrl: 'https://coursera.org/verify/professional-cert/ABC123',
        description: 'Programme complet de développement front-end couvrant HTML, CSS, JavaScript, React, et bonnes pratiques.',
        skills: ['React', 'JavaScript', 'HTML5', 'CSS3', 'Responsive Design', 'Git'],
        order: 2,
      },
    ],
  });

  console.log(`✅ Created ${certifications.count} certifications\n`);

  // ============================================
  // 6. CREATE SAMPLE VOLUNTEER WORK
  // ============================================
  console.log('🤝 Creating volunteer experiences...');

  const volunteer = await prisma.volunteer.createMany({
    data: [
      {
        title: 'Mentor de Programmation',
        organization: 'Code for Kids Ottawa',
        location: 'Ottawa, ON, Canada',
        startDate: new Date('2023-06-01'),
        current: true,
        description: 'Mentorat bénévole auprès de jeunes de 12-16 ans pour leur apprendre les bases de la programmation (Scratch, Python, HTML/CSS). Organisation d\'ateliers mensuels et aide aux projets personnels.',
        order: 1,
      },
      {
        title: 'Développeur Bénévole',
        organization: 'Tech for Good Initiative',
        location: 'Ottawa, ON, Canada',
        startDate: new Date('2022-01-15'),
        endDate: new Date('2023-05-30'),
        current: false,
        description: 'Développement pro bono de sites web pour organismes sans but lucratif locaux. Création de 3 sites web WordPress avec design personnalisé et formation des clients.',
        order: 2,
      },
    ],
  });

  console.log(`✅ Created ${volunteer.count} volunteer experiences\n`);

  // ============================================
  // 7. CREATE SAMPLE CONTACT MESSAGES
  // ============================================
  console.log('📧 Creating sample contact messages...');

  const messages = await prisma.contactMessage.createMany({
    data: [
      {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        subject: 'Opportunité d\'emploi - Développeur Full-Stack',
        message: 'Bonjour John, nous avons vu votre profil et serions intéressés à discuter d\'une opportunité de développeur full-stack au sein de notre équipe. Seriez-vous disponible pour un appel cette semaine ?',
        read: false,
      },
      {
        name: 'Marc Tremblay',
        email: 'marc.t@techcorp.com',
        subject: 'Collaboration sur projet IA',
        message: 'Salut ! J\'ai vu votre travail sur les algorithmes de tracking. Je travaille sur un projet similaire et j\'aimerais échanger sur les bonnes pratiques. Disponible pour un café ?',
        read: true,
      },
    ],
  });

  console.log(`✅ Created ${messages.count} contact messages\n`);

  // ============================================
  // 8. CREATE SITE SETTINGS
  // ============================================
  console.log('⚙️  Creating site settings...');

  const settings = await prisma.siteSettings.createMany({
    data: [
      {
        key: 'site_title',
        value: 'John - Portfolio Full-Stack Developer',
      },
      {
        key: 'site_description',
        value: 'Portfolio professionnel de John, développeur Full-Stack spécialisé en React, Next.js, et Intelligence Artificielle.',
      },
      {
        key: 'hero_title',
        value: 'Développeur Full-Stack & Passionné d\'IA',
      },
      {
        key: 'hero_subtitle',
        value: 'Je crée des applications web modernes et performantes avec React, Next.js, et TypeScript.',
      },
      {
        key: 'bio',
        value: 'Développeur full-stack avec 3+ ans d\'expérience, spécialisé en React.js, Next.js, et technologies IA. Actuellement développeur chez InnovaCité, La Cité Collégiale. Passionné par la création d\'applications web performantes et l\'optimisation d\'algorithmes de machine learning.',
      },
      {
        key: 'github_url',
        value: 'https://github.com/john',
      },
      {
        key: 'linkedin_url',
        value: 'https://linkedin.com/in/john',
      },
      {
        key: 'twitter_url',
        value: 'https://twitter.com/john',
      },
      {
        key: 'email',
        value: 'john@example.com',
      },
      {
        key: 'location',
        value: 'Ottawa-Gatineau, Canada',
      },
    ],
  });

  console.log(`✅ Created ${settings.count} site settings\n`);

  // ============================================
  // SUMMARY
  // ============================================
  console.log('═══════════════════════════════════════');
  console.log('🎉 Database seed completed successfully!');
  console.log('═══════════════════════════════════════');
  console.log(`👤 Admin user: ${adminEmail}`);
  console.log(`📦 Projects: ${projects.count}`);
  console.log(`💼 Experiences: ${experiences.count}`);
  console.log(`🎓 Education: ${education.count}`);
  console.log(`🏆 Certifications: ${certifications.count}`);
  console.log(`🤝 Volunteer: ${volunteer.count}`);
  console.log(`📧 Messages: ${messages.count}`);
  console.log(`⚙️  Settings: ${settings.count}`);
  console.log('═══════════════════════════════════════\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
