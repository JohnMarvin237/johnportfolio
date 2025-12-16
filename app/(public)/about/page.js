import Button from '@/components/ui/Button'
import Link from 'next/link'

export const metadata = {
  title: 'À propos - John Portfolio',
  description: 'En savoir plus sur John, développeur Full-Stack passionné par l\'innovation',
}

export default function AboutPage() {
  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            À propos de moi
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Développeur passionné, toujours à la recherche de nouveaux défis techniques
          </p>
        </div>

        {/* Contenu principal */}
        <div className="mt-12 max-w-4xl mx-auto">
          {/* Introduction */}
          <section className="prose prose-lg max-w-none">
            <div className="bg-gradient-to-r from-primary-50 to-white rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Bonjour, je suis John !
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Développeur Full-Stack avec plus de 3 ans d'expérience, je suis passionné par la création
                de solutions technologiques innovantes. Mon expertise s'étend du développement web moderne
                avec React et Next.js à l'intégration de solutions d'intelligence artificielle.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                Actuellement basé à Ottawa-Gatineau, je travaille sur des projets qui combinent
                développement web et IA pour créer des expériences utilisateur exceptionnelles
                et résoudre des problèmes complexes.
              </p>
            </div>
          </section>

          {/* Mon parcours */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Mon parcours
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Mon parcours dans le développement a commencé il y a plusieurs années avec une
                passion pour résoudre des problèmes et créer des choses utiles. Depuis, j'ai eu
                l'opportunité de travailler sur divers projets, des applications web aux systèmes
                d'intelligence artificielle.
              </p>
              <p>
                J'ai étudié à La Cité Collégiale où j'ai obtenu mon diplôme en programmation
                informatique. Cette formation m'a donné des bases solides en développement logiciel
                et m'a permis d'explorer différentes technologies.
              </p>
              <p>
                Aujourd'hui, je continue d'apprendre et de me perfectionner, toujours curieux
                des nouvelles technologies et des meilleures pratiques du secteur.
              </p>
            </div>
          </section>

          {/* Ce que j'aime faire */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Ce que j'aime faire
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Développement Web
                </h3>
                <p className="text-gray-700">
                  Créer des applications web performantes et intuitives avec les dernières
                  technologies comme React, Next.js et Node.js.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Intelligence Artificielle
                </h3>
                <p className="text-gray-700">
                  Explorer et implémenter des solutions d'IA pour résoudre des problèmes
                  complexes, notamment en vision par ordinateur et traitement du langage naturel.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Architecture Cloud
                </h3>
                <p className="text-gray-700">
                  Concevoir et déployer des infrastructures scalables sur AWS, Azure et GCP
                  avec une approche DevOps.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Mentorat
                </h3>
                <p className="text-gray-700">
                  Partager mes connaissances et aider d'autres développeurs à progresser
                  dans leur carrière.
                </p>
              </div>
            </div>
          </section>

          {/* Valeurs */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Mes valeurs
            </h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-bold">1</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Qualité</h3>
                  <p className="text-gray-700 mt-1">
                    Je m'engage à livrer du code propre, maintenable et performant.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-bold">2</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Innovation</h3>
                  <p className="text-gray-700 mt-1">
                    Toujours à la recherche de solutions créatives et efficaces.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-bold">3</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Collaboration</h3>
                  <p className="text-gray-700 mt-1">
                    Travailler en équipe pour atteindre des objectifs communs.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center bg-primary-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Travaillons ensemble !
            </h2>
            <p className="text-gray-700 mb-6">
              Je suis toujours ouvert à discuter de nouveaux projets et opportunités.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/contact">
                <Button size="lg">
                  Me contacter
                </Button>
              </Link>
              <Link href="/projects">
                <Button variant="outline" size="lg">
                  Voir mes projets
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}