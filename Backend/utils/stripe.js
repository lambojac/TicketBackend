import Stripe from 'stripe';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Function to create a payment intent
export const createStripePaymentIntent = async (totalPrice) => {
    if (!Number.isInteger(totalPrice)) {
        throw new Error('Total price must be a whole number in EUR.');
    }

    const paymentIntent = await stripe.paymentIntents.create({
        amount: totalPrice *1,
        currency: 'eur',
        payment_method_types: ['card'], // Accepting card payments
    });

    return paymentIntent;
};

// Function to confirm a payment
export const confirmStripePayment = async (paymentIntentId) => {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== 'succeeded') {
        throw new Error('Payment not completed.');
    }
    return paymentIntent;
};
