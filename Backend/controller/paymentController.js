import { createOrder, capturePayment } from '../utils/paypal.js';
import Ticket from '../models/Event.js';

// Create an order and redirect to PayPal
const createOrderController = async (req, res) => {
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

        // Create PayPal order
        const order = await createOrder(totalPrice);

        // Find the approval URL
        const approvalUrl = order.links.find(link => link.rel === 'approve').href;
        res.redirect(approvalUrl);
    } catch (error) {
        res.status(500).send('Error creating order: ' + error.message);
    }
};

// Complete the order
const completeOrderController = async (req, res) => {
    try {
        const { token } = req.query;
        if (!token) {
            return res.status(400).send('Missing payment token.');
        }

        // Capture payment
        const capture = await capturePayment(token);

        res.send('Payment successful: ' + JSON.stringify(capture));
    } catch (error) {
        res.status(500).send('Error completing order: ' + error.message);
    }
};

// Handle canceled orders
const cancelOrderController = (req, res) => {
    res.redirect('/');
};

export { createOrderController, completeOrderController, cancelOrderController };
