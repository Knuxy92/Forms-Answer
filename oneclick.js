const CONFIG = {
  debug: false,
  autorefresh: false,
  model: "gemini-2.5-flash",
  apiKey: "YOUR_API_KEY_HERE",
  systemPrompt: `You are an expert assistant. 
1. Reply in JSON format only.
2. Format: {"1": "Answer for Q1", "2": "Answer for Q2"}
3. For text answers, provide direct, concise, and professional text.
4. For multiple choice, use "A|B" format.
5. Constraint: Keep all text answers extremely short (under 200 characters). Provide only the essential information. No conversational filler, no introductions, no explanations. Just the direct answer.`,
  selectors: {
    questionBlock: ".geS5n",
    questionTitle: 'div[role="heading"] span',
    choiceOption: "span.aDTYNe",
    radioCheckbox: '[role="radio"], [role="checkbox"]',
    textArea: "textarea",
  },
};

const Logger = {
  log: (text, status = "info") =>
    CONFIG.debug && console.log(`[${status.toUpperCase()}] ${text}`),
  success: (text) => Logger.log(text, "success"),
  warning: (text) => Logger.log(text, "warning"),
  error: (text) => Logger.log(text, "error"),
};

const normalize = (value) => String(value).trim().replace(/\s+/g, " ");

class QuestionScraper {
  scrapeAll() {
    return Array.from(
      document.querySelectorAll(CONFIG.selectors.questionBlock)
    ).map((block, index) => ({
      no: index + 1,
      question: block.querySelector(CONFIG.selectors.questionTitle)?.innerText ?? "",
      choices: Array.from(
        block.querySelectorAll(CONFIG.selectors.choiceOption)
      ).map((el) => el.innerText.trim()),
    }));
  }
}

class AIClient {
  async getAnswers(questions) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${CONFIG.model}:generateContent?key=${CONFIG.apiKey}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: CONFIG.systemPrompt }] },
        contents: [{ parts: [{ text: JSON.stringify(questions) }] }],
        generationConfig: { temperature: 0.1, response_mime_type: "application/json" },
      }),
    });

    if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);

    const data = await res.json();
    return JSON.parse(data.candidates[0].content.parts[0].text);
  }
}

class AnswerSelector {
  selectAnswer(questionNo, answerText) {
    const block = document.querySelectorAll(CONFIG.selectors.questionBlock)[questionNo - 1];
    if (!block) return;

    const textArea = block.querySelector(CONFIG.selectors.textArea);
    if (textArea) {
      textArea.value = answerText;
      ["input", "change"].forEach((e) =>
        textArea.dispatchEvent(new Event(e, { bubbles: true }))
      );
      Logger.success(`Filled textarea ${questionNo}: ${answerText}`);
      return;
    }

    for (const option of block.querySelectorAll(CONFIG.selectors.radioCheckbox)) {
      const label = option.getAttribute("aria-label") ?? option.innerText;
      if (normalize(label) === normalize(answerText)) {
        option.click();
        Logger.success(`Clicked ${questionNo}: ${answerText}`);
        return;
      }
    }
  }
}

(async () => {
  try {
    const questions = new QuestionScraper().scrapeAll();
    Logger.log(`Found ${questions.length} questions. Requesting AI...`);

    const answers = await new AIClient().getAnswers(questions);
    const selector = new AnswerSelector();

    for (const [qNo, ans] of Object.entries(answers)) {
      selector.selectAnswer(parseInt(qNo), ans);
    }

    Logger.success("Done!");
  } catch (e) {
    Logger.error(e.message);
  }
})();
