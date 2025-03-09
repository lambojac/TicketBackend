import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    image: {
        type: String,
        default: null, // Explicitly set to null if not provided
    },
    full_name: {
        type: String,
        required: [true, "Please provide your full name"], // Changed to full name as you might want first + last name
    },
    
    name: {
        type: String, 
    },

    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
        trim: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please enter a valid email",
        ],
    },

    password: {
        type: String,
        required: [true, "Please provide a password"],
        minLength: [6, "Password must have at least 6 characters"],
    },

    phone_number: {
        type: String,
        default: "+234",
    },
    
    confirm_password: {
        type: String,
    },
    role: { type: String, enum: ['admin', 'user','ambassador',"artist","sub_admin"], default: 'user' },
    interests: [{
        type: String
      }],
      bookmarkedEvents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
      }],
      entityDescription: {
        type: String,
        default: "",
    },
    countryLocated: {
        type: String,
        default: "",
    },
    countryRepresented: {
        type: String,
        default: "",
    },
    mediaFiles: [{
        type: String, // List of media file URLs or paths
    }]
    
}, { timestamps: true });

// Pre-save hook to extract the first name from full_name
userSchema.pre("save", async function (next) {
    if (this.full_name) {
        // Split full name to extract the first name
        const firstName = this.full_name.split(" ")[0];
        this.name = firstName; // Set name to first name
    }

    // Hash the password before saving
    if (this.isModified("password")) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

export default mongoose.model("User", userSchema);
