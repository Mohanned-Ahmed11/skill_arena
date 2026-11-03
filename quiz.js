/**
 * Skill Arena - Live Interactive Quiz Engine
 * Manages:
 * - 5 Questions per Subject
 * - 10:00 Minutes Countdown with Circular SVG Animation
 * - Navigation & Option State Tracking
 * - Auto-submission & Detailed Performance Breakdown
 */

const QuizEngine = {
  currentSubject: null,
  questions: [],
  currentQuestionIndex: 0,
  userAnswers: {}, // { 0: optionIndex, 1: optionIndex, ... }
  
  // Timer State (10 Minutes = 600 Seconds)
  totalDurationSeconds: 10 * 60,
  secondsRemaining: 10 * 60,
  timerInterval: null,
  startTime: null,

  init() {
    this.bindEvents();
  },

  bindEvents() {
    // Navigation Buttons
    const btnPrev = document.getElementById("btnQuizPrev");
    const btnNext = document.getElementById("btnQuizNext");
    const btnSubmit = document.getElementById("btnQuizSubmit");
    const btnQuit = document.getElementById("btnQuitQuiz");

    if (btnPrev) btnPrev.addEventListener("click", () => this.previousQuestion());
    if (btnNext) btnNext.addEventListener("click", () => this.nextQuestion());
    if (btnSubmit) btnSubmit.addEventListener("click", () => this.confirmSubmit());
    if (btnQuit) btnQuit.addEventListener("click", () => this.quitQuiz());

    // Results Actions
    const btnRetake = document.getElementById("btnRetakeQuiz");
    const btnBackHome = document.getElementById("btnBackHomeFromResults");

    if (btnRetake) btnRetake.addEventListener("click", () => this.retakeCurrentQuiz());
    if (btnBackHome) btnBackHome.addEventListener("click", () => App.navigateTo("dashboard"));
  },

  startQuiz(subjectId) {
    const subject = SkillDatabase.getSubjectById(subjectId);
    const questions = SkillDatabase.getQuestionsBySubject(subjectId);

    if (!subject || !questions || questions.length === 0) {
      App.showToast("عذراً، لم يتم العثور على أسئلة لهذه المادة", "error");
      return;
    }

    this.currentSubject = subject;
    this.questions = questions.slice(0, 5); // Ensure exactly 5 questions
    this.currentQuestionIndex = 0;
    this.userAnswers = {};
    this.secondsRemaining = this.totalDurationSeconds;
    this.startTime = Date.now();

    // Close any open modal
    App.closeModal();

    // Update Quiz Header Breadcrumb
    const subjectTitleEl = document.getElementById("quizHeaderSubjectTitle");
    const categoryTitleEl = document.getElementById("quizHeaderCategoryTitle");
    if (subjectTitleEl) subjectTitleEl.textContent = subject.title;
    if (categoryTitleEl) categoryTitleEl.textContent = `Quiz Arena: ${subject.badge || subject.titleEn}`;

    // Render Question Pills
    this.renderQuestionPills();

    // Render First Question
    this.renderCurrentQuestion();

    // Start 10-Minute Circular Timer
    this.startTimer();

    // Switch View to Quiz Arena
    App.navigateTo("quiz");
    App.showToast(`بدأ كويز ${subject.title} - بالتوفيق! أمامك 10 دقائق`, "info");
  },

  startTimer() {
    clearInterval(this.timerInterval);
    this.updateTimerUI();

    this.timerInterval = setInterval(() => {
      this.secondsRemaining--;
      this.updateTimerUI();

      if (this.secondsRemaining <= 0) {
        clearInterval(this.timerInterval);
        App.showToast("⏰ انتهى الوقت المحدد للاختبار! جاري تسليم الإجابات تلقائياً...", "warning");
        this.submitQuiz(true);
      }
    }, 1000);
  },

  updateTimerUI() {
    const minutes = Math.floor(this.secondsRemaining / 60);
    const seconds = this.secondsRemaining % 60;
    const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    const timerDisplay = document.getElementById("quizTimerDisplay");
    if (timerDisplay) {
      timerDisplay.textContent = formattedTime;
    }

    // Circular SVG Dashoffset calculation
    // Circle radius = 70 => circumference = 2 * PI * 70 ≈ 440
    const circumference = 440;
    const progressCircle = document.getElementById("timerProgressCircle");

    if (progressCircle) {
      const progressFraction = this.secondsRemaining / this.totalDurationSeconds;
      const strokeOffset = circumference * (1 - progressFraction);
      progressCircle.style.strokeDashoffset = strokeOffset;

      // Dynamic color threshold
      if (this.secondsRemaining <= 60) {
        progressCircle.className.baseVal = "timer-progress-circle danger";
      } else if (this.secondsRemaining <= 180) {
        progressCircle.className.baseVal = "timer-progress-circle warning";
      } else {
        progressCircle.className.baseVal = "timer-progress-circle";
      }
    }
  },

  renderQuestionPills() {
    const container = document.getElementById("quizQuestionPills");
    if (!container) return;

    container.innerHTML = "";
    for (let i = 0; i < this.questions.length; i++) {
      const pill = document.createElement("button");
      pill.type = "button";
      pill.className = "q-nav-pill";
      pill.textContent = i + 1;
      
      if (i === this.currentQuestionIndex) {
        pill.classList.add("current");
      }
      if (this.userAnswers[i] !== undefined) {
        pill.classList.add("answered");
      }

      pill.addEventListener("click", () => {
        this.goToQuestion(i);
      });

      container.appendChild(pill);
    }
  },

  renderCurrentQuestion() {
    const qIndex = this.currentQuestionIndex;
    const qData = this.questions[qIndex];
    if (!qData) return;

    // Update Question Tag & Title
    const qTag = document.getElementById("quizQuestionTag");
    const qTitle = document.getElementById("quizQuestionTitle");
    const progressCount = document.getElementById("quizProgressCount");

    if (qTag) qTag.textContent = `السؤال ${qIndex + 1} من ${this.questions.length}`;
    if (qTitle) qTitle.textContent = qData.question;
    if (progressCount) progressCount.textContent = `سؤال ${qIndex + 1} من ${this.questions.length}`;

    // Render Options List
    const optionsContainer = document.getElementById("quizOptionsContainer");
    if (!optionsContainer) return;

    optionsContainer.innerHTML = "";
    const arabicLetters = ["أ", "ب", "ج", "د"];

    qData.options.forEach((optText, optIdx) => {
      const isSelected = this.userAnswers[qIndex] === optIdx;

      const optCard = document.createElement("div");
      optCard.className = `option-item-card ${isSelected ? "selected" : ""}`;
      optCard.id = `option_${qIndex}_${optIdx}`;

      optCard.innerHTML = `
        <div class="option-radio-circle">
          <div class="option-radio-inner-dot"></div>
        </div>
        <div class="option-label-letter">${arabicLetters[optIdx] || optIdx + 1}</div>
        <div class="option-text-content">${optText}</div>
      `;

      optCard.addEventListener("click", () => {
        this.selectOption(qIndex, optIdx);
      });

      optionsContainer.appendChild(optCard);
    });

    // Update Bottom Navigation Buttons
    const btnPrev = document.getElementById("btnQuizPrev");
    const btnNext = document.getElementById("btnQuizNext");
    const btnSubmit = document.getElementById("btnQuizSubmit");

    if (btnPrev) btnPrev.disabled = qIndex === 0;

    if (qIndex === this.questions.length - 1) {
      if (btnNext) btnNext.style.display = "none";
      if (btnSubmit) btnSubmit.style.display = "flex";
    } else {
      if (btnNext) btnNext.style.display = "flex";
      if (btnSubmit) btnSubmit.style.display = "none";
    }

    this.renderQuestionPills();
  },

  selectOption(qIndex, optionIndex) {
    this.userAnswers[qIndex] = optionIndex;
    
    // Play light click sound effect (Web Audio API)
    this.playAudioTone(520, 0.05);

    this.renderCurrentQuestion();
  },

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.renderCurrentQuestion();
    }
  },

  nextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.renderCurrentQuestion();
    }
  },

  goToQuestion(index) {
    if (index >= 0 && index < this.questions.length) {
      this.currentQuestionIndex = index;
      this.renderCurrentQuestion();
    }
  },

  confirmSubmit() {
    const answeredCount = Object.keys(this.userAnswers).length;
    const totalCount = this.questions.length;

    if (answeredCount < totalCount) {
      const remaining = totalCount - answeredCount;
      const confirmLeave = confirm(`لديك ${remaining} سؤال بدون إجابة. هل أنت متأكد من رغبتك في تسليم الاختبار الآن؟`);
      if (!confirmLeave) return;
    }

    this.submitQuiz(false);
  },

  submitQuiz(isAuto = false) {
    clearInterval(this.timerInterval);

    const timeSpentSeconds = this.totalDurationSeconds - this.secondsRemaining;
    const minutesSpent = Math.floor(timeSpentSeconds / 60);
    const secondsSpent = timeSpentSeconds % 60;
    const formattedDuration = `${minutesSpent} دقيقة و ${secondsSpent} ثانية`;

    // Compute Score
    let correctCount = 0;
    this.questions.forEach((q, idx) => {
      if (this.userAnswers[idx] === q.correctIndex) {
        correctCount++;
      }
    });

    const scorePercentage = Math.round((correctCount / this.questions.length) * 100);

    // Save result to Database
    const quizResult = {
      id: "res_" + Date.now(),
      subjectId: this.currentSubject.id,
      subjectTitle: this.currentSubject.title,
      score: correctCount,
      total: this.questions.length,
      percentage: scorePercentage,
      duration: formattedDuration,
      date: new Date().toLocaleDateString("ar-EG", { year: "numeric", month: "short", day: "numeric" }),
      userAnswers: this.userAnswers
    };

    SkillDatabase.saveQuizResult(quizResult);

    // Play Victory Sound Tone
    this.playAudioTone(880, 0.2);

    // Render Results View
    this.renderResults(quizResult);
    App.navigateTo("results");
  },

  renderResults(result) {
    const scoreVal = document.getElementById("resultScoreValue");
    const gradeMsg = document.getElementById("resultGradeMessage");
    const badgeIcon = document.getElementById("resultBadgeIcon");
    const metricScore = document.getElementById("metricScoreText");
    const metricTime = document.getElementById("metricTimeText");
    const metricAccuracy = document.getElementById("metricAccuracyText");

    if (scoreVal) scoreVal.innerHTML = `${result.score} <span>/ ${result.total}</span>`;
    if (metricScore) metricScore.textContent = `${result.percentage}%`;
    if (metricTime) metricTime.textContent = result.duration;
    if (metricAccuracy) metricAccuracy.textContent = `${result.score} إجابة صحيحة`;

    // Custom Messages & Badges
    if (result.score === 5) {
      if (badgeIcon) badgeIcon.textContent = "🏆";
      if (gradeMsg) gradeMsg.textContent = "أداء أسطوري ممتاز! لقد أجبت على جميع الأسئلة بشكل صحيح 🌟";
    } else if (result.score >= 3) {
      if (badgeIcon) badgeIcon.textContent = "🎖️";
      if (gradeMsg) gradeMsg.textContent = "أحسنت! نتيجة رائعة ومستوى متميز جداً 👍";
    } else {
      if (badgeIcon) badgeIcon.textContent = "📚";
      if (gradeMsg) gradeMsg.textContent = "بداية جيدة! يمكنك مراجعة الإجابات وإعادة المحاولة لتحقيق الدرجة الكاملة 💪";
    }

    // Render Detailed Question Review Breakdown
    const reviewList = document.getElementById("resultsReviewList");
    if (!reviewList) return;

    reviewList.innerHTML = "";
    const arabicLetters = ["أ", "ب", "ج", "د"];

    this.questions.forEach((q, idx) => {
      const userChoiceIdx = this.userAnswers[idx];
      const isCorrect = userChoiceIdx === q.correctIndex;
      const isSkipped = userChoiceIdx === undefined;

      const itemCard = document.createElement("div");
      itemCard.className = `review-item-card ${isCorrect ? "is-correct" : "is-wrong"}`;

      let choicesHtml = "";
      q.options.forEach((opt, optIdx) => {
        let optClass = "review-choice";
        let optSuffix = "";

        if (optIdx === q.correctIndex) {
          optClass += " correct-pick";
          optSuffix = " (الإجابة الصحيحة ✅)";
        } else if (optIdx === userChoiceIdx && !isCorrect) {
          optClass += " user-pick";
          optSuffix = " (إجابتك ❌)";
        }

        choicesHtml += `
          <div class="${optClass}">
            <strong>${arabicLetters[optIdx]}:</strong> ${opt} ${optSuffix}
          </div>
        `;
      });

      itemCard.innerHTML = `
        <div class="review-q-header">
          <span class="question-pill-tag">السؤال ${idx + 1}</span>
          <span class="review-status-tag ${isCorrect ? "correct" : "wrong"}">
            ${isCorrect ? "إجابة صحيحة ✨" : (isSkipped ? "لم تتم الإجابة ⏳" : "إجابة خاطئة ❌")}
          </span>
        </div>
        <div class="review-q-text">${q.question}</div>
        <div class="review-choices">${choicesHtml}</div>
        <div class="review-explanation-box">
          💡 <strong>التوضيح والشرح:</strong> ${q.explanation}
        </div>
      `;

      reviewList.appendChild(itemCard);
    });
  },

  retakeCurrentQuiz() {
    if (this.currentSubject) {
      this.startQuiz(this.currentSubject.id);
    }
  },

  quitQuiz() {
    const confirmQuit = confirm("هل أنت متأكد من رغبتك في مغادرة الاختبار؟ سيتم إلغاء التقدم الحالي.");
    if (confirmQuit) {
      clearInterval(this.timerInterval);
      App.navigateTo("dashboard");
      App.showToast("تم الخروج من الاختبار", "info");
    }
  },

  playAudioTone(frequency = 440, duration = 0.1) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio context might be restricted before user interaction
    }
  }
};
