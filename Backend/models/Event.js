import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  id: Number,
  image: String,
  geoTag:String,
  title: {
    type: String,
    required: true
  },
  paypalUsername:String,
  location: String,
 
  date: String,
  price: {
    type:String,
    default: 0
  },
  category: String,
  time: String,
  address: String,
  latitude: Number,
  longitude: Number,
  organiser: String,
  description: String,
  unit: {
    type: Number,
    default: 0
  },
  organizerPhoto: String,
  QRCodeLink: String
}, 

{
  timestamps: true
});

const Event = mongoose.model('Event', eventSchema);
export default Event