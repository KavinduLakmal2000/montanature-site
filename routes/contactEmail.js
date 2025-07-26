const express = require("express");
const nodemailer = require("nodemailer");
const ContactInfo = require("../models/ContactInfo"); // 👈 required to fetch DB email

const router = express.Router();

router.post("/send-contact-email", async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        // Get receiver email from DB
        const contactInfo = await ContactInfo.findOne({});
        const receiveEmail = contactInfo?.receiveEmail;
        const sendMail = contactInfo?.emails;


        if (!receiveEmail) {
            return res.status(500).json({ error: "Receiver email not found in DB." });
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: sendMail,     // ✅ your gmail here
                pass: "your_app_password",        // 🔐 app password or other SMTP pass
            },
        });

        const mailOptions = {
            from: sendMail,
            to: receiveEmail, // send to receiver from DB
            subject: `📩 ${subject}`,
            html: `
                <h3>New contact form message from ${name}</h3>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong><br>${message}</p>
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ success: true, message: "Email sent" });
    } catch (error) {
        console.error("Email send failed:", error);
        res.status(500).json({ error: "Failed to send email." });
    }
});

module.exports = router;
