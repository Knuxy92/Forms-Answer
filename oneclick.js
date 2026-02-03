const CONFIG = {
    debug: false,
    autorefresh: true,
    model: 'gemini-2.5-flash',
    apiKey: '',
    systemPrompt: `คุณคือผู้เชี่ยวชาญด้าน IT และ คณิตศาสตร์ และ ด้านภาษา

กฎการตอบ:
1. ตอบในรูปแบบ JSON เท่านั้น (Single Flat Object)
2. รูปแบบคือ {"ข้อที่": "คำตอบ"} เช่น {"1":"ถูก", "2":"ผิด"}
3. คำตอบต้องเลือกจากตัวเลือกที่โจทย์มีให้เท่านั้น (ตรงกันทุกตัวอักษร)
4. หากไม่มีข้อมูลในความรู้ที่ให้ไป ให้ใช้ความรู้พื้นฐานของคุณตอบ`,
    
    selectors: {
        questionBlock: '.geS5n',
        questionTitle: 'div[role="heading"] span',
        choiceOption: 'span.aDTYNe',
        radioCheckbox: '[role="radio"], [role="checkbox"]'
    },
    
};

const Logger = {
    log(text, status = 'info') {
        if (!CONFIG.debug) return;
                
        console.log(
            `[${status.toUpperCase()}]      ${text}`,
            `font-weight: ${status === 'error' ? 'bold' : 'normal'}`
        );
    },
    
    success(text) { this.log(text, 'success'); },
    error(text) { this.log(text, 'error'); },
    warning(text) { this.log(text, 'warning'); },
    info(text) { this.log(text, 'info'); }
};

const TextUtils = {
    normalize(value) {
        if (value == null) return '';
        return String(value).trim().replace(/\s+/g, ' ');
    },
    
    extractNumber(text) {
        const match = text.match(/\d+/);
        return match ? parseInt(match[0]) : null;
    }
};

class ProgressTracker {
    constructor(total) {
        this.total = total;
        this.success = 0;
        this.fail = 0;
        this.startTime = performance.now();
    }
    
    incrementSuccess() {
        this.success++;
        this.update();
    }
    
    incrementFail() {
        this.fail++;
        this.update();
    }
    
    update() {
        const processed = this.success + this.fail;
        const progress = Math.round((processed / this.total) * 100);
        const successRate = Math.round((this.success / this.total) * 100);
        
        this.updateElement('af-progress-bar', el => el.style.width = `${progress}%`);
        this.updateElement('af-progress-text', el => el.textContent = `${processed}/${this.total}`);
        this.updateElement('af-rate', el => el.textContent = `${successRate}%`);
    }
    
    updateElement(id, callback) {
        const element = document.getElementById(id);
        if (element) callback(element);
    }
    
    getDuration() {
        return ((performance.now() - this.startTime) / 1000).toFixed(2);
    }
    
    getSummary() {
        return {
            total: this.total,
            success: this.success,
            fail: this.fail,
            duration: this.getDuration(),
            successRate: `${Math.round((this.success / this.total) * 100)}%`
        };
    }
}

class QuestionScraper {
    scrapeAll() {
        const blocks = document.querySelectorAll(CONFIG.selectors.questionBlock);
        Logger.info(`พบคำถามทั้งหมด ${blocks.length} ข้อ`);
        
        return Array.from(blocks).map((block, index) => this.scrapeQuestion(block, index + 1));
    }
    
    scrapeQuestion(block, questionNumber) {
        const titleElement = block.querySelector(CONFIG.selectors.questionTitle);
        const choiceElements = block.querySelectorAll(CONFIG.selectors.choiceOption);
        
        return {
            no: questionNumber,
            question: titleElement ? TextUtils.normalize(titleElement.innerText) : null,
            choices: Array.from(choiceElements)
                .map(el => el.innerText.trim())
                .filter(Boolean)
        };
    }
}

class AnswerSelector {
    constructor(tracker) {
        this.tracker = tracker;
    }
    
