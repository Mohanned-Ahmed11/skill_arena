/**
 * Skill Arena - Main Application Controller
 * Handles view routing, dynamic category rendering, search,
 * modals, Explorer showcase, toast notifications, and UI bindings.
 */

const App = {
  currentView: "auth", // 'auth', 'dashboard', 'quiz', 'results'
  selectedModalSubject: null,
  activeExplorerCategory: "all",

  init() {
    console.log("Skill Arena initializing...");
    
    // Initialize Submodules
    AuthModule.init();
    QuizEngine.init();

    // Render Dashboard Categories
    this.renderDashboardCategories();

    // Bind Global UI Events
    this.bindEvents();

    // Check if user is logged in
    const currentUser = SkillDatabase.getCurrentUser();
    if (currentUser) {
      this.navigateTo("dashboard");
    } else {
      this.navigateTo("auth");
    }
  },

  bindEvents() {
    // Logo Click -> Navigate to Dashboard if logged in, else Auth
    const brandLogos = document.querySelectorAll(".brand-logo");
    brandLogos.forEach(logo => {
      logo.addEventListener("click", (e) => {
        e.preventDefault();
        const user = SkillDatabase.getCurrentUser();
        if (user) {
          this.navigateTo("dashboard");
        } else {
          this.navigateTo("auth");
        }
      });
    });

    // Header Auth Button
    const headerAuthBtn = document.getElementById("headerAuthBtn");
    if (headerAuthBtn) {
      headerAuthBtn.addEventListener("click", () => {
        this.navigateTo("auth");
      });
    }

    // Header User Profile Click (Toggle Dropdown)
    const headerUserBadge = document.getElementById("headerUserBadge");
    const userDropdown = document.getElementById("userDropdownMenu");
    if (headerUserBadge && userDropdown) {
      headerUserBadge.addEventListener("click", (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle("active");
      });

      document.addEventListener("click", () => {
        userDropdown.classList.remove("active");
      });
    }

    // Search Input Functionality
    const searchInput = document.getElementById("globalSearchInput");
    const searchDropdown = document.getElementById("searchResultsDropdown");

    if (searchInput && searchDropdown) {
      searchInput.addEventListener("input", (e) => {
        const query = e.target.value.trim().toLowerCase();
        this.handleSearch(query, searchDropdown);
      });

      searchInput.addEventListener("focus", (e) => {
        const query = e.target.value.trim().toLowerCase();
        if (query) {
          this.handleSearch(query, searchDropdown);
        }
      });

      document.addEventListener("click", (e) => {
        if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
          searchDropdown.classList.remove("active");
        }
      });
    }

    // Subject Rules Modal Close & Start
    const modalOverlay = document.getElementById("subjectModalOverlay");
    const modalCloseBtn = document.getElementById("modalCloseBtn");
    const btnModalStartQuiz = document.getElementById("btnModalStartQuiz");

    if (modalOverlay) {
      modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) this.closeModal();
      });
    }

    if (modalCloseBtn) {
      modalCloseBtn.addEventListener("click", () => this.closeModal());
    }

    if (btnModalStartQuiz) {
      btnModalStartQuiz.addEventListener("click", () => {
        if (this.selectedModalSubject) {
          QuizEngine.startQuiz(this.selectedModalSubject.id);
        }
      });
    }

    // Track Explorer Modal Close & Tab switching
    const explorerOverlay = document.getElementById("trackExplorerModalOverlay");
    const explorerCloseBtn = document.getElementById("explorerModalCloseBtn");
    const explorerTabBtns = document.querySelectorAll(".explorer-tab-btn");

    if (explorerOverlay) {
      explorerOverlay.addEventListener("click", (e) => {
        if (e.target === explorerOverlay) this.closeExplorerModal();
      });
    }

    if (explorerCloseBtn) {
      explorerCloseBtn.addEventListener("click", () => this.closeExplorerModal());
    }

    explorerTabBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const cat = btn.getAttribute("data-cat");
        this.filterExplorerCategory(cat);
      });
    });

    // Sidebar navigation clicks
    const sidebarLinks = document.querySelectorAll(".sidebar-menu-link");
    sidebarLinks.forEach(link => {
      link.addEventListener("click", (e) => {
        const targetView = link.getAttribute("data-view");
        const targetSubject = link.getAttribute("data-subject");

        sidebarLinks.forEach(l => l.classList.remove("active"));
        link.classList.add("active");

        if (targetSubject) {
          this.openSubjectModal(targetSubject);
        } else if (targetView) {
          this.navigateTo(targetView);
        }
      });
    });
  },

  navigateTo(viewName) {
    this.currentView = viewName;
    const views = document.querySelectorAll(".view-section");
    views.forEach(v => v.classList.remove("active"));

    const targetView = document.getElementById(`view_${viewName}`);
    if (targetView) {
      targetView.classList.add("active");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Update Header Search & User visibility based on view
    const headerSearch = document.getElementById("headerSearchContainer");
    if (headerSearch) {
      headerSearch.style.display = viewName === "auth" ? "none" : "block";
    }

    // Refresh history / stats if navigating to dashboard
    if (viewName === "dashboard") {
      this.updateDashboardStats();
    }
  },

  renderDashboardCategories() {
    const categoriesContainer = document.getElementById("dashboardCategoriesGrid");
    if (!categoriesContainer) return;

    categoriesContainer.innerHTML = "";

    SkillDatabase.categories.forEach(cat => {
      const catCard = document.createElement("div");
      catCard.className = "category-tile-card";

      let subjectBadgesHtml = "";
      cat.subjects.forEach(sub => {
        subjectBadgesHtml += `
          <div class="subject-mini-item" onclick="App.openSubjectModal('${sub.id}')" title="عرض تفاصيل ${sub.title}">
            <div class="subject-icon-box">${sub.icon}</div>
            <div class="subject-mini-name">${sub.title}</div>
          </div>
        `;
      });

      const exploreBtnText = cat.id === "languages" ? "استكشف اللغات" : "استكشف المواد";

      catCard.innerHTML = `
        <h3 class="category-card-title">${cat.title}</h3>
        <div class="subject-badges-row">
          ${subjectBadgesHtml}
        </div>
        <button class="btn-explore-category" onclick="App.openCategoryModal('${cat.id}')">
          ${exploreBtnText} 🔍
        </button>
      `;

      categoriesContainer.appendChild(catCard);
    });
  },

  /**
   * Open the Aesthetic Track Explorer Modal showing all subjects in that category or all
   */
  openCategoryModal(categoryId = "all") {
    this.activeExplorerCategory = categoryId;

    const modalTitle = document.getElementById("explorerModalTitle");
    const modalSubtitle = document.getElementById("explorerModalSubtitle");

    if (categoryId === "basic_sciences") {
      if (modalTitle) modalTitle.textContent = "مسار العلوم الأساسية - اختر مادتك المفضلة";
      if (modalSubtitle) modalSubtitle.textContent = "تحديات متقدمة في القوانين الفيزيائية، الميكانيكا، المعادلات الرياضية، والتفاضل والتكامل.";
    } else if (categoryId === "technology") {
      if (modalTitle) modalTitle.textContent = "مسار التكنولوجيا والبرمجة - اختر مجالك";
      if (modalSubtitle) modalSubtitle.textContent = "مسائل برمجية واقعية، هندسة البرمجيات، هياكل البيانات، ومفاهيم الأمن السيبراني والشبكات.";
    } else if (categoryId === "languages") {
      if (modalTitle) modalTitle.textContent = "مسار اللغات والأدب - اختر لغة التحدي";
      if (modalSubtitle) modalSubtitle.textContent = "اختبارات القواعد النحوية، البلاغة والأدب، والمفردات اللغوية المتقدمة.";
    } else {
      if (modalTitle) modalTitle.textContent = "استكشف جميع المواد ومسارات التحدي";
      if (modalSubtitle) modalSubtitle.textContent = "تصفح جميع المواد المتاحة واختر التحدي الذي يناسبك. كل كويز 10 دقائق و 5 أسئلة.";
    }

    // Update active tab button
    const tabs = document.querySelectorAll(".explorer-tab-btn");
    tabs.forEach(tab => {
      if (tab.getAttribute("data-cat") === categoryId) {
        tab.classList.add("active");
      } else {
        tab.classList.remove("active");
      }
    });

    // Render subjects grid
    this.renderExplorerSubjects(categoryId);

    // Open Overlay
    const overlay = document.getElementById("trackExplorerModalOverlay");
    if (overlay) {
      overlay.classList.add("active");
    }
  },

  filterExplorerCategory(categoryId) {
    this.openCategoryModal(categoryId);
  },

  renderExplorerSubjects(categoryId) {
    const gridContainer = document.getElementById("explorerCardsGrid");
    if (!gridContainer) return;

    gridContainer.innerHTML = "";

    let filteredSubjects = [];
    SkillDatabase.categories.forEach(cat => {
      if (categoryId === "all" || cat.id === categoryId) {
        cat.subjects.forEach(sub => {
          filteredSubjects.push({ ...sub, categoryTitle: cat.title });
        });
      }
    });

    filteredSubjects.forEach(sub => {
      const card = document.createElement("div");
      card.className = "explorer-item-card";

      card.innerHTML = `
        <div class="explorer-card-top">
          <div class="explorer-card-icon-box">${sub.icon}</div>
          <div class="explorer-card-meta">
            <h4>${sub.title}</h4>
            <span class="explorer-card-badge">${sub.badge || sub.titleEn}</span>
          </div>
        </div>

        <p class="explorer-card-desc">${sub.description}</p>

        <div class="explorer-card-specs">
          <span class="explorer-spec-tag">⏱️ 10 دقائق</span>
          <span class="explorer-spec-tag">❓ 5 أسئلة</span>
          <span class="explorer-spec-tag">🎯 60% اجتياز</span>
          <span class="explorer-spec-tag">⚡ ${sub.difficulty}</span>
        </div>

        <div class="explorer-card-actions">
          <button type="button" class="btn-card-start-quiz" onclick="App.startQuizFromExplorer('${sub.id}')">
            🚀 ابدأ الكويز
          </button>
          <button type="button" class="btn-card-info-quiz" onclick="App.openSubjectModal('${sub.id}')" title="تفاصيل وقواعد الاختبار">
            ℹ️
          </button>
        </div>
      `;

      gridContainer.appendChild(card);
    });
  },

  startQuizFromExplorer(subjectId) {
    this.closeExplorerModal();
    QuizEngine.startQuiz(subjectId);
  },

  closeExplorerModal() {
    const overlay = document.getElementById("trackExplorerModalOverlay");
    if (overlay) overlay.classList.remove("active");
  },

  openSubjectModal(subjectId) {
    const subject = SkillDatabase.getSubjectById(subjectId);
    if (!subject) return;

    this.selectedModalSubject = subject;

    const modalIcon = document.getElementById("modalSubjectIcon");
    const modalTitle = document.getElementById("modalSubjectTitle");
    const modalDesc = document.getElementById("modalSubjectDesc");
    const modalOverlay = document.getElementById("subjectModalOverlay");

    if (modalIcon) modalIcon.textContent = subject.icon;
    if (modalTitle) modalTitle.textContent = `${subject.title} (${subject.titleEn})`;
    if (modalDesc) modalDesc.textContent = subject.description;

    if (modalOverlay) {
      modalOverlay.classList.add("active");
    }
  },

  closeModal() {
    const modalOverlay = document.getElementById("subjectModalOverlay");
    if (modalOverlay) modalOverlay.classList.remove("active");
    this.selectedModalSubject = null;
  },

  handleSearch(query, dropdown) {
    if (!query) {
      dropdown.classList.remove("active");
      dropdown.innerHTML = "";
      return;
    }

    const matchedSubjects = [];
    SkillDatabase.categories.forEach(cat => {
      cat.subjects.forEach(sub => {
        if (
          sub.title.toLowerCase().includes(query) ||
          sub.titleEn.toLowerCase().includes(query) ||
          sub.description.toLowerCase().includes(query) ||
          cat.title.toLowerCase().includes(query)
        ) {
          matchedSubjects.push(sub);
        }
      });
    });

    if (matchedSubjects.length === 0) {
      dropdown.innerHTML = `<div class="search-item" style="color:#94a3b8; justify-content:center;">لا توجد نتائج تطابق بحثك</div>`;
      dropdown.classList.add("active");
      return;
    }

    dropdown.innerHTML = "";
    matchedSubjects.forEach(sub => {
      const item = document.createElement("div");
      item.className = "search-item";
      item.innerHTML = `
        <span>${sub.icon} ${sub.title} - ${sub.titleEn}</span>
        <span style="font-size:0.75rem; color:var(--accent-cyan);">10 دقائق • 5 أسئلة</span>
      `;
      item.addEventListener("click", () => {
        dropdown.classList.remove("active");
        this.openSubjectModal(sub.id);
      });
      dropdown.appendChild(item);
    });

    dropdown.classList.add("active");
  },

  updateDashboardStats() {
    const history = SkillDatabase.getQuizHistory();
    const totalCountEl = document.getElementById("statTotalQuizzesCount");
    const avgScoreEl = document.getElementById("statAvgScore");

    if (totalCountEl) totalCountEl.textContent = history.length;

    if (avgScoreEl) {
      if (history.length === 0) {
        avgScoreEl.textContent = "100%";
      } else {
        const sumPercentage = history.reduce((acc, h) => acc + (h.percentage || 0), 0);
        const avg = Math.round(sumPercentage / history.length);
        avgScoreEl.textContent = `${avg}%`;
      }
    }
  },

  showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    let icon = "ℹ️";
    if (type === "success") icon = "✅";
    if (type === "error") icon = "❌";
    if (type === "warning") icon = "⚠️";

    toast.innerHTML = `
      <span>${icon}</span>
      <div style="font-size:0.9rem; font-weight:600;">${message}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(-20px)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }
};

// Initialize App when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  App.init();
});
