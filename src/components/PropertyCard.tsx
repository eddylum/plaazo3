import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Link as LinkIcon } from 'lucide-react';

interface PropertyCardProps {
  id: string;
  name: string;
  address: string;
  image_url: string;
  onCopyLink: () => void;
}

export default function PropertyCard({ id, name, address, image_url, onCopyLink }: PropertyCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="h-48 overflow-hidden">
        <img
          src={image_url || 'https://images.unsplash.com/photo-1568605114967-8130f3a36994'}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
          <button
            onClick={onCopyLink}
            className="p-2 text-gray-500 hover:text-emerald-600 rounded-full hover:bg-gray-100"
            title="Copier le lien invité"
          >
            <LinkIcon className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-1 text-sm text-gray-500">{address}</p>
        <div className="mt-4 flex justify-between items-center">
          <Link
            to={`/property/${id}`}
            className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
          >
            Gérer les services →
          </Link>
        </div>
      </div>
    </div>
  );
}