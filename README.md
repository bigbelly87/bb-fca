# bb-fca

**bb-fca** is a Facebook Chat API (FCA) library for automating Facebook Messenger bots. Built for **reliable**, **real-time**, and **modular** interaction with Facebook Messenger.

Based on [ws3-fca](https://github.com/NethWs3Dev/ws3-fca).

---

## Features

* **Login Mechanism** – Dynamically scrapes Facebook's login form and submits tokens for secure authentication.
* **Real-time Messaging** – Send and receive messages (text, attachments, stickers, replies).
* **Message Editing** – Edit your bot's messages in-place.
* **Typing Indicators** – Detect and send typing status.
* **Message Status Handling** – Mark messages as delivered, read, or seen.
* **Thread Management** – Retrieve thread details, load history, get lists with filtering, pin/unpin messages.
* **User Info Retrieval** – Access name, ID, profile picture, and mutual context.
* **Sticker API** – Search stickers, list packs, fetch store data, AI-stickers.
* **Post Interaction** – Comment and reply to public Facebook posts.
* **Follow/Unfollow Users** – Automate social interactions.
* **Proxy Support** – Full support for custom proxies.
* **Modular Architecture** – Organized into pluggable models for maintainability.
* **Robust Error Handling** – Retry logic, consistent logging, and graceful failovers.

---

## Installation

> Requires **Node.js v22+**

```bash
npm i bb-fca
```

---

## Getting Started

### 1. Generate `appstate.json`

This file contains your Facebook session cookies. Use a browser extension (e.g. "C3C FbState", "CookieEditor") to export cookies after logging in, and save them in this format:

```json
[
  {
    "key": "c_user",
    "value": "your-id"
  }
]
```

Place this file in the root directory as `appstate.json`.

---

### 2. Basic Usage Example

```js
const fs = require("fs");
const path = require("path");
const { login } = require("bb-fca");

let credentials;
try {
  credentials = { appState: JSON.parse(fs.readFileSync("appstate.json", "utf8")) };
} catch (err) {
  console.error("appstate.json is missing or malformed.", err);
  process.exit(1);
}

console.log("Logging in...");

login(credentials, {
  online: true,
  updatePresence: true,
  selfListen: false,
  randomUserAgent: false
}, async (err, api) => {
  if (err) return console.error("LOGIN ERROR:", err);

  console.log(`Logged in as: ${api.getCurrentUserID()}`);

  api.listenMqtt(async (err, event) => {
    if (err || !event.body || event.type !== "message") return;

    const prefix = "/";
    if (!event.body.startsWith(prefix)) return;

    const args = event.body.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // Handle your commands here
    console.log(`Command: ${commandName}, Args: ${args.join(", ")}`);
  });
});
```

---

## Credits

* Based on **ws3-fca** by [@NethWs3Dev](https://github.com/NethWs3Dev) & Exocore Community.

---

## License

**MIT** – Free to use, modify, and distribute.
