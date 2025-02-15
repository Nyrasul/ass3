const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Mongoose Models
const Product = mongoose.model('Product', new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  description: String,
  category: String,
  stock: { type: Number, default: 0, min: 0 }
}));

const User = mongoose.model('User', new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
}));

const Order = mongoose.model('Order', new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, min: 1 }
  }],
  status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' }
}, { timestamps: true }));

// Middleware for JWT Authentication
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) throw new Error();
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Routes
// Product Routes
app.post('/api/products', auth, async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

app.get('/api/products', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const products = await Product.find().skip(skip).limit(limit);
  res.json(products);
});

app.put('/api/products/:id', auth, async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(product);
});

app.delete('/api/products/:id', auth, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

// User Routes
app.post('/api/users/register', async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });
  res.status(201).json(user);
});

app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Order Routes
app.post('/api/orders', auth, async (req, res) => {
  const { products } = req.body;
  const order = await Order.create({ userId: req.user._id, products });
  res.status(201).json(order);
});

app.get('/api/orders/user/:userId', auth, async (req, res) => {
  const orders = await Order.find({ userId: req.params.userId });
  res.json(orders);
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));