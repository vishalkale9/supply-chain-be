import User from "../models/user.model.js";

// @desc    Get users by role
// @route   GET /api/users
// @access  Private (Needs auth middleware, but we can assume it's protected by the router)
export const getUsersByRole = async (req, res) => {
    try {
        const { role } = req.query;
        
        let query = {};
        if (role) {
            query.role = role;
        }

        const users = await User.find(query).select('-password');
        
        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};
