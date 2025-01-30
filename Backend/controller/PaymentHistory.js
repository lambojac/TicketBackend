import Stripe from 'stripe';
import Transaction from '../models/Transaction.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const getPaymentHistory = async (req, res) => {
    try {
        const userId = req.user._id; 

        // Fetch transactions from the database
        const transactions = await Transaction.find({ userId })
            .populate('ticketId')
            .sort({ createdAt: -1 });

        // Fetch Stripe transactions if they exist
        const stripePaymentIntents = await Promise.all(
            transactions
                .filter(tx => tx.stripePaymentIntentId) 
                .map(async (tx) => {
                    const paymentIntent = await stripe.paymentIntents.retrieve(tx.stripePaymentIntentId);
                    return {
                        id: paymentIntent.id,
                        amount: paymentIntent.amount / 100, 
                        currency: paymentIntent.currency,
                        status: paymentIntent.status,
                        created: new Date(paymentIntent.created * 1000), 
                        paymentMethod: 'Stripe'
                    };
                })
        );

        // Combine PayPal and Stripe transactions
        const formattedTransactions = transactions.map(tx => ({
            id: tx.transactionId,
            amount: tx.amount,
            currency: 'USD', 
            status: tx.status,
            created: tx.createdAt,
            ticket: tx.ticketId,
            paymentMethod: tx.paypalOrderId ? 'PayPal' : 'Stripe'
        }));

        // Merge Stripe transactions into the list
        const allTransactions = [...formattedTransactions, ...stripePaymentIntents];

        res.json(allTransactions);
    } catch (error) {
        res.status(500).send('Error fetching payment history: ' + error.message);
    }
};

export { getPaymentHistory };