    selectAnswer(questionNo, answerText) {
        const block = this.getQuestionBlock(questionNo);
        if (!block) {
            Logger.warning(`ไม่พบคำถามข้อที่ ${questionNo}`);
            this.tracker.incrementFail();
            return;
        }
        
        const options = block.querySelectorAll(CONFIG.selectors.radioCheckbox);
        const normalizedAnswer = TextUtils.normalize(answerText);
        
        const selected = this.findAndClickOption(options, normalizedAnswer, questionNo);
        
        if (selected) {
            this.tracker.incrementSuccess();
        } else {
            this.tracker.incrementFail();
        }
    }
    
    getQuestionBlock(questionNo) {
        const blocks = document.querySelectorAll(CONFIG.selectors.questionBlock);
        return blocks[questionNo - 1];
    }
    
    findAndClickOption(options, targetText, questionNo) {
        for (const option of options) {
            const optionText = this.getOptionText(option);
            
            if (TextUtils.normalize(optionText) === targetText) {
                option.click();
                Logger.success(`${questionNo}: ${targetText}`);
                return true;
            }
        }
        
        Logger.warning(` ${questionNo}: Not Found "${targetText}"`);
        return false;
    }
    
    getOptionText(option) {
        return option.getAttribute('aria-label')?.trim() ||
               option.innerText?.trim() ||
               option.querySelector('span')?.innerText?.trim() ||
               '';
    }
}

class AIClient {
    async getAnswers(questions) {
        Logger.info('📤 กำลังส่งคำถามไปยัง AI...');
        
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${CONFIG.model}:generateContent?key=${CONFIG.apiKey}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.buildRequestPayload(questions))
        });
        
        const data = await response.json();
        
        if (data.error) {
            throw new Error(`API Error: ${data.error.message}`);
        }
        
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!rawText) {
            throw new Error('ไม่ได้รับคำตอบจาก AI');
        }
        
        Logger.success('📥 ได้รับคำตอบจาก AI แล้ว');
        return JSON.parse(rawText);
    }
    
    buildRequestPayload(questions) {
        return {
            system_instruction: {
                parts: [{ text: CONFIG.systemPrompt }]
            },
            contents: [{
                parts: [{
                    text: `จงตอบคำถามเหล่านี้ในรูปแบบ JSON object: ${JSON.stringify(questions)}`
                }]
            }],
            generationConfig: {
                temperature: 0.1,
                response_mime_type: 'application/json'
            }
        };
    }
}

class AutoFormAssistant {
    constructor() {
        this.scraper = new QuestionScraper();
        this.aiClient = new AIClient();
    }
    
    async run() {
        console.clear();
        Logger.info('Starting Form Answer');
        
        try {
            const questions = this.scraper.scrapeAll();
            
            if (questions.length === 0) {
                throw new Error('No questions found on the form.');
            }
            
            const tracker = new ProgressTracker(questions.length);
            
            const answers = await this.aiClient.getAnswers(questions);
            
            const selector = new AnswerSelector(tracker);
            this.processAnswers(answers, selector);
            
            this.showSummary(tracker);
            if (CONFIG.autorefresh) {
                Logger.info('Refreshing the page in 5 seconds...');
                setTimeout(() => location.reload(), 5000);
            }
            
        } catch (error) {
            Logger.error(`Error: ${error.message}`);
            throw error;
        }
    }
    
    processAnswers(answers, selector) {
        Logger.info('Choosing answers...');
        
        const answerEntries = Array.isArray(answers) 
            ? answers.flatMap(item => Object.entries(item))
            : Object.entries(answers);
        
        answerEntries.forEach(([key, value]) => {
            const questionNo = TextUtils.extractNumber(key);
            if (questionNo) {
                selector.selectAnswer(questionNo, value);
            }
        });
    }
    
    showSummary(tracker) {
        const summary = tracker.getSummary();
        Logger.info(`Success Rate ${summary.success}/${summary.total} (${summary.successRate})`);
        Logger.info(`time taken: ${summary.duration} seconds`);
    }
}

(async () => {
    const app = new AutoFormAssistant();
    await app.run();
})();
