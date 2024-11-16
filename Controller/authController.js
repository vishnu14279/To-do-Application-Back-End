const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../Model/User");
const authConfig = require("../config/authConfig.js");

// Generate a random salt
const generateSalt = () => crypto.randomBytes(16).toString("hex");

// Hash a password with the salt
const hashPassword = (password, salt) => {
  const hash = crypto.createHmac("sha256", salt).update(password).digest("hex");
  return `${salt}:${hash}`;
};

// Compare a plaintext password with a hashed password
const comparePassword = (enteredPassword, storedHashedPassword) => {
  const [salt, originalHash] = storedHashedPassword.split(":");
  const hash = crypto.createHmac("sha256", salt).update(enteredPassword).digest("hex");
  console.log("Stored hash:", originalHash);
  console.log("Computed hash:", hash);
  return hash === originalHash;
};

// Register a new user
const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Generate salt and hash password before saving
    const salt = generateSalt();
    const hashedPassword = hashPassword(password, salt);
    console.log("Generated hashed password (for registration):", hashedPassword);

    const user = new User({ username, email, password: hashedPassword, role });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ error: "Error registering user" });
  }
};

// Login an existing user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = comparePassword(password, user.password);
    console.log("Password match status:", isMatch);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate a JWT token if the passwords match
    const token = jwt.sign({ id: user._id, role: user.role }, authConfig.secret, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
};

const logout = async (req, res) => {
  res.json({ message: "User logged out" });
};

module.exports = {
  register,
  login,
  logout,
};
