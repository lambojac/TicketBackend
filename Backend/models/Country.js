
import mongoose from "mongoose";

const countrySchema = new mongoose.Schema(
  {
    image: { type: String,  },
    gallery:[{type:String}],
    title: { type: String, },
    president: { type: String, },
    independence_date: { type: String,  },
    capital: { type: String,  },
    currency: { type: String, },
    population: { type: String,  },
    demonym: { type: String,  },
    // latitude: { type: Number,  },
    // longitude: { type: Number,  },
    description: { type: String,  },
    language: { type: String,  },
    arts_and_crafts:{type:String,
    },
    cultural_dance:{type:String},
    time_zone: { type: String,  },
    link: { type: String, default: "" },
    association_leader_name: { type: String, },
    association_leader_email: { type: String,  },
    association_leader_phone: { type: String, },
    association_leader_photo: { type: String, default: "" },
    created_by_id: { type: mongoose.Schema.Types.ObjectId,  },
  },
  { timestamps: true }
);

const Country = mongoose.model("Country", countrySchema);
export default Country
