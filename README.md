# 🔐 Local HTTPS Setup (Windows) – MaBCore Portal

This guide explains how to run the MaBCore Portal locally over HTTPS using **mkcert**.

---

## 📦 Prerequisites

* Windows OS
* Administrator access
* Node.js installed
* Chocolatey installed

---

## ⚙️ Installation & Setup

### 1. Install mkcert

Open **Command Prompt / PowerShell as Administrator** and run:

```bash
choco install mkcert
```

---

### 2. Install Local Certificate Authority

```bash
mkcert -install
```

This allows your system and browser to trust locally generated certificates.

---

### 3. Generate SSL Certificates

Navigate to the project root:

```bash
cd path/to/mb-time-management-portal
```

Generate certificates:

```bash
mkcert localhost
```

This creates:

* `localhost.pem`
* `localhost-key.pem`

---

### 4. Verify Project Structure

Ensure your root directory contains:

```
mb-time-management-portal/
├── server.js
├── localhost.pem
├── localhost-key.pem
├── package.json
```

If these files are missing, HTTPS will fail with an `ENOENT` error.

---

### 5. Run the HTTPS Server

```bash
npm run dev:https
```

Open in browser:

```
https://localhost:3000
```

---

## ⚠️ Troubleshooting

| Issue                      | Cause                     | Fix                           |
| -------------------------- | ------------------------- | ----------------------------- |
| `ENOENT` error             | Missing certificate files | Re-run `mkcert localhost`     |
| Browser shows "Not Secure" | CA not installed          | Run `mkcert -install` again   |
| Command fails              | No admin privileges       | Run terminal as Administrator |

---

## 🧪 Optional: Run Without HTTPS

If HTTPS is not required:

```bash
npm run dev
```

Access via:

```
http://localhost:3000
```

---

## 📌 Important Clarification

* `mkcert` is **only for local development**
* It is **NOT used in production deployments**

Production environments should use:

* Valid SSL certificates (e.g., from hosting providers or certificate authorities)

---

## 🛠 Recommended Scripts

Add this to `package.json`:

```json
"scripts": {
  "dev": "next dev",
  "dev:https": "node server.js"
}
```

---

## ✅ Summary

* Install mkcert
* Generate local certificates
* Run HTTPS server

This ensures compatibility with secure APIs and mirrors production-like conditions locally.



--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


### 🔐 Local HTTPS Setup with Tailscale – MaBCore Portal

This guide explains how to securely access your local development server over HTTPS using **Tailscale**.

---

## 📦 Prerequisites

* Node.js installed
* Tailscale installed and logged in
* Device connected to your Tailscale network (tailnet)

---

## 🧠 Overview

Tailscale provides:

* A **private domain** (`*.ts.net`)
* **Trusted HTTPS certificates**
* Secure access across devices (laptop, phone, teammates)

---

## ⚙️ Setup Instructions

### 1. Start Tailscale

```bash
tailscale up
```

Verify your device:

```bash
tailscale status
```

---

### 2. Get Your Tailscale Domain

Run:

```bash
tailscale status --json
```

Look for your device hostname, e.g.:

```
your-device-name.tailnet-name.ts.net
```

---

## 🚀 Option A (Recommended): Use Tailscale Serve

This is the simplest and most reliable method.

### Start your app locally

```bash
npm run dev
```

### Expose it securely via Tailscale

```bash
tailscale serve https / http://localhost:3000
```

### Access your app

```
https://your-device-name.tailnet-name.ts.net
```

✅ HTTPS is automatically handled
✅ No certificate files needed
✅ Works across all your devices

---

## ⚙️ Option B: Manual HTTPS with Certificates

Use this if you need full control over your HTTPS server.

---

### 1. Generate Certificates

```bash
tailscale cert your-device-name.tailnet-name.ts.net
```

This creates:

* `your-device-name.tailnet-name.ts.net.crt`
* `your-device-name.tailnet-name.ts.net.key`

---

### 2. Update Your Server

Example using Node.js:

```js
import https from "https";
import fs from "fs";
import app from "./app";

const options = {
  key: fs.readFileSync("your-device-name.tailnet-name.ts.net.key"),
  cert: fs.readFileSync("your-device-name.tailnet-name.ts.net.crt"),
};

https.createServer(options, app).listen(3000, "0.0.0.0", () => {
  console.log("HTTPS server running via Tailscale");
});
```

---

### 3. Access the App

```
https://your-device-name.tailnet-name.ts.net:3000
```

---

## ⚠️ Common Issues

| Problem                           | Cause                     | Fix                            |
| --------------------------------- | ------------------------- | ------------------------------ |
| Cannot access from another device | Server bound to localhost | Use `0.0.0.0`                  |
| HTTPS not working                 | Wrong domain              | Re-check `tailscale status`    |
| Connection blocked                | Firewall issue            | Allow Node.js through firewall |
| Cert command fails                | Not logged into Tailscale | Run `tailscale up`             |

---

## ❗ Important Notes

* Do **NOT** use mkcert with Tailscale
* Tailscale already provides trusted HTTPS certificates
* Certificates are valid only within your Tailscale network

---

## 🛠 Recommended Scripts

```json
"scripts": {
  "dev": "next dev",
  "dev:ts": "tailscale serve https / http://localhost:3000"
}
```

---

## 🎯 Summary

* Start Tailscale
* Run your app locally
* Use `tailscale serve` for HTTPS access

This setup gives you secure, cross-device access without managing SSL manually.














This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

--