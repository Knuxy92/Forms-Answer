const CONFIG = {
  debug: false,
  autorefresh: false,
  model: "gemini-3.5-flash",
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
      document.querySelectorAll(CONFIG.selectors.questionBlock),
    ).map((block, index) => ({
      no: index + 1,
      question:
        block.querySelector(CONFIG.selectors.questionTitle)?.innerText ?? "",
      choices: Array.from(
        block.querySelectorAll(CONFIG.selectors.choiceOption),
      ).map((el) => el.innerText.trim()),
    }));
  }
}

class AIClient {
  async getAnswers(questions) {
    Logger.info("Send AI...");

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${CONFIG.model}:generateContent?key=${CONFIG.apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.buildRequestPayload(questions)),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(`API Error: ${data.error.message}`);
    }

    let rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      throw new Error("Not Receive AI");
    }

    rawText = rawText
      .replace(/```json\s*/g, "")
      .replace(/```\s*/g, "")
      .trim();
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error(`Invalid JSON output: ${rawText}`);
    }

    Logger.success("Receive AI");
    return JSON.parse(jsonMatch[0]);
  }

  buildRequestPayload(questions) {
    return {
      system_instruction: {
        parts: [{ text: CONFIG.systemPrompt }],
      },
      contents: [
        {
          parts: [
            {
              text: `จงตอบคำถามเหล่านี้ในรูปแบบ JSON object: ${JSON.stringify(questions)}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.1,
        response_mime_type: "application/json",
      },
    };
  }
}

class AnswerSelector {
  selectAnswer(questionNo, answerText) {
    const block = this.getQuestionBlock(questionNo);
    if (!block) {
      Logger.warning(`Not Found ${questionNo}`);
      this.tracker.incrementFail();
      return;
    }

    const textArea = block.querySelector(CONFIG.selectors.textArea);
    if (textArea) {
      textArea.value = answerText;
      ["input", "change"].forEach((e) =>
        textArea.dispatchEvent(new Event(e, { bubbles: true })),
      );

      Logger.success(`Filled textarea ${questionNo}: ${answerText}`);
      return;
    }

    const options = block.querySelectorAll(CONFIG.selectors.radioCheckbox);
    const targetAnswers = String(answerText)
      .split("|")
      .map((ans) => TextUtils.normalize(ans));

    let isAnySelected = false;

    for (const targetText of targetAnswers) {
      const selected = this.findAndClickOption(options, targetText, questionNo);
      if (selected) isAnySelected = true;
    }

    if (isAnySelected) {
      this.tracker.incrementSuccess();
    } else {
      this.tracker.incrementFail();
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
