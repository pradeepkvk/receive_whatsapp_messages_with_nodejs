const express = require("express");
const axios = require("axios");

const WHATSAPP_ACCESS_TOKEN = "YOUR_TOKEN_HERE";
const WEBHOOK_VERIFY_TOKEN = "api_verify_token";

const app = express();
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("WhatsApp Webhook is Live");
});

// Webhook verification
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === WEBHOOK_VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
});

// Webhook POST listener
app.post("/webhook", (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const messages = changes?.value?.messages?.[0];

    if (messages && messages.text?.body) {
      console.log("📩 Message Received:", messages.text.body);
    }

    // Always respond with 200 OK
    res.sendStatus(200);
  } catch (error) {
    console.error("❌ Error in webhook handler:", error.message);
    res.sendStatus(500);
  }
});

app.listen(3000, () => {
  console.log("🚀 Server started on port 3000");
});
