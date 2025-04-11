import Stripe from 'stripe';
import dotenv from 'dotenv';


dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


export const createStripeCheckoutSession = async (ticketTitle, totalPrice, ticketCount, successUrl, cancelUrl, metadata) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: ticketTitle },
            unit_amount: totalPrice * 100, 
          },
          quantity: ticketCount,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: metadata,
    });
    
    return session;
  } catch (error) {
    throw new Error(`Error creating checkout session: ${error.message}`);
  }
};


export const retrieveCheckoutSession = async (sessionId) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return session;
  } catch (error) {
    throw new Error(`Error retrieving checkout session: ${error.message}`);
  }
};