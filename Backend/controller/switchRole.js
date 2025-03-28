import User from "../models/userModel.js"
// Endpoint to switch roles
 const switchRole=async (req, res)=>{
    const { id } = req.params;
    const { role } = req.body;

    // Validate the role
    if (!['user','ambassador','artist',"sub_admin"].includes(role)) {
        return res.status(400).json({ message: "Invalid role. Allowed roles are 'special' and 'user'." });
    }

    try {
        // Find the user by ID and update the role
        const user = await User.findByIdAndUpdate(
            id,
            { role },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: `User role updated to '${role}' successfully.`,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

export default switchRole;
