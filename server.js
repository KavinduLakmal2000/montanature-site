const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const Footer = require('./models/Footer');
const ActivityCard = require('./models/activity_cards');

const app = express();
const PORT = 3000;

// MongoDB connection
mongoose.connect('mongodb+srv://montanature:1234@clustermonta.yhnismd.mongodb.net/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB error", err));

const AdminSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const Admin = mongoose.model('Admin', AdminSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Session middleware
app.use(session({
  secret: 'mySuperSecretKey',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: 'mongodb+srv://montanature:1234@clustermonta.yhnismd.mongodb.net/',
    collectionName: 'sessions'
  }),
  cookie: { maxAge: 1000 * 60 * 60 } // 1 hour
}));

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/login.html'));
});

// ----------------------------------------------------------------------------------------- login section ---------------------------------------------------------

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email, password });

    if (admin) {
      req.session.isAuthenticated = true;
      res.redirect('/admin_home.html'); // redirect after login
    } else {
      res.send('<h2>Login failed. Invalid credentials. <a href="/login.html">Try again</a></h2>');
    }
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Middleware to protect admin-only pages
function isAuthenticated(req, res, next) {
  if (req.session.isAuthenticated) {
    return next();
  } else {
    res.redirect('/login.html');
  }
}

// Example of protected page (optional)
app.get('/admin-only-page', isAuthenticated, (req, res) => {
  res.send('<h1>Admin Only Content</h1>');
});

// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/index.html');
});

// ------------------------------------------------------------------- footer data save ---------------------------------------------------------------

app.post('/api/save-footer', async (req, res) => {
  try {
    const footerData = req.body;

    // Save or update the footer data (you can do upsert for one-document-only collection)
    const updated = await Footer.findOneAndUpdate({}, footerData, { upsert: true, new: true });

    res.status(200).json({ message: 'Footer data saved successfully', data: updated });
  } catch (err) {
    console.error('Error saving footer:', err);
    res.status(500).json({ error: 'Failed to save footer data' });
  }
});

// ------------------------------------------------------------------ read footer data -------------------------------------------------------------------

app.get('/api/get-footer', async (req, res) => {
  try {
    const data = await Footer.findOne({});
    res.json(data || {});
  } catch (err) {
    console.error('Error fetching footer:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ---------------------------------------------------------------- activity section -------------------------------------------------------------------------

app.post('/api/cards', async (req, res) => {
  try {
    const newCard = new ActivityCard(req.body);
    const savedCard = await newCard.save();
    res.status(201).json({ success: true, card: savedCard });
  } catch (err) {
    console.error('Error saving card:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});


app.get('/api/cards', async (req, res) => {
  try {
    const cards = await ActivityCard.find();
    res.json(cards);
  } catch (err) {
    console.error('Error fetching activity cards:', err);
    res.status(500).json({ error: 'Failed to load activity cards' });
  }
});

// delete

app.delete('/api/cards/:id', async (req, res) => {
  try {
    await ActivityCard.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting card:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// edit

app.put('/api/cards/:id', async (req, res) => {
  try {
    const updatedCard = await ActivityCard.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ success: true, card: updatedCard });
  } catch (err) {
    console.error("Error updating card:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});



// TODO: Add routes for CRUD and login

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
