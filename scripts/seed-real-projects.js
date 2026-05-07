/**
 * seed-real-projects.js
 * Remplace les projets existants par les vrais projets de John (bilingue FR/EN).
 * Usage : node scripts/seed-real-projects.js
 */

const { PrismaClient } = require('../app/generated/prisma');

const prisma = new PrismaClient();

const projects = [
  // ─── 1. Portfolio Personnel ───────────────────────────────────────────────
  {
    title: 'Portfolio Personnel Full-Stack',
    titleFr: 'Portfolio Personnel Full-Stack',
    titleEn: 'Full-Stack Personal Portfolio',
    description: 'Site portfolio full-stack moderne avec CMS admin, authentification JWT et animations Framer Motion.',
    descriptionFr:
      'Conception et développement d\'un site portfolio Full-Stack moderne et minimaliste destiné à mettre en valeur 3+ années d\'expérience en développement web. Combine un frontend épuré et un backend robuste avec gestion dynamique de contenu, dashboard admin CRUD, authentification JWT, mode sombre/clair et CI/CD automatisé via GitHub Actions.',
    descriptionEn:
      'Design and development of a modern, minimalist Full-Stack portfolio site intended to showcase 3+ years of web development experience. Combines a clean frontend with a robust backend featuring dynamic content management, CRUD admin dashboard, JWT authentication, dark/light mode, and automated CI/CD via GitHub Actions.',
    longDescFr:
      'L\'architecture inclut : un frontend Next.js avec composants React réutilisables pour chaque section (formation, projets, expériences, certifications, bénévolat) qui se peuplent automatiquement depuis la base de données via des boucles ; une base PostgreSQL gérée par Prisma ORM ; un système d\'authentification admin avec NextAuth.js et JWT pour permettre la gestion de contenu sans toucher au code ; un dashboard administrateur complet avec opérations CRUD ; un formulaire de contact sécurisé ; un mode sombre/clair ; et des animations fluides via Framer Motion (scroll progress, transitions de page, hover 3D, stagger de texte). Le tout déployé sur Vercel avec pipeline CI/CD automatisé via GitHub Actions.',
    longDescEn:
      'The architecture includes: a Next.js frontend with reusable React components for each section (education, projects, experiences, certifications, volunteer work) that automatically populate from the database through loops; a PostgreSQL database managed by Prisma ORM; an admin authentication system with NextAuth.js and JWT enabling content management without touching the code; a complete admin dashboard with CRUD operations; a secure contact form; light/dark mode; and smooth animations via Framer Motion (scroll progress, page transitions, 3D hover, text stagger). Everything is deployed on Vercel with an automated CI/CD pipeline via GitHub Actions.',
    technologies: [
      'Next.js 15', 'React 19', 'TypeScript', 'PostgreSQL', 'Prisma ORM',
      'NextAuth.js', 'JWT', 'Tailwind CSS', 'Framer Motion', 'Vercel', 'GitHub Actions',
    ],
    featured: true,
    order: 1,
    startDate: new Date('2025-01-01'),
    organization: 'Projet personnel',
    githubUrl: 'https://github.com/JohnMarvin237/johnportfolio',
  },

  // ─── 2. COOP-BOT — Chatbot Intelligent RASA ───────────────────────────────
  {
    title: 'COOP-BOT — Chatbot Intelligent RASA',
    titleFr: 'COOP-BOT — Chatbot Intelligent RASA',
    titleEn: 'COOP-BOT — Intelligent RASA Chatbot',
    description: 'Assistant virtuel bilingue pour le service de placement COOP de La Cité Collégiale, avec 95 % de précision NLP et 500+ utilisateurs quotidiens.',
    descriptionFr:
      'COOP-BOT est un assistant virtuel bilingue (français/anglais) conçu pour le service de placement COOP de La Cité Collégiale. Il répond à une problématique réelle : la surcharge des conseillers face au volume croissant de questions des étudiants sur les stages coopératifs. Précision de 95 %, temps de réponse de 3 secondes, 500+ utilisateurs quotidiens, disponibilité 24h/24.',
    descriptionEn:
      'COOP-BOT is a bilingual (French/English) virtual assistant designed for La Cité Collégiale\'s COOP placement service. It addresses a real-world problem: counselor overload due to the growing volume of student questions about cooperative internships. 95% accuracy, 3-second response time, 500+ daily users, 24/7 availability.',
    longDescFr:
      'L\'assistant comprend le langage naturel grâce à RASA et gère 21 intentions distinctes couvrant l\'inscription au COOP, les conditions d\'admission, la rémunération, les stages à l\'extérieur, la déclaration de placement, les exigences linguistiques et bien plus. L\'architecture combine un moteur NLP RASA pour la compréhension des intentions, un système de fallback sur des modèles LLM locaux via Ollama (Mixtral, Phi3-mini, Llama3.2) pour la reformulation contextuelle des réponses, et une interface conversationnelle Next.js/React connectée à PostgreSQL pour la persistance des conversations. Les données sont containerisées avec Docker pour un déploiement reproductible. Résultats mesurables : précision de 95 %, temps de réponse de 3 secondes, plus de 500 utilisateurs quotidiens, disponibilité 24h/24 et 7j/7, réduction significative de la charge des conseillers.',
    longDescEn:
      'The assistant understands natural language through RASA and handles 21 distinct intents covering COOP registration, admission requirements, compensation, out-of-region internships, placement declaration, language requirements, and more. The architecture combines a RASA NLP engine for intent recognition, a fallback system on local LLMs via Ollama (Mixtral, Phi3-mini, Llama3.2) for contextual response rephrasing, and a Next.js/React conversational interface connected to PostgreSQL for conversation persistence. Everything is containerized with Docker for reproducible deployment. Measurable results: 95% accuracy, 3-second response time, 500+ daily users, 24/7 availability, significant reduction in counselor workload.',
    technologies: [
      'RASA', 'Python', 'Next.js', 'React.js', 'Node.js',
      'PostgreSQL', 'NLP', 'Ollama', 'Mixtral', 'Docker', 'JavaScript',
    ],
    featured: true,
    order: 2,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2025-06-01'),
    organization: 'InnovaCité — La Cité Collégiale',
    githubUrl: 'https://github.com/JohnMarvin237/COOP-BOT',
  },

  // ─── 3. Pipeline Computer Vision — Tracking & Re-identification ──────────
  {
    title: 'Pipeline Computer Vision — Tracking & Ré-identification',
    titleFr: 'Pipeline Computer Vision — Tracking & Ré-identification',
    titleEn: 'Computer Vision Pipeline — Tracking & Re-identification',
    description: 'Pipeline temps réel de détection, suivi et ré-identification de personnes sur flux vidéo. Précision améliorée de 95 % à 97 %, déployé sur AWS EKS.',
    descriptionFr:
      'Développement d\'un pipeline complet de vision par ordinateur en temps réel pour la détection, le suivi et la ré-identification de personnes à partir de flux vidéo. Le projet résout la perte d\'identifiant après occlusion qui dégradait les systèmes de tracking existants. Résultats : précision de 97 %, réduction des occlusions de 25 %, déploiement en production sur AWS.',
    descriptionEn:
      'Development of a complete real-time computer vision pipeline for the detection, tracking, and re-identification of people from video streams. The project solves the loss of ID after occlusion that degraded existing tracking systems. Results: 97% accuracy, 25% reduction in occlusion-related losses, production deployment on AWS.',
    longDescFr:
      'Le pipeline ingère des flux vidéo en temps réel, applique YOLO pour la détection d\'objets, puis combine un tracker IoU avec un algorithme de ré-identification basé sur OS-Net pour conserver un identifiant unique même après occlusion. DeepSORT gère l\'association des pistes entre les frames. Les résultats sont stockés en PostgreSQL et exposés via une API REST construite avec FastAPI, consommable par des applications web. L\'ensemble est conteneurisé avec Docker et orchestré sur Kubernetes (AWS EKS). Résultats mesurables : précision de tracking améliorée de 95 % à 97 %, réduction des occlusions de 25 %, aucune latence supplémentaire ajoutée, déploiement en production sur AWS.',
    longDescEn:
      'The pipeline ingests video streams in real time, applies YOLO for object detection, then combines an IoU tracker with an OS-Net-based re-identification algorithm to preserve a unique ID even after occlusion. DeepSORT handles track association between frames. Results are stored in PostgreSQL and exposed through a REST API built with FastAPI, consumable by web applications. Everything is containerized with Docker and orchestrated on Kubernetes (AWS EKS). Measurable results: tracking accuracy improved from 95% to 97%, 25% reduction in occlusion-related losses, zero added latency, production deployment on AWS.',
    technologies: [
      'Python', 'TensorFlow', 'PyTorch', 'OS-Net', 'DeepSORT',
      'YOLO', 'OpenCV', 'FastAPI', 'PostgreSQL', 'AWS', 'Docker', 'Kubernetes',
    ],
    featured: true,
    order: 3,
    startDate: new Date('2024-11-01'),
    endDate: new Date('2025-04-01'),
    organization: 'InnovaCité — La Cité Collégiale',
  },

  // ─── 4. Intégrations IA Génératives — L'Original ─────────────────────────
  {
    title: 'Intégrations IA Génératives — L\'Original',
    titleFr: 'Intégrations IA Génératives — L\'Original',
    titleEn: 'Generative AI Integrations — L\'Original',
    description: 'Intégration de fonctionnalités IA génératives (OpenAI, Azure OpenAI, RAG) dans une application React/Next.js de production.',
    descriptionFr:
      'Dans le cadre de mon poste de Développeur Full-Stack chez L\'Original (Montréal), intégration de fonctionnalités IA génératives dans une application web React/Next.js de production. Le travail couvre l\'intégration des APIs OpenAI et Azure OpenAI, l\'orchestration de pipelines de traitement IA en temps réel, et l\'implémentation de systèmes de recommandation basés sur des embeddings vectoriels et des techniques RAG.',
    descriptionEn:
      'As part of my role as Full-Stack Developer at L\'Original (Montréal), integration of generative AI features into a production React/Next.js web application. The work covers OpenAI and Azure OpenAI API integration, orchestration of real-time AI processing pipelines, and implementation of recommendation systems based on vector embeddings and RAG techniques.',
    longDescFr:
      'L\'intégration couvre : les APIs OpenAI et Azure OpenAI pour la génération de contenu personnalisé, l\'orchestration de pipelines de traitement IA en temps réel (ingestion → inférence → restitution), l\'implémentation de systèmes de recommandation basés sur des embeddings vectoriels et des techniques RAG (Retrieval-Augmented Generation), et la conception d\'APIs back-end (Node.js, Python/FastAPI) servant les modèles IA en production avec exigences de haute disponibilité. Ce travail est réalisé dans un contexte de production réelle, en respectant des contraintes de performance, de coût d\'API et de qualité de réponse.',
    longDescEn:
      'The integration covers: OpenAI and Azure OpenAI APIs for personalized content generation, orchestration of real-time AI processing pipelines (ingestion → inference → output), implementation of recommendation systems based on vector embeddings and RAG (Retrieval-Augmented Generation) techniques, and the design of back-end APIs (Node.js, Python/FastAPI) serving AI models in production with high-availability requirements. This work is carried out in a real production context, respecting constraints of performance, API cost, and response quality.',
    technologies: [
      'Next.js', 'React', 'Node.js', 'Python', 'FastAPI',
      'OpenAI API', 'Azure OpenAI', 'Embeddings vectoriels', 'RAG',
    ],
    featured: true,
    order: 4,
    startDate: new Date('2025-11-01'),
    organization: 'L\'Original, Montréal',
  },

  // ─── 5. Générateur de Poèmes IA — Artur.art ──────────────────────────────
  {
    title: 'Générateur de Poèmes IA — Artur.art',
    titleFr: 'Générateur de Poèmes IA — Artur.art',
    titleEn: 'AI Poem Generator — Artur.art',
    description: 'Générateur de poèmes personnalisés basé sur l\'IA générative (Azure OpenAI), avec streaming SSE temps réel et catalogue de styles artistiques.',
    descriptionFr:
      'Développement d\'un générateur de poèmes personnalisés basé sur l\'IA générative pour la plateforme d\'art éthique Artur.art. Le système crée des poèmes uniques calibrés selon de multiples paramètres : sentiment souhaité, style d\'artiste (Piaf, Rimbaud, Shakespeare, Eminem…), âge du destinataire, lieu, type de relation et punchline. API FastAPI avec streaming SSE temps réel.',
    descriptionEn:
      'Development of an AI-powered personalized poem generator for the ethical art platform Artur.art. The system creates unique poems calibrated according to multiple parameters: desired sentiment, artist style (Piaf, Rimbaud, Shakespeare, Eminem…), recipient\'s age, location, relationship type, and punchline. FastAPI API with real-time SSE streaming.',
    longDescFr:
      'Le système gère un catalogue de styles artistiques détaillés couvrant des plumes francophones (Édith Piaf, Arthur Rimbaud, Jacques Prévert, Orelsan, George Brassens) et anglophones (Shakespeare, Eminem, Jay-Z, Kendrick Lamar, Aretha Franklin), avec pour chaque artiste une description fine du style, du vocabulaire et des thèmes récurrents. L\'architecture comprend une classe PoemGenerator Python avec validation stricte des paramètres, génération de prompts contextuels, gestion des erreurs et estimation des coûts d\'API. Une API REST FastAPI expose les inférences à un frontend React/Next.js qui consomme les résultats avec streaming SSE temps réel. Le modèle principal est Azure OpenAI GPT-4, avec GPT-4o-mini pour les requêtes légères.',
    longDescEn:
      'The system manages a detailed catalog of artistic styles covering French-language voices (Édith Piaf, Arthur Rimbaud, Jacques Prévert, Orelsan, George Brassens) and English-language ones (Shakespeare, Eminem, Jay-Z, Kendrick Lamar, Aretha Franklin), with for each artist a refined description of style, vocabulary, and recurring themes. The architecture comprises a Python PoemGenerator class with strict parameter validation, contextual prompt generation, error handling, and API cost estimation. A FastAPI REST API exposes inferences to a React/Next.js frontend that consumes results with real-time SSE streaming. The primary model is Azure OpenAI GPT-4, with GPT-4o-mini for lightweight requests.',
    technologies: [
      'Python', 'Azure OpenAI', 'GPT-4', 'FastAPI', 'Flask',
      'React', 'Next.js', 'SSE Streaming', 'Docker',
    ],
    featured: false,
    order: 5,
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-12-01'),
    organization: 'Artur.art',
  },

  // ─── 6. SaaS de Recherche d'Emploi ────────────────────────────────────────
  {
    title: 'SaaS de Recherche d\'Emploi',
    titleFr: 'SaaS de Recherche d\'Emploi',
    titleEn: 'Job Search SaaS Platform',
    description: 'Plateforme SaaS pour automatiser la recherche d\'emploi : génération de CV/lettres de motivation par IA, suivi des candidatures et préparation aux entrevues.',
    descriptionFr:
      'Conception et développement d\'une plateforme SaaS pour automatiser et professionnaliser la recherche d\'emploi. La plateforme génère automatiquement des CV personnalisés et des lettres de motivation contextualisées (FR/EN) grâce à l\'IA générative, propose un suivi des candidatures à deux niveaux (statut applicatif et entrevue), un module de préparation aux entrevues et un tableau de bord analytique.',
    descriptionEn:
      'Design and development of a SaaS platform to automate and professionalize the job search process. The platform automatically generates customized CVs and contextualized cover letters (FR/EN) through generative AI, provides a two-tier application tracking system (application status and interview), an interview preparation module, and an analytical dashboard.',
    longDescFr:
      'Les fonctionnalités principales incluent : génération automatique de CV personnalisés en fonction de chaque offre d\'emploi grâce à l\'IA générative ; création de lettres de motivation contextualisées (français/anglais) ; système de suivi des candidatures à deux niveaux (statut applicatif et statut d\'entrevue) ; module de préparation aux entrevues avec questions types et conseils ciblés ; tableau de bord analytique du processus de recherche. L\'architecture est pensée multi-tenant avec authentification JWT, base PostgreSQL pour la persistance, intégration OpenAI API pour les générations et déploiement cloud AWS. Stripe est prévu pour la monétisation.',
    longDescEn:
      'Key features include: automatic generation of customized CVs based on each job posting through generative AI; production of contextualized cover letters (French/English); a two-tier application tracking system (application status and interview status); an interview preparation module with typical questions and targeted advice; an analytical dashboard of the search process. The architecture is designed multi-tenant with JWT authentication, a PostgreSQL database for persistence, OpenAI API integration for generations, and AWS cloud deployment. Stripe is planned for monetization.',
    technologies: [
      'Next.js', 'React.js', 'Node.js', 'TypeScript',
      'PostgreSQL', 'AWS', 'OpenAI API', 'Stripe',
    ],
    featured: false,
    order: 6,
    startDate: new Date('2025-01-01'),
    organization: 'Projet entrepreneurial personnel',
  },

  // ─── 7. Marketplace Canadienne d'Annonces Classées ────────────────────────
  {
    title: 'Marketplace Canadienne d\'Annonces Classées',
    titleFr: 'Marketplace Canadienne d\'Annonces Classées',
    titleEn: 'Canadian Classified-Ads Marketplace',
    description: 'Plateforme d\'annonces classées ciblant le marché canadien avec messagerie temps réel (Socket.io), paiements Stripe et déploiement Railway.',
    descriptionFr:
      'Conception d\'une plateforme d\'annonces classées ciblant le marché canadien, positionnée comme alternative locale à Kijiji et Facebook Marketplace. Modèle freemium avec annonces gratuites et boosts payants à partir de 1 $ CAD. MVP incluant gestion d\'annonces, messagerie temps réel entre acheteurs et vendeurs, recherche avancée et filtres, paiements Stripe et emails transactionnels via Resend.',
    descriptionEn:
      'Design of a classified-ads platform targeting the Canadian market, positioned as a local alternative to Kijiji and Facebook Marketplace. Freemium model with free listings and paid boosts starting at $1 CAD. MVP including listing management, real-time messaging between buyers and sellers, advanced search and filters, Stripe payments, and transactional emails via Resend.',
    longDescFr:
      'L\'architecture MVP comprend : gestion d\'annonces (création, édition, photos via UploadThing) ; messagerie temps réel entre acheteurs et vendeurs avec Socket.io ; recherche avancée et filtres ; système de paiement Stripe pour les boosts d\'annonces avec webhooks de confirmation ; emails transactionnels via Resend ; authentification sécurisée NextAuth.js. La base PostgreSQL est hébergée sur Supabase, l\'application est déployée sur Railway. Le projet inclut également une stratégie complète de lancement marketing sur 7 jours et un plan de monétisation progressif.',
    longDescEn:
      'The MVP architecture comprises: listing management (creation, editing, photos via UploadThing); real-time messaging between buyers and sellers using Socket.io; advanced search and filtering; Stripe payment system for listing boosts with confirmation webhooks; transactional emails via Resend; secure authentication with NextAuth.js. The PostgreSQL database is hosted on Supabase, and the application is deployed on Railway. The project also includes a complete 7-day marketing launch strategy and a progressive monetization plan.',
    technologies: [
      'Next.js 14', 'TypeScript', 'Prisma ORM', 'PostgreSQL', 'Supabase',
      'NextAuth.js', 'Socket.io', 'Stripe', 'UploadThing', 'Resend', 'Railway',
    ],
    featured: false,
    order: 7,
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-12-01'),
    organization: 'Projet entrepreneurial personnel',
  },

  // ─── 8. Système Multi-Agents Claude Code ─────────────────────────────────
  {
    title: 'Système Multi-Agents Claude Code',
    titleFr: 'Système Multi-Agents Claude Code',
    titleEn: 'Claude Code Multi-Agent System',
    description: 'Système d\'agents IA spécialisés pour automatiser l\'ensemble du cycle de développement logiciel. Vitesse de développement augmentée de 45 %.',
    descriptionFr:
      'Conception et déploiement d\'un système multi-agents IA pour automatiser l\'ensemble du cycle de développement logiciel. Équipe de 7 agents spécialisés (frontend, backend, tests, devops, code review, debug, recherche) travaillant en parallèle avec un contexte partagé. Vitesse de développement augmentée de 45 %.',
    descriptionEn:
      'Design and deployment of an AI multi-agent system to automate the entire software development lifecycle. Team of 7 specialized agents (frontend, backend, tests, devops, code review, debug, research) working in parallel with a shared context. Development speed increased by 45%.',
    longDescFr:
      'Le système comprend 7 agents spécialisés : (1) frontend-dev — expert UI React/Next.js ; (2) backend-dev — expert APIs et bases de données ; (3) test-runner — expert en tests automatisés (TDD, unitaires, intégration, E2E) ; (4) devops-engineer — expert CI/CD, infrastructure as code et déploiement ; (5) code-reviewer — expert qualité, sécurité et performance ; (6) debugger — expert investigation de bugs et résolution d\'incidents ; (7) web-researcher — expert recherche documentaire et veille technologique. Chaque agent dispose d\'un prompt système spécifique, d\'un sous-ensemble d\'outils adapté et d\'un protocole de coordination. La configuration globale réside dans ~/.claude/agents/ et inclut des commandes workflow comme /full-feature et /deep-research. Résultats mesurables : vitesse de développement augmentée de 45 %, détection de bugs significativement plus rapide, améliorations de code accélérées.',
    longDescEn:
      'The system comprises 7 specialized agents: (1) frontend-dev — React/Next.js UI expert; (2) backend-dev — API and database expert; (3) test-runner — automated testing expert (TDD, unit, integration, E2E); (4) devops-engineer — CI/CD, infrastructure-as-code, and deployment expert; (5) code-reviewer — quality, security, and performance expert; (6) debugger — bug investigation and incident resolution expert; (7) web-researcher — documentation research and tech-watch expert. Each agent has a specific system prompt, a tailored subset of tools, and a coordination protocol. The global configuration lives in ~/.claude/agents/ and includes workflow commands like /full-feature and /deep-research. Measurable results: development speed increased by 45%, significantly faster bug detection, accelerated code improvements.',
    technologies: [
      'Claude Code', 'Anthropic', 'YAML', 'Bash', 'Git',
      'Claude Opus 4', 'Claude Sonnet 4',
    ],
    featured: false,
    order: 8,
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-12-01'),
    organization: 'Projet personnel',
  },

  // ─── 9. Plan d'Étude Interactif 12 Semaines ──────────────────────────────
  {
    title: 'Plan d\'Étude Interactif 12 Semaines',
    titleFr: 'Plan d\'Étude Interactif 12 Semaines',
    titleEn: 'Interactive 12-Week Study Plan',
    description: 'Application web interactive pour suivre un plan de formation de 12 semaines en génie logiciel, avec persistance localStorage et suivi visuel de progression.',
    descriptionFr:
      'Développement d\'une application web interactive permettant de suivre un plan de formation personnalisé de 12 semaines couvrant six domaines : algorithmique, backend/APIs, system design, IA/ML, frontend React/Next.js, et DevOps/cloud. Suivi visuel de progression avec checkboxes, barres de progression par phase et sauvegarde automatique via localStorage.',
    descriptionEn:
      'Development of an interactive web application to follow a personalized 12-week training plan covering six domains: algorithms, backend/APIs, system design, AI/ML, frontend React/Next.js, and DevOps/cloud. Visual progress tracking with checkboxes, progress bars per phase, and automatic saving via localStorage.',
    longDescFr:
      'Chaque domaine bénéficie de deux semaines complètes avec tâches journalières, ressources spécifiques recommandées et un projet capstone par phase. L\'application offre un suivi visuel de la progression avec checkboxes par tâche, barres de progression par phase, sauvegarde automatique de l\'avancement via localStorage (persistance entre sessions, hydration safe avec écran de chargement), et bouton de réinitialisation. Le projet est structuré proprement en app/, components/, lib/ avec TypeScript strict et déployé sur Vercel.',
    longDescEn:
      'Each domain receives two full weeks with daily tasks, specific recommended resources, and a capstone project per phase. The application offers visual progress tracking with checkboxes per task, progress bars per phase, automatic saving of progress via localStorage (cross-session persistence, hydration-safe with a loading screen), and a reset button. The project is cleanly structured in app/, components/, lib/ with strict TypeScript and deployed on Vercel.',
    technologies: [
      'Next.js 14', 'TypeScript', 'Tailwind CSS', 'localStorage', 'Vercel',
    ],
    featured: false,
    order: 9,
    startDate: new Date('2026-01-01'),
    organization: 'Projet personnel',
  },

  // ─── 10. Applications web et mobiles — Meas-Counselling ──────────────────
  {
    title: 'Applications web — Meas-Counselling',
    titleFr: 'Applications web — Meas-Counselling',
    titleEn: 'Web Applications — Meas-Counselling',
    description: '15+ applications web full-stack développées et déployées pour Meas-Counselling : systèmes d\'inventaire, sites vitrines, portails clients, migration Heroku → AWS.',
    descriptionFr:
      'En tant que développeur Full-Stack chez Meas-Counselling (Yaoundé, Cameroun), conception, développement et déploiement de 15+ applications web couvrant des domaines variés : systèmes de gestion d\'inventaire, sites vitrines pour PME, CV dynamiques en ligne, portails clients et tableaux de bord internes. Migration majeure de l\'infrastructure de Heroku vers AWS Cloud. Résultats : 500+ utilisateurs quotidiens, 99 % de disponibilité, réduction de 40 % du temps de mise en production.',
    descriptionEn:
      'As a Full-Stack developer at Meas-Counselling (Yaoundé, Cameroon), design, development, and deployment of 15+ web applications covering varied domains: inventory management systems, showcase sites for SMBs, dynamic online CVs, client portals, and internal dashboards. Major infrastructure migration from Heroku to AWS Cloud. Results: 500+ daily users, 99% availability, 40% reduction in time-to-production.',
    longDescFr:
      'Le travail couvrait l\'ensemble du cycle de vie : architecture des APIs RESTful avec Node.js et Express.js, modélisation et optimisation des bases de données PostgreSQL et MongoDB, mise en place de pipelines CI/CD avec GitHub Actions automatisant les déploiements vers AWS, Heroku et GitHub Pages, et maintenance applicative en production. Une migration majeure de l\'infrastructure de Heroku vers AWS Cloud a été menée, améliorant la scalabilité et réduisant les coûts d\'hébergement. Résultats mesurables : 500+ utilisateurs quotidiens cumulés, disponibilité de 99 %, réduction de 40 % du temps de mise en production, réduction de 30 % des coûts d\'hébergement après migration cloud.',
    longDescEn:
      'The work covered the entire lifecycle: RESTful API architecture with Node.js and Express.js, modeling and optimization of PostgreSQL and MongoDB databases, setup of CI/CD pipelines with GitHub Actions automating deployments to AWS, Heroku, and GitHub Pages, and production application maintenance. A major infrastructure migration from Heroku to AWS Cloud was carried out, improving scalability and reducing hosting costs. Measurable results: 500+ cumulative daily users, 99% availability, 40% reduction in time-to-production, 30% reduction in hosting costs after cloud migration.',
    technologies: [
      'React.js', 'Angular', 'Next.js', 'Node.js', 'Express.js',
      'PostgreSQL', 'MongoDB', 'AWS', 'Heroku', 'GitHub Actions', 'GitHub Pages',
    ],
    featured: false,
    order: 10,
    startDate: new Date('2020-09-01'),
    endDate: new Date('2021-12-01'),
    organization: 'Meas-Counselling Sarl, Yaoundé, Cameroun',
  },

  // ─── 11. Drone Intelligent de Surveillance Agricole ───────────────────────
  {
    title: 'Drone Intelligent de Surveillance Agricole',
    titleFr: 'Drone Intelligent de Surveillance Agricole',
    titleEn: 'Smart Agricultural Surveillance Drone',
    description: 'Drone quadrirotor autonome pour la détection de maladies sur des plantations de cacao au Cameroun via YOLO v4, TensorFlow et Jetson Nano.',
    descriptionFr:
      'Conception et développement d\'un drone quadrirotor autonome pour la détection automatisée d\'anomalies et de maladies sur les plantations de cacao au Cameroun. Combine ingénierie mécatronique (modélisation SolidWorks/MATLAB) et deep learning (YOLO v4, ResNet, NasNet-A-Large) pour la détection et classification en temps réel, déployé sur Raspberry Pi 3 et Jetson Nano.',
    descriptionEn:
      'Design and development of an autonomous quadcopter drone for automated detection of anomalies and diseases on cocoa plantations in Cameroon. Combines mechatronics engineering (SolidWorks/MATLAB modeling) and deep learning (YOLO v4, ResNet, NasNet-A-Large) for real-time detection and classification, deployed on Raspberry Pi 3 and Jetson Nano.',
    longDescFr:
      'Le projet comprend trois volets majeurs : (1) la modélisation 3D et le dimensionnement mécanique du drone sous SolidWorks et MATLAB pour supporter l\'ensemble des composants embarqués ; (2) l\'entraînement de modèles de deep learning (YOLO v4 pour la détection, ResNet et NasNet-A-Large pour la classification) avec TensorFlow et PyTorch sur un dataset de plants de cacao sains et malades ; (3) le déploiement embarqué sur Raspberry Pi 3 et Jetson Nano pour le traitement temps réel en vol. Les résultats incluent une géolocalisation précise des anomalies détectées et la génération de cartes de répartition permettant aux agriculteurs d\'intervenir rapidement et de manière ciblée. Un prototype fonctionnel a été produit dans le cadre du projet de fin d\'études en Mécatronique.',
    longDescEn:
      'The project comprises three major components: (1) 3D modeling and mechanical sizing of the drone in SolidWorks and MATLAB to support all onboard components; (2) training of deep learning models (YOLO v4 for detection, ResNet and NasNet-A-Large for classification) with TensorFlow and PyTorch on a dataset of healthy and diseased cocoa plants; (3) embedded deployment on Raspberry Pi 3 and Jetson Nano for real-time in-flight processing. The results include precise geolocation of detected anomalies and the generation of distribution maps allowing farmers to intervene quickly and in a targeted manner. A working prototype was produced as part of the Mechatronics thesis project.',
    technologies: [
      'Python', 'TensorFlow', 'PyTorch', 'YOLO v4', 'ResNet', 'NasNet-A-Large',
      'OpenCV', 'Raspberry Pi 3', 'Jetson Nano', 'MATLAB', 'SolidWorks',
    ],
    featured: false,
    order: 11,
    startDate: new Date('2020-01-01'),
    endDate: new Date('2020-07-01'),
    organization: 'Projet de fin d\'études — Mécatronique',
  },

  // ─── 12. Ferme Aquaponique Intelligente ───────────────────────────────────
  {
    title: 'Ferme Aquaponique Intelligente',
    titleFr: 'Ferme Aquaponique Intelligente',
    titleEn: 'Smart Aquaponic Farm',
    description: 'Système agricole intelligent IoT/IA pour surveiller et équilibrer en temps réel les paramètres d\'une ferme aquaponique (poissons + plantes en circuit fermé).',
    descriptionFr:
      'Conception d\'un système agricole intelligent reposant sur l\'aquaponie — culture symbiotique de poissons et de plantes dans un circuit fermé d\'eau. L\'IA surveille en continu les paramètres critiques (qualité de l\'eau, santé des poissons, nutriments), anticipe les déséquilibres et propose des actions correctives automatisées. Illustre l\'intersection entre mécatronique embarquée et IA appliquée.',
    descriptionEn:
      'Design of a smart agricultural system based on the aquaponics principle — symbiotic cultivation of fish and plants in a closed water circuit. The AI continuously monitors critical parameters (water quality, fish health, nutrients), anticipates imbalances, and proposes automated corrective actions. Illustrates the intersection between embedded mechatronics and applied AI.',
    longDescFr:
      'Le projet exploite l\'intelligence artificielle pour surveiller en continu les paramètres critiques du système : qualité de l\'eau, santé des poissons, niveau de nutriments dans les bacs de plantes et de poissons. L\'IA analyse les données des capteurs IoT en temps réel pour maintenir l\'équilibre biologique entre les deux écosystèmes, anticiper les déséquilibres avant qu\'ils ne deviennent critiques et proposer des actions correctives automatisées. Ce projet illustre l\'intersection entre les compétences en mécatronique (capteurs, systèmes embarqués) et en IA appliquée à l\'agriculture durable.',
    longDescEn:
      'The project leverages artificial intelligence to continuously monitor the system\'s critical parameters: water quality, fish health, and nutrient levels in plant and fish tanks. The AI analyzes IoT sensor data in real time to maintain biological balance between the two ecosystems, anticipate imbalances before they become critical, and propose automated corrective actions. This project illustrates the intersection between mechatronics skills (sensors, embedded systems) and applied AI for sustainable agriculture.',
    technologies: [
      'Python', 'IoT', 'Capteurs environnementaux', 'IA appliquée', 'Microcontrôleurs',
    ],
    featured: false,
    order: 12,
    organization: 'Projet de recherche personnel',
  },
];

async function main() {
  console.log('🌱 Seeding real projects...');

  await prisma.project.deleteMany({});
  console.log('🗑️  Cleared existing projects');

  for (const data of projects) {
    const project = await prisma.project.create({ data });
    console.log(`✅ Created: ${project.titleFr}`);
  }

  console.log(`\n🎉 ${projects.length} projects created successfully!`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
