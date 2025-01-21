import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    message: { type: String, required: true },
    eventID: { type: mongoose.Schema.Types.ObjectId, ref: 'Event',  },
    countryID: { type: mongoose.Schema.Types.ObjectId, ref: 'Country',  },
    type: { type: String, enum: ['event', 'country'], required: true },
    createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model("Notification", notificationSchema);
