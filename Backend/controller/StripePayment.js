import { createStripeCheckoutSession, retrieveCheckoutSession } from '../utils/stripe.js';
import Ticket from '../models/Event.js';
import Transaction from '../models/Transaction.js';
import { v4 as uuidv4 } from 'uuid';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const getalltransaction=async(req,res)=>{
    try{
        const transaction=await Transaction.find()
        if (transaction){
            res.json(transaction).status(200)
        }else
        throw new Error
    }catch(err){
        console.log(err)
    }
}
export const deleteTransaction=async(req,res)=>{
try{
const findtransaction=await Transaction.findByIdAndDelete(req.params.id)
if(findtransaction){
    res.status(200).json({message:"transaction deleted"})


}
}catch(err){
    console.log(err)
}
}
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
      
      const totalPrice = ticketPrice * ticketCount;
      const transactionId = uuidv4();
      const session = await createStripeCheckoutSession(
        ticket.title,
        ticketPrice,
        ticketCount,
        `https://afrohub.onrender.com/payment-successful?session_id={CHECKOUT_SESSION_ID}&transaction_id=${transactionId}`,
        `https://afrohub.onrender.com/payment-cancelled?transaction_id=${transactionId}`,
        {
          userId: userId,
          ticketId: ticketId,
          transactionId: transactionId
        }
      );
      console.log(session)
      const paymentStatus = session.payment_status;
      const transaction = new Transaction({
        transactionId: transactionId,
        userId,
        ticketId,
        stripeSessionId: session.id,
        amount: totalPrice,
        ticketCount,
        paymentStatus
      });
      
      await transaction.save();
      setupPaymentStatusPolling(session.id, transactionId);
      
      res.status(201).json({
        url: session.url,
        sessionId: session.id,
        transactionId: transaction.transactionId,
        amount: totalPrice,
        paymentStatus
      });
      
    } catch (error) {
      res.status(500).json({ message: 'Error creating checkout session', error: error.message });
    }
  };
  
  
  const setupPaymentStatusPolling = async (sessionId, transactionId) => {
    try {
      const initialDelay = 5000; 
      const pollingIntervals = [10000, 15000, 30000, 60000, 120000,180000,240000, 
        300000,  360000,420000,480000,540000,
        600000, 660000,720000,780000,840000,
        900000, 
        1800000,3600000,18000000,86400000]; 

      setTimeout(async () => {
        await checkAndUpdatePaymentStatus(sessionId, transactionId);
      }, initialDelay);
      pollingIntervals.forEach((interval, index) => {
        setTimeout(async () => {
          const isCompleted = await checkAndUpdatePaymentStatus(sessionId, transactionId);
          if (isCompleted) {
            console.log(`Payment status polling complete for transaction ${transactionId}`);
          }
        }, initialDelay + pollingIntervals.slice(0, index + 1).reduce((a, b) => a + b, 0));
      });
    } catch (error) {
      console.error(`Error setting up payment polling for ${transactionId}:`, error);
    }
  };

  const checkAndUpdatePaymentStatus = async (sessionId, transactionId) => {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      const currentStatus = session.payment_status;
      const transaction = await Transaction.findOne({ transactionId });
      if (!transaction) {
        console.error(`Transaction ${transactionId} not found during status update.`);
        return true;
      }
    
      if (transaction.paymentStatus !== currentStatus) {
        transaction.paymentStatus = currentStatus;
        await transaction.save();
        console.log(`Updated transaction ${transactionId} status to ${currentStatus}`);
        if (currentStatus === 'paid') {
          await handleSuccessfulPayment(transaction);
        } else if (currentStatus === 'failed' || currentStatus === 'canceled') {
          await handleFailedPayment(transaction);
        }
      }

      return ['paid', 'failed', 'canceled'].includes(currentStatus);
    } catch (error) {
      console.error(`Error checking payment status for ${transactionId}:`, error);
      return true; 
    }
  };
  
  const handleSuccessfulPayment = async (transaction) => {
    try {
      await Ticket.findByIdAndUpdate(
        transaction.ticketId,
        { $inc: { soldCount: transaction.ticketCount } }
      );
    
    } catch (error) {
      console.error(`Error handling successful payment for ${transaction.transactionId}:`, error);
    }
  };
  

  const handleFailedPayment = async (transaction) => {
    try {
    } catch (error) {
      console.error(`Error handling failed payment for ${transaction.transactionId}:`, error);
    }
  };

// export const createTicketCheckoutSession = async (req, res) => {
//     try {
//       const { userId, ticketId, ticketCount } = req.body;
     
//       if (!userId || !ticketId || !ticketCount) {
//         return res.status(400).json({ message: 'User ID, Ticket ID, and Ticket Count are required.' });
//       }
     
//       const ticket = await Ticket.findById(ticketId);
//       if (!ticket) {
//         return res.status(404).json({ message: 'Ticket not found.' });
//       }
     
//       const ticketPrice = parseFloat(ticket.price);
//       if (isNaN(ticketPrice)) {
//         return res.status(400).json({ message: 'Invalid ticket price.' });
//       }
//       const totalPrice = ticketPrice * ticketCount;
//       const transactionId = uuidv4();
//       const session = await createStripeCheckoutSession(
//         ticket.title,
//         ticketPrice,
//         ticketCount,
//         `https://afrohub.onrender.com/payment-successful?session_id={CHECKOUT_SESSION_ID}`,
//         `https://afrohub.onrender.com/payment-cancelled`,
//         {
//           userId: userId,
//           ticketId: ticketId,
//           transactionId: transactionId
//         }
//       );
//       const paymentStatus = session.payment_status;
      
//       const transaction = new Transaction({
//         transactionId: transactionId,
//         userId,
//         ticketId,
//         stripeSessionId: session.id,
//         amount: totalPrice,
//         ticketCount,
//         paymentStatus
//       });
     
//       await transaction.save();
//       res.status(201).json({
//         url: session.url,
//         sessionId: session.id,
//         transactionId: transaction.transactionId,
//         amount: totalPrice,
//         paymentStatus
//       });
     
//     } catch (error) {
//       res.status(500).json({ message: 'Error creating checkout session', error: error.message });
//     }
//   };


export const completeTicketPayment = async (req, res) => {
  try {
    const { session_id } = req.params;
    console.log('Received session_id:', session_id);
    if (!session_id) {
      return res.status(400).json({ message: 'Session ID is required.' });
    }

    const session = await retrieveCheckoutSession(session_id);
    
    const transaction = await Transaction.findOne({ stripeSessionId: session.id });
   
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found.' });
    }
   
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


export const cancelTicketPayment = async (req, res) => {
  try {
    const { session_id } = req.query;
   
    if (session_id) {
      
      const session = await retrieveCheckoutSession(session_id);
      const transaction = await Transaction.findOne({ stripeSessionId: session_id });
      
      if (transaction) {
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