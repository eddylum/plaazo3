import React, { useState, useEffect } from 'react';
import { Building2, Package, CreditCard } from 'lucide-react';
import { propertyApi, serviceApi } from '../lib/supabase';
import { getStripeAnalytics } from '../lib/stripe';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export default function DashboardHome() {
  const user = useAuthStore((state) => state.user);
  const [stats, setStats] = useState({
    properties: 0,
    services: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user]);

  const loadStats = async () => {
    try {
      setLoading(true);

      // Charger les propriétés
      const properties = await propertyApi.getByUser(user!.id);
      
      // Charger les services pour toutes les propriétés
      let totalServices = 0;
      for (const property of properties) {
        const services = await serviceApi.getByProperty(property.id);
        totalServices += services.length;
      }

      // Charger les revenus depuis Stripe
      const analytics = await getStripeAnalytics('month');

      setStats({
        properties: properties.length,
        services: totalServices,
        revenue: analytics?.monthlyRevenue || 0
      });
    } catch (error) {
      console.error('Error loading stats:', error);
      toast.error('Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  const statItems = [
    {
      name: 'Propriétés',
      value: stats.properties.toString(),
      icon: Building2,
      change: '',
      changeType: 'increase'
    },
    {
      name: 'Services Vendus',
      value: stats.services.toString(),
      icon: Package,
      change: '',
      changeType: 'increase'
    },
    {
      name: 'Revenus du Mois',
      value: `${stats.revenue.toFixed(2)} €`,
      icon: CreditCard,
      change: '',
      changeType: 'increase'
    }
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Tableau de Bord</h1>
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {statItems.map((stat) => (
          <div
            key={stat.name}
            className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-6 w-6 text-emerald-600" aria-hidden="true" />
              </div>
              <p className="ml-2 text-sm font-medium text-gray-500 truncate">{stat.name}</p>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              <div className="absolute bottom-0 inset-x-0 bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <span className={`text-${stat.changeType === 'increase' ? 'emerald' : 'red'}-600 font-semibold`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Revenus Mensuels</h2>
        <div className="h-64 flex items-center justify-center text-gray-500">
          Graphique des revenus à venir
        </div>
      </div>
    </div>
  );
}