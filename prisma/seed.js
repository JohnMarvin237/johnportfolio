const { PrismaClient } = require('../app/generated/prisma')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // 1. Créer l'utilisateur admin
  const hashedPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || 'ChangeMe123!',
    10
  )

  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@portfolio.com' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@portfolio.com',
      password: hashedPassword,
      name: process.env.ADMIN_NAME || 'John Admin',
      role: 'admin'
    }
  })

  console.log('✅ Admin user created:', admin.email)

  // 2. Créer des projets
  const projects = await Promise.all([
    prisma.project.create({
      data: {
        title: 'Portfolio Next.js',
        description: 'Portfolio professionnel développé avec Next.js 15 et PostgreSQL',
        longDesc: 'Un portfolio full-stack moderne avec système de gestion de contenu dynamique et dashboard d\'administration. Utilise les dernières technologies web pour offrir une expérience utilisateur exceptionnelle.',
        technologies: ['Next.js', 'React', 'PostgreSQL', 'Prisma', 'Tailwind CSS', 'NextAuth.js'],
        featured: true,
        order: 1,
        startDate: new Date('2024-11-01'),
        organization: 'Personnel',
        githubUrl: 'https://github.com/john/portfolio',
      }
    }),
    prisma.project.create({
      data: {
        title: 'Application de Gestion de Tâches',
        description: 'Application web collaborative pour la gestion de projets et tâches',
        longDesc: 'Solution complète de gestion de projets avec tableau Kanban, assignation de tâches, suivi du temps et collaboration en temps réel.',
        technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Socket.io', 'JWT'],
        featured: true,
        order: 2,
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-10-01'),
        organization: 'Projet client',
        demoUrl: 'https://tasks-demo.example.com',
      }
    }),
    prisma.project.create({
      data: {
        title: 'Système de Vision par Ordinateur',
        description: 'Solution IA pour le suivi et l\'analyse d\'objets en temps réel',
        longDesc: 'Développement d\'algorithmes de computer vision pour le suivi d\'objets multiples avec optimisation des performances et amélioration de la précision.',
        technologies: ['Python', 'TensorFlow', 'PyTorch', 'OpenCV', 'YOLOv8', 'FastAPI'],
        featured: true,
        order: 3,
        startDate: new Date('2024-08-01'),
        endDate: new Date('2024-11-01'),
        organization: 'InnovaCité',
      }
    }),
    prisma.project.create({
      data: {
        title: 'E-commerce Headless',
        description: 'Plateforme e-commerce moderne avec architecture headless',
        longDesc: 'Boutique en ligne performante avec gestion d\'inventaire, paiements sécurisés et interface d\'administration complète.',
        technologies: ['Next.js', 'Strapi', 'PostgreSQL', 'Stripe', 'Vercel'],
        featured: false,
        order: 4,
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-05-01'),
        demoUrl: 'https://shop-demo.example.com',
      }
    })
  ])

  console.log(`✅ Created ${projects.length} projects`)

  // 3. Créer des expériences
  const experiences = await Promise.all([
    prisma.experience.create({
      data: {
        title: 'Développeur Full-Stack & IA',
        company: 'InnovaCité, La Cité Collégiale',
        companyUrl: 'https://www.collegelacite.ca/innovacite',
        location: 'Ottawa, ON',
        startDate: new Date('2024-11-01'),
        current: true,
        description: 'Développement d\'applications web innovantes et optimisation d\'algorithmes d\'intelligence artificielle pour des projets de recherche appliquée.',
        achievements: [
          'Optimisation des algorithmes de suivi d\'objets (OS-Net, IoU, ReID) en Python',
          'Amélioration de la précision de détection de 95% à 97%',
          'Développement d\'interfaces web pour visualisation de données en temps réel',
          'Collaboration avec équipes multidisciplinaires sur des projets d\'innovation'
        ],
        technologies: ['Python', 'TensorFlow', 'PyTorch', 'Computer Vision', 'React', 'FastAPI'],
        order: 1
      }
    }),
    prisma.experience.create({
      data: {
        title: 'Développeur Angular',
        company: 'La Cité Collégiale',
        location: 'Ottawa, ON',
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-06-01'),
        current: false,
        description: 'Développement d\'applications web avec Angular et intégration de solutions backend.',
        achievements: [
          'Création d\'interfaces utilisateur réactives avec Angular 16+',
          'Intégration d\'APIs RESTful et GraphQL',
          'Mise en place de tests unitaires et d\'intégration',
          'Optimisation des performances et du SEO'
        ],
        technologies: ['Angular', 'TypeScript', 'RxJS', 'Node.js', 'MongoDB'],
        order: 2
      }
    }),
    prisma.experience.create({
      data: {
        title: 'Stagiaire Développeur Full-Stack',
        company: 'Startup Tech Ottawa',
        location: 'Ottawa, ON',
        startDate: new Date('2023-05-01'),
        endDate: new Date('2023-08-01'),
        current: false,
        description: 'Stage en développement web full-stack dans une startup en croissance.',
        achievements: [
          'Développement de nouvelles fonctionnalités pour l\'application principale',
          'Participation aux revues de code et aux réunions d\'équipe',
          'Contribution à l\'amélioration de la documentation technique',
          'Support dans la résolution de bugs et l\'optimisation'
        ],
        technologies: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
        order: 3
      }
    })
  ])

  console.log(`✅ Created ${experiences.length} experiences`)

  // 4. Créer des formations
  const education = await Promise.all([
    prisma.education.create({
      data: {
        degree: 'Diplôme en Programmation informatique',
        institution: 'La Cité Collégiale',
        location: 'Ottawa, ON, Canada',
        startDate: new Date('2022-09-01'),
        endDate: new Date('2024-12-01'),
        current: false,
        description: 'Formation intensive en développement logiciel couvrant les technologies web modernes, la programmation orientée objet, les bases de données et les méthodologies agiles.',
        field: 'Informatique et Technologies de l\'information',
        order: 1
      }
    }),
    prisma.education.create({
      data: {
        degree: 'Maîtrise en Génie Mécatronique',
        institution: 'Universidad Simón Bolívar',
        location: 'Caracas, Venezuela',
        startDate: new Date('2015-01-01'),
        endDate: new Date('2017-12-01'),
        current: false,
        description: 'Études avancées en robotique, automatisation et systèmes intelligents.',
        field: 'Génie Mécatronique',
        note: 'Équivalent Maîtrise canadienne',
        order: 2
      }
    })
  ])

  console.log(`✅ Created ${education.length} education entries`)

  // 5. Créer des certifications
  const certifications = await Promise.all([
    prisma.certification.create({
      data: {
        title: 'AWS Certified Developer - Associate',
        issuer: 'Amazon Web Services',
        issueDate: new Date('2024-03-15'),
        expiryDate: new Date('2027-03-15'),
        credentialId: 'AWS-DEV-2024-XXX',
        credentialUrl: 'https://aws.amazon.com/certification/verify',
        description: 'Certification validant les compétences en développement et déploiement d\'applications sur AWS.',
        skills: ['AWS', 'Cloud Computing', 'Lambda', 'DynamoDB', 'S3', 'API Gateway'],
        order: 1
      }
    }),
    prisma.certification.create({
      data: {
        title: 'Professional Scrum Master I',
        issuer: 'Scrum.org',
        issueDate: new Date('2023-11-01'),
        description: 'Certification en méthodologie Scrum et gestion de projets agiles.',
        skills: ['Scrum', 'Agile', 'Gestion de projet', 'Leadership'],
        order: 2
      }
    }),
    prisma.certification.create({
      data: {
        title: 'MongoDB Certified Developer',
        issuer: 'MongoDB University',
        issueDate: new Date('2023-06-01'),
        description: 'Expertise en conception et développement avec MongoDB.',
        skills: ['MongoDB', 'NoSQL', 'Database Design', 'Performance Optimization'],
        order: 3
      }
    })
  ])

  console.log(`✅ Created ${certifications.length} certifications`)

  // 6. Créer des expériences de bénévolat
  const volunteer = await Promise.all([
    prisma.volunteer.create({
      data: {
        title: 'Mentor en Programmation',
        organization: 'CoderDojo Ottawa',
        startDate: new Date('2024-01-01'),
        current: true,
        description: 'Mentorat de jeunes de 7 à 17 ans dans l\'apprentissage de la programmation. Enseignement de concepts de base en JavaScript, Python et création de jeux vidéo.',
        location: 'Ottawa, ON',
        order: 1
      }
    }),
    prisma.volunteer.create({
      data: {
        title: 'Développeur Bénévole',
        organization: 'Centraide Ottawa',
        startDate: new Date('2023-10-01'),
        endDate: new Date('2024-03-01'),
        current: false,
        description: 'Développement d\'une application web pour la gestion des bénévoles et des événements de collecte de fonds.',
        location: 'Ottawa, ON',
        order: 2
      }
    })
  ])

  console.log(`✅ Created ${volunteer.length} volunteer experiences`)

  // 7. Créer quelques paramètres du site
  await prisma.siteSettings.createMany({
    data: [
      { key: 'site_title', value: 'John Portfolio - Développeur Full-Stack' },
      { key: 'site_description', value: 'Portfolio professionnel de John, développeur Full-Stack spécialisé en React, Next.js et IA' },
      { key: 'contact_email', value: 'contact@johnportfolio.com' },
      { key: 'linkedin_url', value: 'https://linkedin.com/in/john' },
      { key: 'github_url', value: 'https://github.com/john' }
    ]
  })

  console.log('✅ Created site settings')

  console.log('\n🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })