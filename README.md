# Google Form 1-Click Auto Answer

> [!NOTE]
> Requires a Google Form to be open in your browser before injecting the script.

---

## Credit

Developed by: **Knuxy92**  
Last updated: `06/04/26`

---

## How It Works

The script scrapes all questions and choices directly from the DOM,
sends them to **Gemini AI**, then automatically selects the correct answers — all in one click.

No backend server required.

---

## How to Use

1. Open the target **Google Form**
2. Press `Ctrl` + `Shift` + `I` to open **DevTools**
3. Navigate to the **Console** tab
4. Paste the code from `oneclick.js` and hit Enter

---

## Configuration

Edit the `CONFIG` block at the top of `Script.js` before running:

| Key | Description | Default |
|-----|-------------|---------|
| `apiKey` | Your Gemini API key | `""` |
| `model` | Gemini model to use | `gemini-2.5-flash` |
| `debug` | Show logs in console | `true` |
| `autorefresh` | Auto-reload page after completion | `true` |

---

## Supported Question Types

| Type | Status |
|------|--------|
| Multiple Choice (radio) | ✅ |
| Checkboxes | ✅ |
| Dropdown | ⚠️ Partial |
| Short Answer / Paragraph | ✅ |

---

## Limitations

- Depends on current Google Form DOM structure — may break if Google updates their UI
- Accuracy depends on Gemini's response quality
- Not intended to bypass authentication or Google security

---

## License

MIT License

Copyright (c) 2026 Lightnine

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
