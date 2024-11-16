const User = require("../Model/User");

const fetchUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("username role"); // Fetch only name and role

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ name: user.username, role: user.role, userId: user._id });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Server error" });
  }
};
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'username _id');
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

module.exports = { fetchUser, getAllUsers };
