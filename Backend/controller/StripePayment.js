// controllers/paymentController.js
import { createStripeCheckoutSession, retrieveCheckoutSession } from '../utils/stripe.js';
import Ticket from '../models/Event.js';
import Transaction from '../models/Transaction.js';
import { v4 as uuidv4 } from 'uuid';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create a checkout session for ticket purchase
export const createTicketCheckoutSession = async (req, res) => {
    try {
      const { userId, ticketId, ticketCount } = req.body;
     
      if (!userId || !ticketId || !ticketCount) {
        return res.status(400).json({ message: 'User ID, Ticket ID, and Ticket Count are required.' });
      }
     
      const ticket = await Ticket.findById(ticketId);
      if (!ticket) {
        return res.status(404).json({ message: 'Ticket not found.' });
      }
     
      const ticketPrice = parseFloat(ticket.price);
      if (isNaN(ticketPrice)) {
        return res.status(400).json({ message: 'Invalid ticket price.' });
      }
     
      const totalPrice = ticketPrice * parseInt(ticketCount, 10);
      const transactionId = uuidv4();
     
      // Create Stripe checkout session
      const session = await createStripeCheckoutSession(
        ticket.title,
        totalPrice,
        ticketCount,
        `https://afrohub.onrender.com/payment-successful?session_id={CHECKOUT_SESSION_ID}`,
        `https://afrohub.onrender.com/payment-cancelled`,
        {
          userId: userId,
          ticketId: ticketId,
          transactionId: transactionId
        }
      );
     
      // Just store the session ID and basic info without setting a status
      const transaction = new Transaction({
        transactionId: transactionId,
        userId,
        ticketId,
        stripeSessionId: session.id,
        amount: totalPrice,
        ticketCount
      });
     
      await transaction.save();
      res.status(201).json({
        url: session.url,
        sessionId: session.id,
        transactionId: transaction.transactionId,
        amount: totalPrice
      });
     
    } catch (error) {
      res.status(500).json({ message: 'Error creating checkout session', error: error.message });
    }
  };

// Handle successful checkout completion
export const completeTicketPayment = async (req, res) => {
  try {
    const { session_id } = req.params;
    console.log('Received session_id:', session_id);
    if (!session_id) {
      return res.status(400).json({ message: 'Session ID is required.' });
    }
   
    // Retrieve the session from Stripe
    const session = await retrieveCheckoutSession(session_id);
    
    // Find the associated transaction
    const transaction = await Transaction.findOne({ stripeSessionId: session.id });
   
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found.' });
    }
   
    // Store the Stripe session data for reference
    transaction.paymentDetails = session;
    await transaction.save();
    
    res.json({
      success: true,
      message: 'Payment processed',
      transactionId: transaction.transactionId,
      status: session.payment_status,
      paymentIntent: session.payment_intent
    });
   
  } catch (error) {
    res.status(500).json({ message: 'Error processing payment', error: error.message });
  }
};

// Handle payment cancellation
export const cancelTicketPayment = async (req, res) => {
  try {
    const { session_id } = req.query;
   
    if (session_id) {
      // Retrieve current status from Stripe
      const session = await retrieveCheckoutSession(session_id);
      const transaction = await Transaction.findOne({ stripeSessionId: session_id });
      
      if (transaction) {
        // Update with the current Stripe status data
        transaction.paymentDetails = session;
        await transaction.save();
      }
    }
   
    res.status(200).json({ message: 'Payment was canceled.' });
  } catch (error) {
    res.status(500).json({ message: 'Error handling payment cancellation', error: error.message });
  }
};

export const getPaymentStatus = async (req, res) => {
    try {
      const { transactionId } = req.params;
  
      const transaction = await Transaction.findOne({ transactionId });
  
      if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found.' });
      }
  
      let stripeStatus = null;
  
      if (transaction.stripeSessionId) {
        const session = await stripe.checkout.sessions.retrieve(transaction.stripeSessionId);
        stripeStatus = session.payment_status;
      }
  
      res.json({
        stripe_status: stripeStatus,
        transactionId: transaction.transactionId,
        amount: transaction.amount,
        ticketCount: transaction.ticketCount,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Something went wrong.', error: error.message });
    }
  };