import { createStripeCheckoutSession, retrieveCheckoutSession } from '../utils/stripe.js';
import Ticket from '../models/Event.js';
import Transaction from '../models/Transaction.js';
import { v4 as uuidv4 } from 'uuid';

// Create a checkout session for ticket purchase
export const createTicketCheckoutSession = async (req, res) => {
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
    const transactionId = uuidv4(); 
    
    // Create Stripe checkout session
    const session = await createStripeCheckoutSession(
      ticket.title,
      totalPrice,
      ticketCount,
      `afrohub://payment-successful?session_id={CHECKOUT_SESSION_ID}`,
      `afrohub:/payment-cancelled`,
      { 
        userId: userId,
        ticketId: ticketId,
        transactionId: transactionId
      }
    );
    
    // Save transaction in database with 'PENDING' status
    const transaction = new Transaction({
      transactionId: transactionId,
      userId,
      ticketId,
      stripeSessionId: session.id,
      amount: totalPrice,
      ticketCount,
      status: 'PAID'  
    });
    
    await transaction.save();
    
    res.status(201).json({
      url: session.url,
      sessionId: session.id,
      transactionId: transaction.transactionId,
      amount: totalPrice,
      status: transaction.status
    });
    
  } catch (error) {
    res.status(500).json({ message: 'Error creating checkout session', error: error.message });
  }
};

// Handle successful checkout completion
export const completeTicketPayment = async (req, res) => {
  try {
    const { session_id } = req.query;
    console.log('Received session_id:', session_id);
    if (!session_id) {
      return res.status(400).json({ message: 'Session ID is required.' });
    }
    
    // Retrieve the session from Stripe
    const session = await retrieveCheckoutSession(session_id);
    
    if (session.payment_status !== 'paid') {
      return res.status(400).json({ message: 'Payment not completed.' });
    }
    
    // Update transaction status in database
    const transaction = await Transaction.findOne({ stripeSessionId: session.id });
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found.' });
    }
    
    transaction.status = 'COMPLETED';
    transaction.paymentDetails = session;
    await transaction.save();
    res.json({
      message: 'Payment successful',
      transactionId: transaction.transactionId,
      status: transaction.status
    });
    
  } catch (error) {
    res.status(500).json({ message: 'Error completing payment', error: error.message });
  }
};

// Handle payment cancellation
export const cancelTicketPayment = async (req, res) => {
  try {
    const { session_id } = req.query;
    
    if (session_id) {
      const transaction = await Transaction.findOne({ stripeSessionId: session_id });
      if (transaction) {
        transaction.status = 'CANCELLED';
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
      const session = await retrieveCheckoutSession(transaction.stripeSessionId);
      stripeStatus = session.payment_status;
    }
    
    res.json({
      transactionId: transaction.transactionId,
      status: transaction.status,
      stripeStatus: stripeStatus,
      amount: transaction.amount,
      ticketCount: transaction.ticketCount
    });
    
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving payment status', error: error.message });
  }
};
