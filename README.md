# 🚀 Secure File Uploader (Bun & Uppy)

A premium, high-performance file uploader built with **Bun** and the **Uppy** framework. Features a "Noir" inspired dark UI, real-time progress animations, and automatic post-upload security scanning.

## ✨ Features

- **Blazing Fast**: Powered by Bun's native server and file APIs.
- **Dynamic UI**: Real-time upload progress with the Uppy Dashboard.
- **Security First**: 
  - Automated post-upload scanning.
  - Verification of allowed file types: `JPG`, `PNG`, `DOC`, `DOCX`, `RTF`, `PDF`.
  - Individual file limit: **10 MB**.
  - Bulk upload limit: **500 MB**.
- **Minimalist Design**: Sleek dark theme with custom toast notifications.

## 🛠️ Quick Start

### 1. Prerequisites
Ensure you have [Bun](https://bun.sh/) installed.

### 2. Install Dependencies
```bash
bun install
```

### 3. Run the Server
```bash
bun run server.js
```
The application will be live at **http://localhost:3000**.

## 📁 Project Structure

- `server.js`: The backend handling uploads, validation, and scanning.
- `public/`: Frontend assets (HTML, CSS, JS).
- `uploads/`: Protected directory where safe files are stored.
- `prompt.md`: The core requirements used to build this application.

## 🛡️ Security Logic

The server performs a post-upload scan on every file. If a threat is detected:
1. The file is **immediately deleted** from the server.
2. The user is notified via a high-visibility security alert.
3. No information about the specific scanner used is revealed to the client.

## 📄 License
MIT
