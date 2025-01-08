import { createStripePaymentIntent, confirmStripePayment } from '../utils/stripe.js';
import Ticket from '../models/Event.js';

// Create a payment intent and return client secret
const createStripePaymentIntentController = async (req, res) => {
    try {
        const { ticketId, ticketCount } = req.body;
        if (!ticketId || !ticketCount) {
            return res.status(400).send('Ticket ID and count are required.');
        }

        // Fetch the ticket from the database
        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            return res.status(404).send('Ticket not found.');
        }

        // Calculate total price
        const ticketPrice = parseFloat(ticket.price);
        if (isNaN(ticketPrice)) {
            return res.status(400).send('Invalid ticket price.');
        }

        const totalPrice = ticketPrice * parseInt(ticketCount, 10);

        // Create Stripe payment intent
        const paymentIntent = await createStripePaymentIntent(totalPrice);

        res.status(201).json({
            clientSecret: paymentIntent.client_secret,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
        });
    } catch (error) {
        res.status(500).send('Error creating payment intent: ' + error.message);
    }
};

// Handle successful payment confirmation
const confirmStripePaymentController = async (req, res) => {
    try {
        const { paymentIntentId } = req.body;
        if (!paymentIntentId) {
            return res.status(400).send('Missing payment intent ID.');
        }

        // Confirm the payment
        const paymentConfirmation = await confirmStripePayment(paymentIntentId);

        res.send('Payment successful: ' + JSON.stringify(paymentConfirmation));
    } catch (error) {
        res.status(500).send('Error confirming payment: ' + error.message);
    }
};

export { createStripePaymentIntentController, confirmStripePaymentController };
