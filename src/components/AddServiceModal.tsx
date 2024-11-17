import React, { useState } from 'react';
import { X, Clock, Bed, Car, DoorOpen, Bath, Sparkles, Heart, Baby, Dog, Key, Utensils } from 'lucide-react';

const serviceTemplates = [
  {
    icon: 'clock',
    name: 'Check-in Anticipé',
    description: 'Profitez de votre logement plus tôt ! Accès dès 15h pour un début de séjour en douceur.',
    price: 15
  },
  {
    icon: 'clock',
    name: 'Check-out Tardif',
    description: 'Prolongez votre séjour jusqu\'à 12h le jour du départ pour un maximum de confort.',
    price: 15
  },
  {
    icon: 'door',
    name: 'Accueil Tardif',
    description: 'Arrivée flexible jusqu\'à 22h avec accueil personnalisé par notre équipe.',
    price: 25
  },
  {
    icon: 'clock',
    name: 'Pack Horaires Flexibles',
    description: 'Arrivée anticipée et départ tardif pour une expérience sans stress.',
    price: 25
  },
  {
    icon: 'key',
    name: 'Accueil Personnalisé',
    description: 'Remise des clés en main propre avec présentation complète du logement.',
    price: 25
  },
  {
    icon: 'bed',
    name: 'Pack Linge Premium',
    description: 'Ensemble complet de linge de maison de qualité pour votre confort.',
    price: 12
  },
  {
    icon: 'bed',
    name: 'Service Lit Préparé',
    description: 'Trouvez votre lit parfaitement fait à votre arrivée.',
    price: 8
  },
  {
    icon: 'car',
    name: 'Stationnement Privé',
    description: 'Place de parking sécurisée à proximité immédiate.',
    price: 10
  },
  {
    icon: 'dog',
    name: 'Option Animal',
    description: 'Accueil adapté pour votre compagnon à quatre pattes.',
    price: 15
  },
  {
    icon: 'baby',
    name: 'Équipement Bébé',
    description: 'Lit parapluie confortable pour le confort de votre bébé.',
    price: 7
  },
  {
    icon: 'sparkles',
    name: 'Ménage Intermédiaire',
    description: 'Service de nettoyage complet pendant votre séjour.',
    price: 25
  },
  {
    icon: 'sparkles',
    name: 'Ménage Final',
    description: 'Service de nettoyage complet en fin de séjour.',
    price: 150
  },
  {
    icon: 'heart',
    name: 'Pack Romantique',
    description: 'Ambiance romantique avec champagne offert pour une soirée magique.',
    price: 45
  }
];

const serviceIcons = {
  clock: Clock,
  bed: Bed,
  car: Car,
  door: DoorOpen,
  bath: Bath,
  sparkles: Sparkles,
  heart: Heart,
  baby: Baby,
  dog: Dog,
  key: Key,
  utensils: Utensils
};

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (service: { name: string; description: string; price: number; icon: string }) => void;
}

export default function AddServiceModal({ isOpen, onClose, onAdd }: AddServiceModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [customService, setCustomService] = useState({
    name: '',
    description: '',
    price: '',
    icon: 'utensils'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTemplate !== null) {
      const template = serviceTemplates[selectedTemplate];
      onAdd({
        name: template.name,
        description: template.description,
        price: template.price,
        icon: template.icon
      });
    } else {
      onAdd({
        name: customService.name,
        description: customService.description,
        price: parseFloat(customService.price),
        icon: customService.icon
      });
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-4xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
        
        <h2 className="text-xl font-bold mb-4">Ajouter un Service</h2>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Services Prédéfinis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {serviceTemplates.map((template, index) => {
              const Icon = serviceIcons[template.icon];
              return (
                <div
                  key={index}
                  onClick={() => setSelectedTemplate(index)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedTemplate === index
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:border-emerald-200'
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <Icon className="h-5 w-5 text-emerald-600 mr-2" />
                    <h4 className="font-medium">{template.name}</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                  <p className="text-emerald-600 font-medium">{template.price.toFixed(2)} €</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-3">Ou créez un service personnalisé</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom du Service
              </label>
              <input
                type="text"
                value={customService.name}
                onChange={(e) => setCustomService({ ...customService, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="Ex: Service de conciergerie"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={customService.description}
                onChange={(e) => setCustomService({ ...customService, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500"
                rows={3}
                placeholder="Décrivez votre service..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prix (€)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={customService.price}
                onChange={(e) => setCustomService({ ...customService, price: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="29.99"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700"
              >
                Ajouter
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}