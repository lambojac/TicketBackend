import User from "../models/userModel.js";

// Constants for excluded fields
const EXCLUDE_FIELDS = '-password';

const getAllUsers = async (req, res) => {
  try {
    // Add optional pagination
    const { page = 1, limit = 10 } = req.query; // Default values

    const users = await User.find({}, EXCLUDE_FIELDS)
      .skip((page - 1) * limit) // Skip based on page
      .limit(parseInt(limit)); // Limit the number of results

    const totalUsers = await User.countDocuments(); // Total users for pagination

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        total: totalUsers,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalUsers / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users',
    });
  }
};

export default getAllUsers;
