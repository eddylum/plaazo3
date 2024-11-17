import React, { useState, useEffect } from 'react';
import { CreditCard, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import { createStripeConnectAccount } from '../lib/stripe';
import toast from 'react-hot-toast';
import ProfileForm from '../components/ProfileForm';

export default function Settings() {
  const user = useAuthStore((state) => state.user);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user!.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Erreur lors du chargement du profil');
    } finally {
      setLoading(false);
    }
  };

  const handleConnectStripe = async () => {
    try {
      await createStripeConnectAccount();
      // Recharger le profil après la redirection de Stripe
      await loadProfile();
    } catch (error) {
      console.error('Stripe Connect error:', error);
      toast.error('Erreur lors de la connexion à Stripe');
    }
  };

  useEffect(() => {
    // Vérifier le statut du compte Stripe toutes les 5 secondes si en attente
    let interval: NodeJS.Timeout;
    if (profile?.stripe_account_status === 'pending') {
      interval = setInterval(loadProfile, 5000);
    }
    return () => clearInterval(interval);
  }, [profile?.stripe_account_status]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Paramètres</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Profil</h2>
        <ProfileForm />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Compte Stripe</h2>
        
        {!profile?.stripe_account_id ? (
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <CreditCard className="h-6 w-6 text-gray-400" />
            </div>
            <div className="flex-1">
              <p className="text-gray-600 mb-4">
                Connectez votre compte Stripe pour recevoir les paiements de vos services.
                Notre plateforme prélève une commission de 5% sur chaque transaction.
              </p>
              <button
                onClick={handleConnectStripe}
                className="inline-flex items-center px-4 py-2 rounded-md btn-primary text-sm font-medium"
              >
                Connecter Stripe
              </button>
            </div>
          </div>
        ) : profile.stripe_account_status === 'pending' ? (
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <AlertCircle className="h-6 w-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-gray-600">
                Votre compte Stripe est en cours de configuration. 
                Veuillez compléter le processus de vérification.
              </p>
              <button
                onClick={handleConnectStripe}
                className="mt-4 inline-flex items-center px-4 py-2 rounded-md btn-primary text-sm font-medium"
              >
                Continuer la configuration
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-gray-600">
                Votre compte Stripe est connecté et actif.
                Vous pouvez recevoir des paiements pour vos services.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}