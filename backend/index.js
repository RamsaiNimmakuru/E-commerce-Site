const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const SECRET = 'supersecretkey';

// In-memory data stores
let users = [];
let items = [
  { id: 1, name: 'Laptop', price: 1000, category: 'Electronics' },
  { id: 2, name: 'Phone', price: 500, category: 'Electronics' },
  { id: 3, name: 'Shirt', price: 30, category: 'Clothing' },
  { id: 4, name: 'Book', price: 15, category: 'Books' },
];
let carts = {}; // userId -> [{itemId, quantity}]

// Helper: Authenticate middleware
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token' });
  const token = authHeader.split(' ')[1];
  try {
    const user = jwt.verify(token, SECRET);
    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Signup
app.post('/api/signup', (req, res) => {
  const { username, password } = req.body;
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ error: 'User  exists' });
  }
  const id = users.length + 1;
  users.push({ id, username, password });
  res.json({ message: 'User  created' });
});

// Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, username: user.username }, SECRET);
  res.json({ token });
});

// Get filtered items
app.get('/api/items', (req, res) => {
  let filtered = items;
  const { category, minPrice, maxPrice } = req.query;
  if (category) filtered = filtered.filter(i => i.category.toLowerCase() === category.toLowerCase());
  if (minPrice) filtered = filtered.filter(i => i.price >= Number(minPrice));
  if (maxPrice) filtered = filtered.filter(i => i.price <= Number(maxPrice));
  res.json(filtered);
});

// Add item
app.post('/api/items', (req, res) => {
  const { name, price, category } = req.body;
  const id = items.length + 1;
  items.push({ id, name, price, category });
  res.json({ message: 'Item added', item: { id, name, price, category } });
});

// Update item
app.put('/api/items/:id', (req, res) => {
  const id = Number(req.params.id);
  const item = items.find(i => i.id === id);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  const { name, price, category } = req.body;
  if (name) item.name = name;
  if (price) item.price = price;
  if (category) item.category = category;
  res.json({ message: 'Item updated', item });
});

// Delete item
app.delete('/api/items/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = items.findIndex(i => i.id === id);
  if (index === -1) return res.status(404).json({ error: 'Item not found' });
  items.splice(index, 1);
  res.json({ message: 'Item deleted' });
});

// Get cart
app.get('/api/cart', authenticate, (req, res) => {
  const userId = req.user.id;
  const cart = carts[userId] || [];
  const detailed = cart.map(ci => {
    const item = items.find(i => i.id === ci.itemId);
    return { ...item, quantity: ci.quantity };
  });
  res.json(detailed);
});

// Add to cart
app.post('/api/cart', authenticate, (req, res) => {
  const userId = req.user.id;
  const { itemId, quantity } = req.body;
  if (!items.find(i => i.id === itemId)) return res.status(400).json({ error: 'Invalid item' });
  if (!carts[userId]) carts[userId] = [];
  const cart = carts[userId];
  const existing = cart.find(ci => ci.itemId === itemId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ itemId, quantity });
  }
  res.json({ message: 'Added to cart' });
});

// Remove from cart
app.delete('/api/cart/:itemId', authenticate, (req, res) => {
  const userId = req.user.id;
  const itemId = Number(req.params.itemId);
  if (!carts[userId]) return res.json({ message: 'Cart empty' });
  carts[userId] = carts[userId].filter(ci => ci.itemId !== itemId);
  res.json({ message: 'Removed from cart' });
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));