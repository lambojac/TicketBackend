import User from "../models/userModel.js";

export const deleteAccount = async (req, res) => {
  try {
    const { email, userId } = req.query; 

    // Check if either email or userId is provided
    if (!email && !userId) {
      return res.status(400).json({ message: "Email or user ID is required" });
    }

    // Create the query based on whether email or userId is provided
    let query = {};
    if (email) {
      query = { email };  // Search by email
    } else if (userId) {
      query = { _id: userId };  // Search by userId
    }

    // Find and delete the user
    const deletedUser = await User.findOneAndDelete(query);

    // If no user is found, return an error message
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Successfully deleted the user
    return res.status(200).json({ message: "User account deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
