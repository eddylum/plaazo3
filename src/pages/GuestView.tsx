import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ShoppingCart, MapPin, Star } from 'lucide-react';
import ServiceCard from '../components/ServiceCard';
import { supabase } from '../lib/supabase';
import { createPaymentSession } from '../lib/stripe';
import toast from 'react-hot-toast';
import type { Property, Service } from '../lib/supabase-types';

export default function GuestView() {
  // ... autres states ...

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setProcessingPayment(true);
      
      // On crée directement la session de paiement Stripe
      await createPaymentSession(selectedServiceItems, propertyId!, {
        guestName: guestInfo.name,
        guestEmail: guestInfo.email
      });

      // La commande sera créée côté serveur une fois le paiement initié
      
    } catch (error) {
      console.error('Error processing order:', error);
      toast.error('Erreur lors du traitement de la commande');
    } finally {
      setProcessingPayment(false);
    }
  };

  // ... reste du code ...
}