import  mongoose from 'mongoose';

const BusinessSchema = new mongoose.Schema({
    businessTitle: { type: String, required: true },
    businessDescription: { type: String, required: true },
    businessLocation: { type: String, required: true },
    businessAddress: { type: String, required: true },
    businessCategory: { type: String, required: true },
    twitter: String,
    facebook: String,
    linkedIn: String,
    instagram: String,
    webAddress: String,
    whatsapp: String,
    mediaFiles: [
        {
            fileName: { type: String, required: true },
            fileUrl: { type: String, required: true }
        }
    ]
});

export default  mongoose.model('Business', BusinessSchema);
