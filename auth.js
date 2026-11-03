/**
 * Skill Arena - Authentication & User Management Module
 */

const AuthModule = {
  activeTab: "login", // 'login' or 'signup'

  init() {
    this.bindEvents();
    this.checkSession();
  },

  bindEvents() {
    // Auth Tab buttons
    const tabLogin = document.getElementById("tabBtnLogin");
    const tabSignup = document.getElementById("tabBtnSignup");
    const switchLink = document.getElementById("authSwitchLink");

    if (tabLogin && tabSignup) {
      tabLogin.addEventListener("click", () => this.switchTab("login"));
      tabSignup.addEventListener("click", () => this.switchTab("signup"));
    }

    if (switchLink) {
      switchLink.addEventListener("click", (e) => {
        e.preventDefault();
        this.switchTab(this.activeTab === "login" ? "signup" : "login");
      });
    }

    // Password Visibility Toggle
    const pwdToggle = document.getElementById("pwdToggleBtn");
    const pwdInput = document.getElementById("authPassword");
    if (pwdToggle && pwdInput) {
      pwdToggle.addEventListener("click", () => {
        const isPassword = pwdInput.type === "password";
        pwdInput.type = isPassword ? "text" : "password";
        pwdToggle.innerHTML = isPassword ? "👁️" : "🔒";
      });
    }

    // Main Auth Form Submit
    const authForm = document.getElementById("authMainForm");
    if (authForm) {
      authForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleFormSubmit();
      });
    }

    // Social Login Buttons (Google & GitHub)
    const btnGoogle = document.getElementById("btnGoogleLogin");
    const btnGithub = document.getElementById("btnGithubLogin");

    if (btnGoogle) {
      btnGoogle.addEventListener("click", () => this.handleSocialLogin("Google"));
    }
    if (btnGithub) {
      btnGithub.addEventListener("click", () => this.handleSocialLogin("GitHub"));
    }

    // Logout Buttons
    const logoutBtns = document.querySelectorAll(".btn-logout-action");
    logoutBtns.forEach(btn => {
      btn.addEventListener("click", () => this.logout());
    });
  },

  switchTab(tab) {
    this.activeTab = tab;
    const tabLogin = document.getElementById("tabBtnLogin");
    const tabSignup = document.getElementById("tabBtnSignup");
    const nameGroup = document.getElementById("authNameGroup");
    const submitBtn = document.getElementById("authSubmitBtn");
    const switchPrompt = document.getElementById("authSwitchPrompt");
    const switchLink = document.getElementById("authSwitchLink");

    if (tab === "login") {
      tabLogin.classList.add("active");
      tabSignup.classList.remove("active");
      if (nameGroup) nameGroup.style.display = "none";
      submitBtn.textContent = "تسجيل الدخول";
      switchPrompt.textContent = "ليس لديك حساب؟ ";
      switchLink.textContent = "إنشاء حساب جديد";
    } else {
      tabSignup.classList.add("active");
      tabLogin.classList.remove("active");
      if (nameGroup) nameGroup.style.display = "flex";
      submitBtn.textContent = "إنشاء الحساب والبدء";
      switchPrompt.textContent = "لديك حساب بالفعل؟ ";
      switchLink.textContent = "تسجيل الدخول";
    }
  },

  handleFormSubmit() {
    const email = document.getElementById("authEmail").value.trim();
    const password = document.getElementById("authPassword").value.trim();
    const nameInput = document.getElementById("authName");
    const name = nameInput ? nameInput.value.trim() : "";

    if (!email || !password) {
      App.showToast("يرجى ملء جميع الحقول المطلوبة", "error");
      return;
    }

    if (password.length < 6) {
      App.showToast("كلمة المرور يجب ألا تقل عن 6 أحرف", "error");
      return;
    }

    const users = SkillDatabase.getUsers();

    if (this.activeTab === "login") {
      const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existingUser) {
        if (existingUser.password === password) {
          this.loginSuccess(existingUser);
        } else {
          App.showToast("كلمة المرور غير صحيحة، يرجى المحاولة مرة أخرى", "error");
        }
      } else {
        // Automatically create account or log in seamlessly if user just typed
        const newUser = {
          id: "u_" + Date.now(),
          name: email.split("@")[0] || "أحمد علي",
          email: email,
          password: password,
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
          title: "بطل المعرفة",
          joinedDate: new Date().toISOString().split("T")[0]
        };
        users.push(newUser);
        SkillDatabase.saveUsers(users);
        this.loginSuccess(newUser);
      }
    } else {
      // Signup Mode
      if (!name) {
        App.showToast("يرجى كتابة اسم المستخدم", "error");
        return;
      }

      const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existingUser) {
        App.showToast("البريد الإلكتروني مسجل بالفعل، يمكنك تسجيل الدخول", "info");
        this.switchTab("login");
        return;
      }

      const newUser = {
        id: "u_" + Date.now(),
        name: name,
        email: email,
        password: password,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
        title: "متسابق جديد",
        joinedDate: new Date().toISOString().split("T")[0]
      };

      users.push(newUser);
      SkillDatabase.saveUsers(users);
      this.loginSuccess(newUser, true);
    }
  },

  handleSocialLogin(provider) {
    App.showToast(`جاري تسجيل الدخول السريع عبر ${provider}...`, "info");
    setTimeout(() => {
      const socialUser = {
        id: "u_social_" + Date.now(),
        name: provider === "Google" ? "أحمد علي" : "Ahmed Ali (GitHub)",
        email: provider === "Google" ? "ahmed.ali@gmail.com" : "ahmed@github.dev",
        password: "social-oauth-token",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
        title: "متسابق محترف",
        joinedDate: new Date().toISOString().split("T")[0]
      };
      this.loginSuccess(socialUser);
    }, 600);
  },

  loginSuccess(user, isNew = false) {
    SkillDatabase.setCurrentUser(user);
    this.updateUserUI(user);
    
    App.showToast(isNew ? `🎉 تم إنشاء حسابك بنجاح! مرحباً بك يا ${user.name}` : `👋 مرحباً بعودتك يا ${user.name}! تم تسجيل الدخول بنجاح`, "success");
    
    // Switch to Dashboard View smoothly
    setTimeout(() => {
      App.navigateTo("dashboard");
    }, 400);
  },

  updateUserUI(user) {
    if (!user) return;
    
    const userNameElements = document.querySelectorAll(".dynamic-user-name");
    const userRoleElements = document.querySelectorAll(".dynamic-user-role");
    const userAvatarElements = document.querySelectorAll(".dynamic-user-avatar");

    userNameElements.forEach(el => el.textContent = user.name || "أحمد علي");
    userRoleElements.forEach(el => el.textContent = user.title || "طالب متميز");
    userAvatarElements.forEach(el => {
      if (el.tagName === "IMG") el.src = user.avatar;
    });

    const headerAuthBtn = document.getElementById("headerAuthBtn");
    const headerUserBadge = document.getElementById("headerUserBadge");
    if (headerAuthBtn) headerAuthBtn.style.display = "none";
    if (headerUserBadge) headerUserBadge.style.display = "flex";
  },

  checkSession() {
    const user = SkillDatabase.getCurrentUser();
    if (user) {
      this.updateUserUI(user);
    } else {
      const headerAuthBtn = document.getElementById("headerAuthBtn");
      const headerUserBadge = document.getElementById("headerUserBadge");
      if (headerAuthBtn) headerAuthBtn.style.display = "block";
      if (headerUserBadge) headerUserBadge.style.display = "none";
    }
  },

  logout() {
    SkillDatabase.setCurrentUser(null);
    const headerAuthBtn = document.getElementById("headerAuthBtn");
    const headerUserBadge = document.getElementById("headerUserBadge");
    if (headerAuthBtn) headerAuthBtn.style.display = "block";
    if (headerUserBadge) headerUserBadge.style.display = "none";

    const userDropdown = document.getElementById("userDropdownMenu");
    if (userDropdown) userDropdown.classList.remove("active");

    App.showToast("تم تسجيل الخروج بنجاح", "info");
    App.navigateTo("auth");
  }
};
