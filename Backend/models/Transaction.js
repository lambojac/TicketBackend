// models/Transaction.js
import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    transactionId: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ticketId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    paypalOrderId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    ticketCount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED'],
        default: 'PENDING'
    },
    paymentDetails: {
        type: Object
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Transaction', transactionSchema);