# Using ngrok to Expose a Local Server


## The Simplest Way to Use ngrok

### 1. Start Your Local Server First

Before using ngrok, make sure your local application is already running.

Example for Spring Boot:

```bash
mvn spring-boot:run
```

Now open your browser and check that this works:

```text
http://localhost:8087
```

If this does not work, ngrok will not work either.

Do not start ngrok until your local app works first.

---

### 2. Install ngrok

Go to the ngrok website and download ngrok for Windows:

```text
https://ngrok.com/download
```

Download the Windows version.

After downloading, extract it to:

```text
C:\ngrok\
```

You should now have this file:

```text
C:\ngrok\ngrok.exe
```

---

### 3. Connect ngrok to Your Account

Create an ngrok account.

After logging in, copy your ngrok auth token from your dashboard.

Then open Command Prompt and run:

```bash
ngrok config add-authtoken YOUR_TOKEN_HERE
```

Example:

```bash
ngrok config add-authtoken 2abc123xyz
```

You only need to do this one time.

---

### 4. Expose Your Local App

For a Spring Boot app running on port `8087`, run:

```bash
ngrok http 8087
```

ngrok will show something like this:

```text
Forwarding https://abc123.ngrok-free.app -> http://localhost:8087
```

Use this public URL:

```text
https://abc123.ngrok-free.app
```

This URL can now be opened from:

```text
Mobile phone
Another laptop
Tablet
Client machine
```

---

## Example Full Flow

Start your Spring Boot application:

```bash
mvn spring-boot:run
```

Confirm it works locally:

```text
http://localhost:8087
```

Then start ngrok:

```bash
ngrok http 8087
```

Copy the public HTTPS URL from ngrok:

```text
https://abc123.ngrok-free.app
```

Open that URL on your phone or another device.

---

## Important Notes

### Your app must run first

ngrok does not start your Spring Boot app.

You must start the app yourself first.

Wrong order:

```text
Start ngrok first
Start Spring Boot later
```

Correct order:

```text
Start Spring Boot first
Start ngrok second
```

---

### Use the correct port

If your app runs on:

```text
http://localhost:8087
```

Then run:

```bash
ngrok http 8087
```

If your app runs on:

```text
http://localhost:3000
```

Then run:

```bash
ngrok http 3000
```

The port number must match your local application.

---

### Free ngrok URLs can change

On the free ngrok plan, the public URL may change every time you restart ngrok.

Example:

```text
Today:
https://abc123.ngrok-free.app

After restart:
https://xyz789.ngrok-free.app
```

For testing, free ngrok is fine.

For production or real users, use a proper deployment or a paid/static ngrok domain.

---

## Useful ngrok Commands

Expose a local Spring Boot app on port `8087`:

```bash
ngrok http 8087
```

Expose a local Node.js or Next.js app on port `3000`:

```bash
ngrok http 3000
```

Add basic username and password protection:

```bash
ngrok http 8087 --basic-auth="user:password"
```

Open the ngrok request inspector:

```text
http://127.0.0.1:4040
```

This lets you inspect requests, headers, and API calls.

---

## Final Summary

To use ngrok:

1. Start your local server.
2. Check that `localhost` works.
3. Install ngrok.
4. Add your ngrok auth token.
5. Run ngrok with the correct port.
6. Copy the public HTTPS URL.
7. Open the URL from another device.

Main command:

```bash
ngrok http 8087
```

Main idea:

```text
ngrok public URL -> your local server
```