import { loadStripe } from '@stripe/stripe-js';
import { supabase } from './supabase';

const STRIPE_PUBLIC_KEY = 'pk_test_51QLmr4C08T73wXPwtzhRkUplF33WWW9GmHxrmtq5ndVYoqnlloivPgh3rPhmcTyr860zS7BZtBidGPO8jvDijgrh00mz3tdTJ1';
export const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

export const createStripeConnectAccount = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('create-connect-account', {
      body: {
        return_url: `${window.location.origin}/dashboard/settings`
      }
    });

    if (error) throw error;
    if (!data?.url) throw new Error('Invalid account link data');

    window.location.href = data.url;
  } catch (error) {
    console.error('Stripe Connect error:', error);
    throw error;
  }
};

export const createPaymentSession = async (
  services: any[], 
  propertyId: string,
  guestInfo: { guestName: string; guestEmail: string }
) => {
  try {
    // Récupérer la propriété avec l'ID du compte Stripe
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .select('host_stripe_account_id, user_id')
      .eq('id', propertyId)
      .single();

    if (propertyError) throw propertyError;
    if (!property?.host_stripe_account_id) {
      throw new Error('Host Stripe account not found');
    }

    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: {
        services,
        propertyId,
        hostStripeAccountId: property.host_stripe_account_id,
        success_url: `${window.location.origin}/payment/success`,
        cancel_url: `${window.location.origin}/payment/cancel`,
        guestInfo,
        userId: property.user_id
      }
    });

    if (error) throw error;
    if (!data?.sessionId) throw new Error('Invalid session data');

    const stripe = await stripePromise;
    if (!stripe) throw new Error('Stripe not initialized');

    const { error: redirectError } = await stripe.redirectToCheckout({
      sessionId: data.sessionId
    });

    if (redirectError) throw redirectError;
  } catch (error) {
    console.error('Payment error:', error);
    throw error;
  }
};

export const getStripeAnalytics = async (timeframe: 'week' | 'month' | 'year') => {
  try {
    const { data, error } = await supabase.functions.invoke('get-analytics', {
      body: { timeframe }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Analytics error:', error);
    throw error;
  }
};