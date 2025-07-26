const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const Footer = require('./models/Footer');
const ActivityCard = require('./models/activity_cards');
const PageHeading = require("./models/homeHead");
const ActivityHead = require("./models/ActivityHead");
const NatureHead = require("./models/NatureHead");
const LabelHead = require("./models/LabelHead");
const NatureCard = require("./models/NatureCard");
const LabelCard = require("./models/LabelCard");
const ContactInfo = require("./models/ContactInfo");

const app = express();
const PORT = 3000;

// MongoDB connection
mongoose.connect('mongodb+srv://montanature:1234@clustermonta.yhnismd.mongodb.net/montanature', {
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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
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
      res.json({ success: true }); // ✅ Send JSON response
    } else {
      res.json({ success: false, message: 'E-mail ou mot de passe invalide' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
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

//--------------------------------------------------------------------- home head update -----------------------------------------------------------------

// GET
app.get("/api/heading", async (req, res) => {
  try {
    const data = await PageHeading.findOne();
    res.json(data);
  } catch (err) {
    console.error("Error fetching heading:", err);
    res.status(500).json({ error: "Failed to fetch heading" });
  }
});

// PUT
app.put("/api/heading", async (req, res) => {
  try {
    const { mainHeading, description, statsNumber, statsLabel } = req.body;
    let data = await PageHeading.findOne();
    if (!data) {
      data = new PageHeading({ mainHeading, description, statsNumber, statsLabel });
    } else {
      data.mainHeading = mainHeading;
      data.description = description;
      data.statsNumber = statsNumber;
      data.statsLabel = statsLabel;
    }
    await data.save();
    res.json({ success: true, data });
  } catch (err) {
    console.error("Error updating heading:", err);
    res.status(500).json({ error: "Failed to update heading" });
  }
});

// ------------------------------------------------------------------ activity head update ------------------------------------------------------------

// GET activity heading
app.get("/api/activity-heading", async (req, res) => {
  try {
    const data = await ActivityHead.findOne();
    res.json(data);
  } catch (err) {
    console.error("Error fetching activity heading:", err);
    res.status(500).json({ error: "Failed to fetch activity heading" });
  }
});

// PUT (update or insert) activity heading
app.put("/api/activity-heading", async (req, res) => {
  try {
    const { mainHeading, description } = req.body;
    let data = await ActivityHead.findOne();
    if (!data) {
      data = new ActivityHead({ mainHeading, description });
    } else {
      data.mainHeading = mainHeading;
      data.description = description;
    }
    await data.save();
    res.json({ success: true, data });
  } catch (err) {
    console.error("Error updating activity heading:", err);
    res.status(500).json({ error: "Failed to update activity heading" });
  }
});

// -------------------------------------------------------------------- neture head edit ---------------------------------------------------------------

// GET nature heading
app.get("/api/nature-heading", async (req, res) => {
  try {
    const data = await NatureHead.findOne();
    res.json(data);
  } catch (err) {
    console.error("Error fetching nature heading:", err);
    res.status(500).json({ error: "Failed to fetch nature heading" });
  }
});

// PUT (update or insert) nature heading
app.put("/api/nature-heading", async (req, res) => {
  try {
    const { mainHeading, description } = req.body;
    let data = await NatureHead.findOne();
    if (!data) {
      data = new NatureHead({ mainHeading, description });
    } else {
      data.mainHeading = mainHeading;
      data.description = description;
    }
    await data.save();
    res.json({ success: true, data });
  } catch (err) {
    console.error("Error updating nature heading:", err);
    res.status(500).json({ error: "Failed to update nature heading" });
  }
});

// -------------------------------------------------------------------- label head edit ----------------------------------------------------------------

// GET label heading
app.get("/api/label-heading", async (req, res) => {
  try {
    const data = await LabelHead.findOne();
    res.json(data);
  } catch (err) {
    console.error("Error fetching label heading:", err);
    res.status(500).json({ error: "Failed to fetch label heading" });
  }
});

// PUT (update or insert) label heading
app.put("/api/label-heading", async (req, res) => {
  try {
    const { mainHeading, description } = req.body;
    let data = await LabelHead.findOne();

    if (!data) {
      data = new LabelHead({ mainHeading, description });
    } else {
      data.mainHeading = mainHeading;
      data.description = description;
    }

    await data.save();
    res.json({ success: true, data });
  } catch (err) {
    console.error("Error updating label heading:", err);
    res.status(500).json({ error: "Failed to update label heading" });
  }
});


// ---------------------------------------------------------------- activity cards section -------------------------------------------------------------------------
//create
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

// find
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

// ------------------------------------------------------------------ nature card section---------------------------------------------------------------------
// CREATE
app.post('/api/nature-cards', async (req, res) => {
  try {
    const newCard = new NatureCard(req.body);
    const saved = await newCard.save();
    res.status(201).json({ success: true, card: saved });
  } catch (err) {
    console.error("Nature card save error:", err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// READ
app.get('/api/nature-cards', async (req, res) => {
  try {
    const cards = await NatureCard.find();
    res.json(cards);
  } catch (err) {
    console.error("Nature cards fetch error:", err);
    res.status(500).json({ success: false });
  }
});

// PUT /api/nature-cards/:id
app.put('/api/nature-cards/:id', async (req, res) => {
  try {
    const updated = await NatureCard.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Card not found" });
    res.json({ success: true, card: updated });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// DELETE /api/nature-cards/:id
app.delete('/api/nature-cards/:id', async (req, res) => {
  try {
    const deletedCard = await NatureCard.findByIdAndDelete(req.params.id);
    if (!deletedCard) {
      return res.status(404).json({ success: false, message: "Card not found" });
    }
    res.json({ success: true, message: "Card deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

//--------------------------------------------------------------------------------------- Label Card section ---------------------------------------------------


// POST /api/labels - Add new label card
app.post("/api/labels", async (req, res) => {
  try {
    const { stepNumber, icon, heading, description, link } = req.body;

    // Basic validation
    if (!stepNumber || !icon || !heading || !description || !link) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newCard = new LabelCard({ stepNumber, icon, heading, description, link });
    const savedCard = await newCard.save();

    res.status(201).json(savedCard);
  } catch (error) {
    console.error("Error saving label card:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// load all cards

app.get("/api/labels", async (req, res) => {
  try {
    const cards = await LabelCard.find();
    res.json(cards);
  } catch (err) {
    console.error("Error fetching label cards:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// PUT /api/labels/:id
app.put('/api/labels/:id', async (req, res) => {
  try {
    const updated = await LabelCard.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Card not found" });
    res.json({ success: true, card: updated });
  } catch (err) {
    console.error("Update error (label):", err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});


// delete 
app.delete("/api/labels/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await LabelCard.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Carte introuvable" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Erreur lors de la suppression :", err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

//---------------------------------------------------------------------------- contact edit -----------------------------------------------

app.put("/api/contact-info", async (req, res) => {
  try {
    const { address, emails, hours, receiveEmail, locationLink } = req.body;

    let data = await ContactInfo.findOne();

    if (!data) {
      data = new ContactInfo({ address, emails, hours, receiveEmail, locationLink });
    } else {
      data.address = address;
      data.emails = emails;
      data.hours = hours;
      data.receiveEmail = receiveEmail;
      data.locationLink = locationLink;
    }

    await data.save();
    res.json({ success: true, data });
  } catch (err) {
    console.error("Error updating contact info:", err);
    res.status(500).json({ error: "Failed to update contact info" });
  }
});

// GET contact info
app.get("/api/contact-info", async (req, res) => {
  try {
    const data = await ContactInfo.findOne();
    res.json(data);
  } catch (err) {
    console.error("Error fetching contact info:", err);
    res.status(500).json({ error: "Failed to fetch contact info" });
  }
});






// TODO: Add routes for CRUD and login

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
