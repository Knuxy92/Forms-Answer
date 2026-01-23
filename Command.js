(function() {
  'use strict';

  const helpButton = document.querySelector('button[aria-label="ความช่วยเหลือและความคิดเห็น"]');
  if (!helpButton) {
    console.error('AnswerFlow: Help button not found');
    return;
  }

  const answerFlowBtn = document.createElement('button');
  answerFlowBtn.className = helpButton.className;
  answerFlowBtn.setAttribute('aria-label', 'AnswerFlow AI Assistant');

  const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  iconSvg.setAttribute('width', '20');
  iconSvg.setAttribute('height', '20');
  iconSvg.setAttribute('viewBox', '0 0 24 24');
  iconSvg.setAttribute('fill', 'none');
  iconSvg.setAttribute('stroke', 'currentColor');
  iconSvg.setAttribute('stroke-width', '2');

  const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path1.setAttribute('d', 'M12 2L2 7l10 5 10-5-10-5z');
  const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path2.setAttribute('d', 'M2 17l10 5 10-5');
  const path3 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path3.setAttribute('d', 'M2 12l10 5 10-5');

  iconSvg.appendChild(path1);
  iconSvg.appendChild(path2);
  iconSvg.appendChild(path3);

  const iconContainer = document.createElement('div');
  iconContainer.className = 'foqfDc gdyQ3c';
  iconContainer.appendChild(iconSvg);
  
  answerFlowBtn.appendChild(iconContainer);

  helpButton.parentNode.replaceChild(answerFlowBtn, helpButton);

  const panel = document.createElement('div');
  panel.id = 'answerflow-panel';
  panel.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.9);
    width: 500px;
    max-height: 600px;
    background: linear-gradient(135deg, #0d1117 0%, #1c1f26 100%);
    border: 1px solid #30363d;
    border-radius: 12px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
    z-index: 10000;
    opacity: 0;
    pointer-events: none;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    font-family: 'Segoe UI', 'SF Pro', system-ui, sans-serif;
    overflow: hidden;
  `;

  const header = document.createElement('div');
  header.style.cssText = 'padding: 24px; background: linear-gradient(135deg, #1f6feb 0%, #58a6ff 100%); color: white;';
  
  const headerFlex = document.createElement('div');
  headerFlex.style.cssText = 'display: flex; justify-content: space-between; align-items: center;';
  
  const titleDiv = document.createElement('div');
  const title = document.createElement('h2');
  title.textContent = 'AnswerFlow';
  title.style.cssText = 'margin: 0; font-size: 20px; font-weight: 600; letter-spacing: -0.5px;';
  const subtitle = document.createElement('p');
  subtitle.textContent = 'AI-Powered Auto Answer System';
  subtitle.style.cssText = 'margin: 4px 0 0 0; font-size: 12px; opacity: 0.9;';
  titleDiv.appendChild(title);
  titleDiv.appendChild(subtitle);
  
  const closeBtn = document.createElement('button');
  closeBtn.id = 'af-close';
  closeBtn.textContent = '×';
  closeBtn.style.cssText = 'background: rgba(255,255,255,0.2); border: none; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; color: white; font-size: 20px; display: flex; align-items: center; justify-content: center; transition: all 0.2s;';
  
  headerFlex.appendChild(titleDiv);
  headerFlex.appendChild(closeBtn);
  header.appendChild(headerFlex);
  
  const body = document.createElement('div');
  body.style.cssText = 'padding: 20px; max-height: 450px; overflow-y: auto;';
  
  const status = document.createElement('div');
  status.id = 'af-status';
  status.style.cssText = 'background: #161b22; border: 1px solid #30363d; border-radius: 8px; padding: 16px; margin-bottom: 16px;';
  
  const statusFlex = document.createElement('div');
  statusFlex.style.cssText = 'display: flex; align-items: center; gap: 8px; color: #8b949e; font-size: 13px;';
  const statusDot = document.createElement('div');
  statusDot.style.cssText = 'width: 8px; height: 8px; background: #3fb950; border-radius: 50%; animation: pulse 2s infinite;';
  const statusText = document.createElement('span');
  statusText.textContent = 'Ready to process';
  statusFlex.appendChild(statusDot);
  statusFlex.appendChild(statusText);
  status.appendChild(statusFlex);
  
  // Stats
  const statsGrid = document.createElement('div');
  statsGrid.id = 'af-stats';
  statsGrid.style.cssText = 'display: none; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 16px;';
  
  const statBox1 = document.createElement('div');
  statBox1.style.cssText = 'background: #161b22; border: 1px solid #30363d; border-radius: 8px; padding: 12px;';
  const statLabel1 = document.createElement('div');
  statLabel1.textContent = 'Total Questions';
  statLabel1.style.cssText = 'color: #8b949e; font-size: 11px; margin-bottom: 4px;';
  const statValue1 = document.createElement('div');
  statValue1.id = 'af-total';
  statValue1.textContent = '0';
  statValue1.style.cssText = 'color: #58a6ff; font-size: 24px; font-weight: 600;';
  statBox1.appendChild(statLabel1);
  statBox1.appendChild(statValue1);
  
  const statBox2 = document.createElement('div');
  statBox2.style.cssText = 'background: #161b22; border: 1px solid #30363d; border-radius: 8px; padding: 12px;';
  const statLabel2 = document.createElement('div');
  statLabel2.textContent = 'Success Rate';
  statLabel2.style.cssText = 'color: #8b949e; font-size: 11px; margin-bottom: 4px;';
  const statValue2 = document.createElement('div');
  statValue2.id = 'af-rate';
  statValue2.textContent = '0%';
  statValue2.style.cssText = 'color: #3fb950; font-size: 24px; font-weight: 600;';
  statBox2.appendChild(statLabel2);
  statBox2.appendChild(statValue2);
  
  statsGrid.appendChild(statBox1);
  statsGrid.appendChild(statBox2);
  
  const progressBox = document.createElement('div');
  progressBox.id = 'af-progress';
  progressBox.style.cssText = 'background: #161b22; border: 1px solid #30363d; border-radius: 8px; padding: 16px; margin-bottom: 16px; display: none;';
  
  const progressTop = document.createElement('div');
  progressTop.style.cssText = 'display: flex; justify-content: space-between; margin-bottom: 8px;';
  const progressLabel = document.createElement('span');
  progressLabel.textContent = 'Processing...';
  progressLabel.style.cssText = 'color: #c9d1d9; font-size: 13px;';
  const progressText = document.createElement('span');
  progressText.id = 'af-progress-text';
  progressText.textContent = '0/0';
  progressText.style.cssText = 'color: #8b949e; font-size: 13px;';
  progressTop.appendChild(progressLabel);
  progressTop.appendChild(progressText);
  
  const progressTrack = document.createElement('div');
  progressTrack.style.cssText = 'background: #21262d; height: 6px; border-radius: 3px; overflow: hidden;';
  const progressBar = document.createElement('div');
  progressBar.id = 'af-progress-bar';
  progressBar.style.cssText = 'background: linear-gradient(90deg, #1f6feb, #58a6ff); height: 100%; width: 0%; transition: width 0.3s;';
  progressTrack.appendChild(progressBar);
  
  progressBox.appendChild(progressTop);
  progressBox.appendChild(progressTrack);
  
  const log = document.createElement('div');
  log.id = 'af-log';
  log.style.cssText = 'background: #0d1117; border: 1px solid #30363d; border-radius: 8px; padding: 12px; font-family: Consolas, Monaco, monospace; font-size: 12px; color: #8b949e; max-height: 200px; overflow-y: auto; margin-bottom: 16px; display: none;';
  
  const startBtn = document.createElement('button');
  startBtn.id = 'af-start';
  startBtn.textContent = '🚀 Start Auto Answer';
  startBtn.style.cssText = `
    width: 100%;
    background: linear-gradient(135deg, #1f6feb 0%, #388bfd 100%);
    color: white;
    border: none;
    padding: 14px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 12px rgba(31, 111, 235, 0.3);
  `;
  
  body.appendChild(status);
  body.appendChild(statsGrid);
  body.appendChild(progressBox);
  body.appendChild(log);
  body.appendChild(startBtn);
  
  panel.appendChild(header);
  panel.appendChild(body);
  
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    #af-close:hover { background: rgba(255,255,255,0.3) !important; transform: rotate(90deg); }
    #af-start:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(31, 111, 235, 0.4) !important; }
    #af-start:active { transform: translateY(0); }
    #answerflow-panel::-webkit-scrollbar { width: 8px; }
    #answerflow-panel::-webkit-scrollbar-track { background: #161b22; }
    #answerflow-panel::-webkit-scrollbar-thumb { background: #30363d; border-radius: 4px; }
    #af-log::-webkit-scrollbar { width: 6px; }
    #af-log::-webkit-scrollbar-thumb { background: #30363d; border-radius: 3px; }
  `;
  document.head.appendChild(style);
  document.body.appendChild(panel);

  let isOpen = false;
  answerFlowBtn.addEventListener('click', () => {
    isOpen = !isOpen;
    if (isOpen) {
      panel.style.opacity = '1';
      panel.style.pointerEvents = 'auto';
      panel.style.transform = 'translate(-50%, -50%) scale(1)';
    } else {
      panel.style.opacity = '0';
      panel.style.pointerEvents = 'none';
      panel.style.transform = 'translate(-50%, -50%) scale(0.9)';
    }
  });

  closeBtn.addEventListener('click', () => {
    isOpen = false;
    panel.style.opacity = '0';
    panel.style.pointerEvents = 'none';
    panel.style.transform = 'translate(-50%, -50%) scale(0.9)';
  });


  const logger = {
    log(text, type = 'info') {
      const logEl = document.getElementById('af-log');
      logEl.style.display = 'block';
      const colors = {
        success: '#3fb950',
        error: '#f85149',
        warning: '#d29922',
        info: '#58a6ff'
      };
      const icons = {
        success: '✓',
        error: '✗',
        warning: '⚠',
        info: 'ℹ'
      };
      const line = document.createElement('div');
      line.style.cssText = `color: ${colors[type]}; margin-bottom: 4px;`;
      line.textContent = `${icons[type]} ${text}`;
      logEl.appendChild(line);
      logEl.scrollTop = logEl.scrollHeight;
    },
    clear() {
      document.getElementById('af-log').textContent = '';
    }
  };

  // ==========================
  // 5. Update Status Function
  // ==========================
  function updateStatus(text, color, pulse = false) {
    const statusEl = document.getElementById('af-status');
    statusEl.textContent = '';
    
    const flex = document.createElement('div');
    flex.style.cssText = 'display: flex; align-items: center; gap: 8px; font-size: 13px;';
    flex.style.color = color;
    
    const dot = document.createElement('div');
    dot.style.cssText = `width: 8px; height: 8px; background: ${color}; border-radius: 50%;`;
    if (pulse) dot.style.animation = 'pulse 1s infinite';
    
    const span = document.createElement('span');
    span.textContent = text;
    
    flex.appendChild(dot);
    flex.appendChild(span);
    statusEl.appendChild(flex);
  }

  // ==========================
  // 6. Start Button Handler
  // ==========================
  startBtn.addEventListener('click', async () => {
    logger.clear();
    document.getElementById('af-stats').style.display = 'grid';
    document.getElementById('af-progress').style.display = 'block';
    
    // Collect questions
    logger.log('Collecting questions...', 'info');
    const questions = [...document.querySelectorAll('.geS5n')].map((block, index) => {
      const titleEl = block.querySelector('div[role="heading"] span');
      const options = [...block.querySelectorAll('span.aDTYNe')]
        .map(o => o.innerText.trim())
        .filter(Boolean);
      return {
        no: index + 1,
        question: titleEl ? titleEl.innerText.replace(/\s+/g, ' ').trim() : null,
        choices: options
      };
    });

    document.getElementById('af-total').textContent = questions.length;
    logger.log(`Found ${questions.length} questions`, 'success');

    // Fetch AI answers
    logger.log('Requesting AI analysis...', 'info');
    updateStatus('Processing with AI...', '#58a6ff', true);

    const stats = { total: questions.length, success: 0, fail: 0, start: performance.now() };

    try {
      const response = await fetch("http://127.0.0.1:5000/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([{ Data: questions, Model: "gemini-2.5-flash" }])
      });

      const data = await response.json();
      logger.log('AI response received', 'success');
      
      const answerMap = data.respone;

      // Apply answers
      logger.log('Applying answers...', 'info');
      
      function normalizeText(v) {
        if (typeof v === 'string') return v.trim();
        if (Array.isArray(v)) return v.map(x => String(x).trim());
        if (v == null) return '';
        return String(v).trim();
      }

      function selectChoiceByText(questionNo, choiceText) {
        const blocks = document.querySelectorAll('.geS5n');
        const q = blocks[questionNo - 1];

        if (!q) {
          stats.fail++;
          logger.log(`Q${questionNo}: Not found`, 'error');
          return;
        }

        const options = q.querySelectorAll('[role="radio"], [role="checkbox"]');
        const normalized = normalizeText(choiceText);

        for (const opt of options) {
          const text = opt.getAttribute('aria-label')?.trim();
          
          if (Array.isArray(normalized) ? normalized.includes(text) : text === normalized) {
            opt.click();
            stats.success++;
            logger.log(`Q${questionNo}: Selected`, 'success');
            
            // Update progress
            const progress = Math.round(((stats.success + stats.fail) / stats.total) * 100);
            document.getElementById('af-progress-bar').style.width = `${progress}%`;
            document.getElementById('af-progress-text').textContent = `${stats.success + stats.fail}/${stats.total}`;
            document.getElementById('af-rate').textContent = `${Math.round((stats.success / stats.total) * 100)}%`;
            return;
          }
        }

        stats.fail++;
        logger.log(`Q${questionNo}: Choice not found`, 'error');
        const progress = Math.round(((stats.success + stats.fail) / stats.total) * 100);
        document.getElementById('af-progress-bar').style.width = `${progress}%`;
        document.getElementById('af-progress-text').textContent = `${stats.success + stats.fail}/${stats.total}`;
        document.getElementById('af-rate').textContent = `${Math.round((stats.success / stats.total) * 100)}%`;
      }

      Object.entries(answerMap).forEach(([key, value]) => {
        const match = key.match(/\d+/);
        if (match) {
          selectChoiceByText(parseInt(match[0], 10), value);
        }
      });

      const duration = (performance.now() - stats.start).toFixed(2);
      updateStatus(`Completed in ${duration}ms`, '#3fb950', false);
      
      if (stats.success === stats.total) {
        logger.log('🎉 All questions answered!', 'success');
      } else {
        logger.log(`⚠ ${stats.fail} questions failed`, 'warning');
      }

    } catch (err) {
      logger.log(`Fatal error: ${err.message}`, 'error');
      updateStatus('Error occurred', '#f85149', false);
    }
  });

})();