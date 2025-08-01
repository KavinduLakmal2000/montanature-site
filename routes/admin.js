const express = require("express");
const router = express.Router();
const AdminAccess = require("../models/AdminAccess");

router.get("/admin-access", async (req, res) => {
  try {
    const doc = await AdminAccess.findOne({});
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json({ value: doc.value });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
