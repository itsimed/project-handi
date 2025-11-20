/**
 * Home Page - Page d'accueil publique
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Users, Heart, ArrowRight } from 'lucide-react';
import Button from '../ui/Button';
import Card, { CardContent } from '../ui/Card';
import { ROUTES } from '../constants';

const HomePage: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-cyan-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              L'emploi accessible à tous
            </h1>
            <p className="text-xl sm:text-2xl text-indigo-100 mb-8">
              TalentConnect est la plateforme de recrutement inclusive qui facilite
              la rencontre entre talents et entreprises engagées.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={ROUTES.CANDIDATE_OFFERS}>
                <Button size="lg" variant="secondary" fullWidth>
                  Trouver un emploi
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to={ROUTES.REGISTER_RECRUITER}>
                <Button size="lg" variant="outline" fullWidth className="bg-white/10 border-white text-white hover:bg-white/20">
                  Recruter des talents
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Pourquoi choisir TalentConnect ?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card padding="lg" shadow="md">
              <CardContent>
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Heart className="w-8 h-8 text-indigo-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-center mb-3">
                  Inclusif par nature
                </h3>
                <p className="text-gray-600 text-center">
                  Nous croyons que chaque personne mérite sa chance. Notre plateforme
                  valorise la diversité et l'inclusion.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card padding="lg" shadow="md">
              <CardContent>
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center">
                    <Briefcase className="w-8 h-8 text-cyan-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-center mb-3">
                  Offres adaptées
                </h3>
                <p className="text-gray-600 text-center">
                  Des milliers d'offres d'emploi avec des aménagements possibles
                  et des entreprises engagées.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card padding="lg" shadow="md">
              <CardContent>
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8 text-emerald-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-center mb-3">
                  Accompagnement
                </h3>
                <p className="text-gray-600 text-center">
                  Ressources, guides et organismes partenaires pour vous accompagner
                  dans votre parcours professionnel.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à commencer ?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Rejoignez des milliers de candidats et recruteurs qui utilisent
            TalentConnect pour construire un monde professionnel plus inclusif.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={ROUTES.REGISTER_CANDIDATE}>
              <Button size="lg" variant="primary">
                Je suis candidat
              </Button>
            </Link>
            <Link to={ROUTES.REGISTER_RECRUITER}>
              <Button size="lg" variant="secondary">
                Je suis recruteur
              </Button>
            </Link>
            <Link to={ROUTES.REGISTER_ORGANIZATION}>
              <Button size="lg" variant="outline">
                Je suis un organisme
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
