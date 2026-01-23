# AnswerFlow 🤖📝

**AnswerFlow** is an AI-powered assistant that automatically fills answers in Google Forms using **Google Gemini**. The project consists of two main components:

* **Server**: Python (Flask) — communicates with the Gemini API
* **Browser Script**: JavaScript — runs directly on the Google Form page

> Purpose: educational use and productivity assistance.

---

## Features

* One-click auto answering for Google Forms
* AI-driven question analysis (Gemini)
* Local server architecture (no cloud deployment required)
* Low-temperature configuration for factual, consistent answers

---

## Prerequisites

* **Python 3.8+**
* **Google AI Studio (Gemini) API Key**
* Modern browser (Chrome recommended)

---

## Installation

1. **Clone or download** this repository.
2. **Install dependencies**:

```bash
pip install -r requirement.txt
```

3. **Environment configuration**:

Create a `.env` file in the project root and add:

```env
API_KEY=YOUR_GEMINI_API_KEY
HOST=127.0.0.1
PORT=5000
```

Replace `YOUR_GEMINI_API_KEY` with your actual key.

---

## Getting a Gemini API Key

1. Visit **Google AI Studio**: [https://aistudio.google.com/](https://aistudio.google.com/)
2. Sign in with your Google account.
3. Click **Get API key** (key icon).
4. Select **Create API key**.

   * Either link to an existing Google Cloud project
   * Or create a new project (recommended for simplicity)
5. Copy the generated API key and store it in `.env`.

---

## Usage

### 1. Start the Server

```bash
python Api.py
```

If successful, the server will run at:

```
http://127.0.0.1:5000
```

---

### 2. Inject the Browser Script

1. Open the target **Google Form**.
2. Press **F12** to open Developer Tools.
3. Go to the **Console** tab.
4. Copy all code from `Command.js` and paste it into the console.
5. Press **Enter**.
6. A new button labeled **"AnswerFlow AI Assistant"** will appear.

---

### 3. Auto-Answer the Form

1. Click the **AnswerFlow** button.
2. Press **Start Auto Answer**.
3. The AI will analyze each question and select the most appropriate answer automatically.

---

## Configuration Notes

* `temperature = 0.2` is used to keep answers factual and deterministic.
* The server runs locally; no form data is stored permanently.

---

## Disclaimer

* This project is intended for **educational and productivity purposes only**.
* Always review answers before submitting any form.
* Misuse may violate the terms of service of Google Forms.

---

## Project Name

**AnswerFlow** — One Click AI Answers for Google Forms
