import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@13.11.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

const STRIPE_SECRET_KEY = 'sk_test_51QLmr4C08T73wXPwvsBSFL7DBiFgU1NR9PZNTE8faUjQ8yEGTwdUboloTNS0lTIJ527kMb2Jb0hgsGNG0nr6uUOc003f8Lnwou'
const SUPABASE_URL = 'https://nlryvsswbbxdatxvpjni.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5scnl2c3N3YmJ4ZGF0eHZwam5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE3NTkxNDgsImV4cCI6MjA0NzMzNTE0OH0.N0AAWZwkjdzU9zfRRnw0jo7Qm2Wb6GSb6Gv7nbpd37E'

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Max-Age': '86400',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { return_url } = await req.json()
    const authHeader = req.headers.get('Authorization')
    
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    })

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) throw new Error('Unauthorized')

    // Vérifier si l'utilisateur a déjà un compte Stripe
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('stripe_account_id')
      .eq('id', user.id)
      .single()

    let accountId = profile?.stripe_account_id

    if (!accountId) {
      // Créer un nouveau compte Stripe si l'utilisateur n'en a pas
      const account = await stripe.accounts.create({
        type: 'express',
        country: 'FR',
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
      })
      accountId = account.id

      // Mettre à jour le profil avec l'ID du compte Stripe
      await supabaseClient
        .from('profiles')
        .update({ 
          stripe_account_id: accountId,
          stripe_account_status: 'pending'
        })
        .eq('id', user.id)
    }

    // Vérifier le statut du compte
    const account = await stripe.accounts.retrieve(accountId)
    
    // Mettre à jour le statut dans la base de données
    await supabaseClient
      .from('profiles')
      .update({ 
        stripe_account_status: account.details_submitted ? 'active' : 'pending'
      })
      .eq('id', user.id)

    // Créer le lien d'onboarding
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: return_url,
      return_url: return_url,
      type: 'account_onboarding',
    })

    return new Response(
      JSON.stringify({ url: accountLink.url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})