import { createStripePaymentIntent, confirmStripePayment } from '../utils/stripe.js';
import Ticket from '../models/Event.js';
import Transaction from '../models/Transaction.js';
import { v4 as uuidv4 } from 'uuid';

// Create a payment intent and return client secret
const createStripePaymentIntentController = async (req, res) => {
    try {
        const { userId, ticketId, ticketCount } = req.body;
        if (!userId || !ticketId || !ticketCount) {
            return res.status(400).json({ message: 'User ID, Ticket ID, and Ticket Count are required.' });
        }

        // Fetch ticket from database
        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found.' });
        }

        // Calculate total price
        const ticketPrice = parseFloat(ticket.price);
        if (isNaN(ticketPrice)) {
            return res.status(400).json({ message: 'Invalid ticket price.' });
        }

        const totalPrice = ticketPrice * parseInt(ticketCount, 10);

        // Create Stripe payment intent
        const paymentIntent = await createStripePaymentIntent(totalPrice);

        // Save transaction in database with 'PENDING' status
        const transaction = new Transaction({
            transactionId: uuidv4(),  // Generate unique transaction ID
            userId,
            ticketId,
            stripePaymentIntentId: paymentIntent.id,
            amount: totalPrice,
            ticketCount,
            status: 'PENDING'  // Initial status
        });

        await transaction.save();

        res.status(201).json({
            clientSecret: paymentIntent.client_secret,
            transactionId: transaction.transactionId,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
            status: transaction.status
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating payment intent', error: error.message });
    }
};


// Handle successful payment confirmation
const confirmStripePaymentController = async (req, res) => {
    try {
        const { paymentIntentId } = req.body;
        if (!paymentIntentId) {
            return res.status(400).json({ message: 'Missing payment intent ID.' });
        }

        // Confirm the payment with Stripe
        const paymentConfirmation = await confirmStripePayment(paymentIntentId);

        if (!paymentConfirmation) {
            return res.status(400).json({ message: 'Payment confirmation failed.' });
        }

        // Update transaction status in the database
        const transaction = await Transaction.findOne({ stripePaymentIntentId: paymentIntentId });

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found.' });
        }

        transaction.status = 'COMPLETED';
        transaction.paymentDetails = paymentConfirmation;
        await transaction.save();

        res.json({
            message: 'Payment successful',
            transactionId: transaction.transactionId,
            status: transaction.status,
            paymentDetails: transaction.paymentDetails
        });
    } catch (error) {
        res.status(500).json({ message: 'Error confirming payment', error: error.message });
    }
};


export { createStripePaymentIntentController, confirmStripePaymentController };
