import { createOrder, capturePayment } from '../utils/paypal.js';
import Ticket from '../models/Event.js';
import Transaction from '../models/Transaction.js';
import { v4 as uuidv4 } from 'uuid';

const createOrderController = async (req, res) => {
    try {
        const { ticketId, ticketCount } = req.body;
        const userId = req.user.id; 

        if (!ticketId || !ticketCount) {
            return res.status(400).send('Ticket ID and count are required.');
        }

        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            return res.status(404).send('Ticket not found.');
        }

        const ticketPrice = parseFloat(ticket.price);
        if (isNaN(ticketPrice)) {
            return res.status(400).send('Invalid ticket price.');
        }

        const totalPrice = ticketPrice * parseInt(ticketCount, 10);

        // Create PayPal order
        const paypalOrder = await createOrder(totalPrice);

        // Create transaction record
        const transaction = new Transaction({
            transactionId: uuidv4(),
            userId,
            ticketId,
            paypalOrderId: paypalOrder.id,
            amount: totalPrice,
            ticketCount,
            status: 'PENDING'
        });
        await transaction.save();

        const approvalUrl = paypalOrder.links.find(link => link.rel === 'approve').href;
        res.json({
            transactionId: transaction.transactionId,
            approvalUrl
        });
    } catch (error) {
        res.status(500).send('Error creating order: ' + error.message);
    }
};

const completeOrderController = async (req, res) => {
    let transaction;
    try {
        const { token } = req.query;
        if (!token) {
            return res.status(400).send('Missing payment token.');
        }

        // Find the pending transaction
        transaction = await Transaction.findOne({
            paypalOrderId: token,
            status: 'PENDING'
        });

        if (!transaction) {
            return res.status(404).send('Transaction not found.');
        }

        // Capture payment
        const captureData = await capturePayment(token);

        // Update transaction status
        transaction.status = 'COMPLETED';
        transaction.paymentDetails = captureData;
        await transaction.save();

        res.json({
            message: 'Payment successful',
            transactionId: transaction.transactionId,
            details: captureData
        });
    } catch (error) {
        // Update transaction status if it exists
        if (transaction) {
            transaction.status = 'FAILED';
            transaction.paymentDetails = { error: error.message };
            await transaction.save();
        }
        res.status(500).send('Error completing order: ' + error.message);
    }
};

const cancelOrderController = async (req, res) => {
    try {
        const { token } = req.query;
        if (token) {
            const transaction = await Transaction.findOne({ paypalOrderId: token });
            if (transaction) {
                transaction.status = 'CANCELLED';
                await transaction.save();
            }
        }
        res.redirect('/');
    } catch (error) {
        res.status(500).send('Error cancelling order: ' + error.message);
    }
};

// New endpoint to get payment history
const getPaymentHistory = async (req, res) => {
    try {
        const userId = req.user._id; 
        const transactions = await Transaction.find({ userId })
            .populate('ticketId')
            .sort({ createdAt: -1 });

        res.json(transactions);
    } catch (error) {
        res.status(500).send('Error fetching payment history: ' + error.message);
    }
};

export {
    createOrderController,
    completeOrderController,
    cancelOrderController,
    getPaymentHistory
};