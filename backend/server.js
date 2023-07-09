const express = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(cors());

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const User = mongoose.model('User', {
  firstName: String,
  lastName: String,
  email: String,
  password: String,
});


const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  jwt.verify(token, 'secretKey', (err, decoded) => {
    if (err) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    req.userId = decoded.userId;
    next();
  });
};


app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({ success: true, message: 'Access granted to protected route', userId: req.userId });
});

app.post('/api/signup', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const hashedPassword = crypto
    .createHash('sha256')
    .update(password)
    .digest('hex');

  try {
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    res.json({ success: true, message: 'Voila! Registration successful' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const hashedPassword = crypto
      .createHash('sha256')
      .update(password)
      .digest('hex');

    if (user.password !== hashedPassword) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, 'secretKey');

    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, message: 'An error occurred' });
  }
});

app.post('/api/update', authMiddleware, async (req, res) => {
  const { firstName, lastName, email } = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { firstName, lastName, email }, 
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: 'User details updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: 'An error occurred' });
  }
});


app.listen(3003, () => {
  console.log('Server started on port 3000');
  console.log('connected to mongoDb');
});
