import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    countryId: { type: mongoose.Schema.Types.ObjectId, ref: "Country" },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
