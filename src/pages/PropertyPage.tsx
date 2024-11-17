import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PlusCircle, ArrowLeft, Link as LinkIcon, ExternalLink } from 'lucide-react';
import ServiceCard from '../components/ServiceCard';
import AddServiceModal from '../components/AddServiceModal';
import { serviceApi } from '../lib/supabase';
import type { Service } from '../lib/supabase-types';
import toast from 'react-hot-toast';

export default function PropertyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    if (id) {
      loadServices();
    }
  }, [id]);

  const loadServices = async () => {
    try {
      const data = await serviceApi.getByProperty(id!);
      setServices(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des services');
    }
  };

  const handleAddService = async (service: Omit<Service, 'id' | 'created_at' | 'property_id'>) => {
    try {
      await serviceApi.create({ ...service, property_id: id! });
      await loadServices();
      toast.success('Service ajouté avec succès');
    } catch (error) {
      toast.error('Erreur lors de l\'ajout du service');
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    try {
      await serviceApi.delete(serviceId);
      await loadServices();
      toast.success('Service supprimé avec succès');
    } catch (error) {
      toast.error('Erreur lors de la suppression du service');
    }
  };

  const handleCopyGuestLink = () => {
    const guestLink = `${window.location.origin}/guest/${id}`;
    navigator.clipboard.writeText(guestLink);
    toast.success('Lien copié dans le presse-papier !');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Retour
        </button>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Services de la Propriété</h1>
          <div className="flex space-x-4">
            <button
              onClick={handleCopyGuestLink}
              className="flex items-center px-4 py-2 text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
            >
              <LinkIcon className="h-5 w-5 mr-2" />
              Copier le lien
            </button>
            <a
              href={`/guest/${id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
            >
              <ExternalLink className="h-5 w-5 mr-2" />
              Ouvrir la page
            </a>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Ajouter un service
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              {...service}
              onDelete={handleDeleteService}
              isManagement={true}
            />
          ))}
        </div>

        <AddServiceModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddService}
        />
      </div>
    </div>
  );
}