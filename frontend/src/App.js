import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
} from 'react-router-dom';
import './App.css';

const API = 'http://localhost:4000/api';

function useAuth() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const login = (t) => {
    localStorage.setItem('token', t);
    setToken(t);
  };
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };
  return { token, login, logout };
}

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (res.ok) {
      setMsg('Signup successful! Please login.');
      setTimeout(() => navigate('/login'), 1500);
    } else {
      setMsg(data.error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Signup</h2>
      <form onSubmit={submit}>
        <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
        <br />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <br />
        <button type="submit">Signup</button>
      </form>
      <p>{msg}</p>
      <p>Already have account? <Link to="/login">Login</Link></p>
    </div>
  );
}

function Login({ login }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (res.ok) {
      login(data.token);
      navigate('/items');
    } else {
      setMsg(data.error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
        <br />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <br />
        <button type="submit">Login</button>
      </form>
      <p>{msg}</p>
      <p>Don't have account? <Link to="/signup">Signup</Link></p>
    </div>
  );
}

function Items({ token }) {
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [msg, setMsg] = useState('');

  const fetchItems = async () => {
    let url = `${API}/items?`;
    if (category) url += `category=${category}&`;
    if (minPrice) url += `minPrice=${minPrice}&`;
    if (maxPrice) url += `maxPrice=${maxPrice}&`;
    const res = await fetch(url);
    const data = await res.json();
    setItems(data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const addToCart = async (itemId) => {
    if (!token) {
      setMsg('Please login to add to cart');
      return;
    }
    const res = await fetch(`${API}/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ itemId, quantity: 1 }),
    });
    const data = await res.json();
    if (res.ok) {
      setMsg('Added to cart');
    } else {
      setMsg(data.error);
    }
  };

  const applyFilters = () => {
    fetchItems();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Items</h2>
      <div>
        <input placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} />
        <input placeholder="Min Price" type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)} />
        <input placeholder="Max Price" type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
        <button onClick={applyFilters}>Filter</button>
      </div>
      <p>{msg}</p>
      <ul>
        {items.map(i => (
          <li key={i.id}>
            {i.name} - ${i.price} - {i.category}
            <button onClick={() => addToCart(i.id)}>Add to Cart</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Cart({ token }) {
  const [cartItems, setCartItems] = useState([]);
  const [msg, setMsg] = useState('');

  const fetchCart = async () => {
    if (!token) return;
    const res = await fetch(`${API}/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setCartItems(data);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  const removeFromCart = async (itemId) => {
    const res = await fetch(`${API}/cart/${itemId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) {
      setMsg('Removed from cart');
      fetchCart();
    } else {
      setMsg(data.error);
    }
  };

  if (!token) return <p style={{ padding: '20px' }}>Please login to view cart</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Your Cart</h2>
      <p>{msg}</p>
      {cartItems.length === 0 ? <p>Cart is empty</p> : (
        <ul>
          {cartItems.map(i => (
            <li key={i.id}>
              {i.name} - ${i.price} x {i.quantity}
              <button onClick={() => removeFromCart(i.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Navbar({ token, logout }) {
  return (
    <nav style={{ padding: '10px', backgroundColor: '#f5f5f5', marginBottom: '20px' }}>
      <Link style={{ marginRight: '20px' }} to="/items">Items</Link> |
      <Link style={{ margin: '0 20px' }} to="/cart">Cart</Link> |
      {token ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <>
          <Link style={{ marginRight: '20px' }} to="/login">Login</Link> |
          <Link style={{ marginLeft: '20px' }} to="/signup">Signup</Link>
        </>
      )}
    </nav>
  );
}

export default function App() {
  const auth = useAuth();

  return (
    <Router>
      <Navbar token={auth.token} logout={auth.logout} />
      <Routes>
        <Route path="/" element={<Navigate to="/items" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login login={auth.login} />} />
        <Route path="/items" element={<Items token={auth.token} />} />
        <Route path="/cart" element={<Cart token={auth.token} />} />
      </Routes>
    </Router>
  );
}