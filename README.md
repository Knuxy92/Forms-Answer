# Google Form 1-Click Auto Answer

A lightweight automation tool that enables one-click answering for
Google Forms.

The system combines a local Python API server with a browser-injected
JavaScript layer to automate form filling in a controlled environment.

------------------------------------------------------------------------

## Overview

This project consists of two primary components:

-   **Backend (Python API Server)** --- Provides answer logic and local
    HTTP endpoints.
-   **Frontend (Browser Injection Script)** --- Executes inside the
    Google Form page and performs DOM automation.

This repository is intended for automation research, testing workflows,
and controlled internal usage.

------------------------------------------------------------------------

## Architecture

### Backend Layer

-   `Api.py`
-   Runs a local HTTP server
-   Supplies answer data to the browser script
-   Processes logic for answer generation (static, dynamic, or
    rule-based)

### Frontend Layer

-   `Command.js`
-   `oneclick.js`
-   Injected directly into a Google Form page
-   Detects questions
-   Fills answers programmatically
-   Optionally submits the form

------------------------------------------------------------------------

## Repository Structure

    .
    ├── Api.py              # Python backend service
    ├── Command.js          # Browser injection loader
    ├── oneclick.js         # Core one-click automation logic
    ├── requirement.txt     # Python dependencies
    ├── LICENSE
    └── README.md

------------------------------------------------------------------------

# One-Click Mechanism

The one-click system executes the entire answer workflow with a single
user action.

## Execution Flow

1.  `Command.js` is injected into the Google Form page.
2.  It initializes or loads `oneclick.js`.
3.  `oneclick.js` scans the DOM for questions.
4.  Answers are resolved (static, random, or API-driven).
5.  Fields are filled programmatically.
6.  Optional submission is triggered.

------------------------------------------------------------------------

## How `oneclick.js` Works

### 1. DOM Inspection

The script queries form elements such as:

-   `input[type="radio"]`
-   `input[type="checkbox"]`
-   `textarea`
-   `input[type="text"]`

Each question is mapped internally based on detected type and structure.

------------------------------------------------------------------------

### 2. Answer Resolution

Answer sources may include:

-   Hardcoded logic
-   Randomized selection
-   API request to local server

Example pattern:

``` javascript
fetch("http://127.0.0.1:5000/answers")
  .then(res => res.json())
  .then(data => applyAnswers(data));
```

------------------------------------------------------------------------

### 3. Programmatic Interaction

To ensure proper state updates, the script:

-   Sets `.value`
-   Dispatches `input` and `change` events
-   Triggers click events when necessary

Example:

``` javascript
element.click();
element.dispatchEvent(new Event('change', { bubbles: true }));
```

This ensures compatibility with Google Form's internal event handling.

------------------------------------------------------------------------

### 4. Optional Submission

If enabled, the script locates and triggers the submit button:

``` javascript
document.querySelector('[role="button"]').click();
```

Review before enabling auto-submission.

------------------------------------------------------------------------

## Installation

### Clone Repository

``` bash
git clone https://github.com/Knuxy92/Forms-Answer.git
cd Forms-Answer
```

### Install Dependencies

``` bash
pip install -r requirement.txt
```

------------------------------------------------------------------------

## Running the Backend Server

``` bash
python Api.py
```

The API server will start locally (commonly `127.0.0.1:5000`).

------------------------------------------------------------------------

## Injecting the Automation Script

1.  Open the target Google Form.
2.  Open Developer Tools (`F12`).
3.  Go to the **Console** tab.
4.  Copy the contents of `Command.js`.
5.  Paste into the console and press Enter.
6.  The one-click automation interface initializes.

------------------------------------------------------------------------

## Limitations

-   Does not bypass authentication or Google security.
-   Fully dependent on current Google Form DOM structure.
-   Google may update form internals at any time.
-   Intended for controlled or authorized environments only.

------------------------------------------------------------------------

## License

MIT License
