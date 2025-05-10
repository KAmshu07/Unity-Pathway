/**
 * UI Manager for Unity Learning Platform
 * 
 * Handles all user interface interactions, view switching,
 * and UI state management.
 */

const UIManager = {
  /**
   * State information
   */
  state: {
    currentView: 'dashboard',
    currentModuleId: null,
    currentTopicId: null,
    showCompleted: true,
    viewMode: 'grid',
    sidebarOpen: false,
    searchModalOpen: false,
    feedbackModalOpen: false,
    shareModalOpen: false,
    confirmModalOpen: false,
    notesOpen: false,
    confirmCallback: null
  },

  /**
   * DOM Elements (initialized in init)
   */
  elements: {},

  /**
   * User data from Storage
   */
  userData: null,

  /**
   * Initialize UI Manager
   * @param {Object} userData - User data from Storage
   */
  init(userData) {
    // Store user data
    this.userData = userData;

    // Initialize DOM elements
    this.initDOMElements();

    // Setup event listeners
    this.setupEventListeners();

    // Apply initial settings
    this.applyUserSettings();

    // Initial render of persistent UI elements
    this.renderBookmarks();
    this.renderRecentActivity();
    this.updateProgressIndicators();

    // Set initial view
    const urlParams = Utils.url.getQueryParams();
    if (urlParams.module) {
      // If a module ID is specified in URL, open that module
      this.openModule(urlParams.module);

      // If a topic ID is also specified, open that topic
      if (urlParams.topic) {
        this.openTopic(urlParams.module, urlParams.topic);
      }
    } else {
      // Otherwise default to dashboard
      this.showView('dashboard');
    }
  },

  /**
   * Initialize DOM element references
   */
  initDOMElements() {
    this.elements = {
      // Main views
      views: {
        dashboard: Utils.dom.getId('dashboard-view'),
        module: Utils.dom.getId('module-view'),
        topic: Utils.dom.getId('topic-view'),
        resources: Utils.dom.getId('resources-view'),
        about: Utils.dom.getId('about-view')
      },

      // Navigation
      navLinks: Utils.dom.qsa('.nav-links a'),
      menuToggle: Utils.dom.getId('menu-toggle'),
      mainNav: Utils.dom.getId('main-nav'),

      // Dashboard
      modulesContainer: Utils.dom.getId('modules-container'),
      showCompletedBtn: Utils.dom.getId('show-completed-btn'),
      gridViewBtn: Utils.dom.getId('grid-view-btn'),
      listViewBtn: Utils.dom.getId('list-view-btn'),
      overallProgressBar: Utils.dom.getId('overall-progress-bar'),
      overallProgressText: Utils.dom.getId('overall-progress-text'),
      modulesCompletedCount: Utils.dom.getId('modules-completed-count'),
      topicsCompletedCount: Utils.dom.getId('topics-completed-count'),
      timeSpent: Utils.dom.getId('time-spent'),
      startLearningBtn: Utils.dom.getId('start-learning-btn'),
      viewSyllabusBtn: Utils.dom.getId('view-syllabus-btn'),

      // Module view
      backToDashboardBtn: Utils.dom.getId('back-to-dashboard-btn'),
      moduleTitle: Utils.dom.getId('module-title'),
      modulePhase: Utils.dom.getId('module-phase'),
      moduleEstimatedTime: Utils.dom.getId('module-estimated-time'),
      moduleDescription: Utils.dom.getId('module-description'),
      moduleTopics: Utils.dom.getId('module-topics'),
      moduleResources: Utils.dom.getId('module-resources'),
      moduleResourcesContainer: Utils.dom.getId('module-resources-container'),
      prevModuleBtn: Utils.dom.getId('prev-module-btn'),
      nextModuleBtn: Utils.dom.getId('next-module-btn'),
      markModuleCompleteBtn: Utils.dom.getId('mark-module-complete-btn'),
      bookmarkModuleBtn: Utils.dom.getId('bookmark-module-btn'),
      shareModuleBtn: Utils.dom.getId('share-module-btn'),

      // Topic view
      backToModuleBtn: Utils.dom.getId('back-to-module-btn'),
      topicTitle: Utils.dom.getId('topic-title'),
      topicModuleTitleLink: Utils.dom.getId('topic-module-title-link'),
      topicContent: Utils.dom.getId('topic-content'),
      subtopicsSection: Utils.dom.getId('subtopics-section'),
      subtopicsList: Utils.dom.getId('subtopics-list'),
      subtopicsCompletedCount: Utils.dom.getId('subtopics-completed-count'),
      subtopicsProgressBar: Utils.dom.getId('subtopics-progress-bar'),
      prevTopicBtn: Utils.dom.getId('prev-topic-btn'),
      nextTopicBtn: Utils.dom.getId('next-topic-btn'),
      markTopicCompleteBtn: Utils.dom.getId('mark-topic-complete-btn'),
      bookmarkTopicBtn: Utils.dom.getId('bookmark-topic-btn'),
      toggleNotesBtn: Utils.dom.getId('toggle-notes-btn'),
      notesPanel: Utils.dom.getId('notes-panel'),
      notesTextarea: Utils.dom.getId('notes-textarea'),
      saveNotesBtn: Utils.dom.getId('save-notes-btn'),

      // Profile sidebar
      profileButton: Utils.dom.getId('profile-button'),
      profileSidebar: Utils.dom.getId('profile-sidebar'),
      closeProfileSidebarBtn: Utils.dom.getId('close-profile-sidebar-btn'),
      sidebarProgressBar: Utils.dom.getId('sidebar-progress-bar'),
      sidebarProgressText: Utils.dom.getId('sidebar-progress-text'),
      bookmarksList: Utils.dom.getId('bookmarks-list'),
      activityList: Utils.dom.getId('activity-list'),

      // Settings
      fontSizeSelect: Utils.dom.getId('font-size-select'),
      autoSaveNotesCheckbox: Utils.dom.getId('auto-save-notes'),
      resetProgressBtn: Utils.dom.getId('reset-progress-btn'),
      themeToggle: Utils.dom.getId('theme-toggle'),

      // Search
      searchInput: Utils.dom.getId('search-input'),
      searchButton: Utils.dom.getId('search-button'),
      inlineSearchResults: Utils.dom.getId('inline-search-results'),
      searchModal: Utils.dom.getId('search-modal'),
      closeSearchModalBtn: Utils.dom.getId('close-search-modal-btn'),
      modalSearchInput: Utils.dom.getId('modal-search-input'),
      modalSearchBtn: Utils.dom.getId('modal-search-btn'),
      searchResults: Utils.dom.getId('search-results'),

      // Feedback
      feedbackLink: Utils.dom.getId('feedback-link'),
      feedbackModal: Utils.dom.getId('feedback-modal'),
      closeFeedbackModalBtn: Utils.dom.getId('close-feedback-modal-btn'),
      feedbackForm: Utils.dom.getId('feedback-form'),

      // Share modal
      shareModal: Utils.dom.getId('share-modal'),
      closeShareModalBtn: Utils.dom.getId('close-share-modal-btn'),
      shareUrl: Utils.dom.getId('share-url'),
      copyUrlBtn: Utils.dom.getId('copy-url-btn'),

      // Confirm modal
      confirmModal: Utils.dom.getId('confirm-modal'),
      confirmTitle: Utils.dom.getId('confirm-title'),
      confirmMessage: Utils.dom.getId('confirm-message'),
      confirmActionBtn: Utils.dom.getId('confirm-action-btn'),
      confirmCancelBtn: Utils.dom.getId('confirm-cancel-btn'),
      closeConfirmModalBtn: Utils.dom.getId('close-confirm-modal-btn'),

      // Overlays
      sidebarOverlay: Utils.dom.getId('sidebar-overlay'),
      modalOverlay: Utils.dom.getId('modal-overlay'),

      // Initial loading
      initialLoading: Utils.dom.getId('initial-loading'),
      loadingProgress: Utils.dom.qs('#initial-loading .loading-progress-value'),
      loadingText: Utils.dom.qs('#initial-loading .loading-progress-text')
    };
  },

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    // Navigation
    this.elements.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const view = link.dataset.view;
        if (view) {
          this.showView(view);
          this.updateNavLinks(view);
        }
      });
    });

    this.elements.menuToggle.addEventListener('click', () => {
      this.elements.mainNav.classList.toggle('active');
    });

    // Dashboard controls
    this.elements.showCompletedBtn.addEventListener('click', () => {
      this.toggleShowCompleted();
    });

    this.elements.gridViewBtn.addEventListener('click', () => {
      this.setViewMode('grid');
    });

    this.elements.listViewBtn.addEventListener('click', () => {
      this.setViewMode('list');
    });

    this.elements.startLearningBtn.addEventListener('click', () => {
      // Get first module and open it
      const modules = ContentLoader.getAllModules();
      if (modules.length > 0) {
        this.openModule(modules[0].id);
      }
    });

    this.elements.viewSyllabusBtn.addEventListener('click', () => {
      // Scroll to modules section
      this.elements.modulesContainer.scrollIntoView({ behavior: 'smooth' });
    });

    // Module view
    this.elements.backToDashboardBtn.addEventListener('click', () => {
      this.showView('dashboard');
    });

    this.elements.markModuleCompleteBtn.addEventListener('click', () => {
      this.toggleModuleComplete();
    });

    this.elements.bookmarkModuleBtn.addEventListener('click', () => {
      this.toggleBookmark('module');
    });

    this.elements.shareModuleBtn.addEventListener('click', () => {
      this.openShareModal('module');
    });

    // Topic view
    this.elements.backToModuleBtn.addEventListener('click', () => {
      if (this.state.currentModuleId) {
        this.openModule(this.state.currentModuleId);
      } else {
        this.showView('dashboard');
      }
    });

    this.elements.markTopicCompleteBtn.addEventListener('click', () => {
      this.toggleTopicComplete();
    });

    this.elements.bookmarkTopicBtn.addEventListener('click', () => {
      this.toggleBookmark('topic');
    });

    this.elements.toggleNotesBtn.addEventListener('click', () => {
      this.toggleNotes();
    });

    this.elements.saveNotesBtn.addEventListener('click', () => {
      this.saveNotes();
    });

    this.elements.notesTextarea.addEventListener('input', () => {
      if (this.userData.settings.autoSaveNotes) {
        this.saveNotes();
      }
    });

    // Profile sidebar
    this.elements.profileButton.addEventListener('click', () => {
      this.toggleSidebar();
    });

    this.elements.closeProfileSidebarBtn.addEventListener('click', () => {
      this.toggleSidebar(false);
    });

    // Settings
    this.elements.fontSizeSelect.addEventListener('change', (e) => {
      this.updateSetting('fontSize', e.target.value);
      this.applyFontSize(e.target.value);
    });

    this.elements.autoSaveNotesCheckbox.addEventListener('change', (e) => {
      this.updateSetting('autoSaveNotes', e.target.checked);
    });

    this.elements.resetProgressBtn.addEventListener('click', () => {
      this.showConfirmModal(
        'Reset Progress',
        'Are you sure you want to reset all your progress? This cannot be undone.',
        () => {
          // Reset user data
          this.userData = Storage.resetUserData();

          // Update UI
          this.updateProgressIndicators();
          this.renderBookmarks();
          this.renderRecentActivity();

          // Show notification
          Utils.notification.toast('Your progress has been reset', 'info');

          // Return to dashboard
          this.showView('dashboard');

          // Close sidebar
          this.toggleSidebar(false);
        }
      );
    });

    this.elements.themeToggle.addEventListener('click', () => {
      this.toggleDarkMode();
    });

    // Search
    this.elements.searchButton.addEventListener('click', () => {
      if (this.elements.searchInput.value.trim().length >= 2) {
        this.performInlineSearch(this.elements.searchInput.value, this.elements.inlineSearchResults);
      } else {
        this.elements.inlineSearchResults.innerHTML = '<p class="empty-message">Enter at least 2 characters to search</p>';
        this.elements.inlineSearchResults.classList.toggle('active');
      }
    });

    this.elements.searchInput.addEventListener('input', () => {
      if (this.elements.searchInput.value.trim().length >= 2) {
        this.performInlineSearch(this.elements.searchInput.value, this.elements.inlineSearchResults);
      } else {
        this.elements.inlineSearchResults.classList.remove('active');
      }
    });

    // Close inline search results when clicking elsewhere
    document.addEventListener('click', (e) => {
      const searchContainer = this.elements.searchInput.closest('.search-container');
      if (searchContainer && !searchContainer.contains(e.target)) {
        this.elements.inlineSearchResults.classList.remove('active');
      }
    });

    this.elements.closeSearchModalBtn.addEventListener('click', () => {
      this.toggleSearchModal(false);
    });

    this.elements.modalSearchBtn.addEventListener('click', () => {
      this.performSearch(this.elements.modalSearchInput.value);
    });

    this.elements.modalSearchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.performSearch(this.elements.modalSearchInput.value);
      }
    });

    // Feedback
    this.elements.feedbackLink.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleFeedbackModal();
    });

    this.elements.closeFeedbackModalBtn.addEventListener('click', () => {
      this.toggleFeedbackModal(false);
    });

    this.elements.feedbackForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Get form data
      const type = document.getElementById('feedback-type').value;
      const message = document.getElementById('feedback-message').value;

      if (!type || !message) {
        Utils.notification.toast('Please fill out all fields', 'warning');
        return;
      }

      // Here you would typically send the feedback to a server
      // For this demo, we'll just show a success message

      // Reset form
      this.elements.feedbackForm.reset();

      // Close modal
      this.toggleFeedbackModal(false);

      // Show success message
      Utils.notification.toast('Thank you for your feedback!', 'success');
    });

    // Share modal
    this.elements.closeShareModalBtn.addEventListener('click', () => {
      this.toggleShareModal(false);
    });

    this.elements.copyUrlBtn.addEventListener('click', async () => {
      const success = await Utils.misc.copyToClipboard(this.elements.shareUrl.value);

      if (success) {
        Utils.notification.toast('Link copied to clipboard', 'success');
      } else {
        Utils.notification.toast('Failed to copy link', 'error');
      }
    });

    // Confirm modal
    this.elements.confirmCancelBtn.addEventListener('click', () => {
      this.toggleConfirmModal(false);
    });

    this.elements.closeConfirmModalBtn.addEventListener('click', () => {
      this.toggleConfirmModal(false);
    });

    this.elements.confirmActionBtn.addEventListener('click', () => {
      if (this.state.confirmCallback) {
        this.state.confirmCallback();
      }
      this.toggleConfirmModal(false);
    });

    // Overlays
    this.elements.sidebarOverlay.addEventListener('click', () => {
      this.toggleSidebar(false);
    });

    this.elements.modalOverlay.addEventListener('click', () => {
      this.toggleSearchModal(false);
      this.toggleFeedbackModal(false);
      this.toggleShareModal(false);
      this.toggleConfirmModal(false);
    });

    // Content loader events
    document.addEventListener('contentloader:statechange', (e) => {
      this.updateLoadingIndicator(e.detail);
    });

    // Handle browser navigation
    window.addEventListener('popstate', (e) => {
      if (e.state && e.state.view) {
        this.handleNavigation(e.state);
      }
    });
  },

  /**
   * Apply user settings from user data
   */
  applyUserSettings() {
    // Apply dark mode
    if (this.userData.settings.darkMode) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
      this.elements.themeToggle.innerHTML = '<i class="fas fa-sun"></i> <span>Light Mode</span>';
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
      this.elements.themeToggle.innerHTML = '<i class="fas fa-moon"></i> <span>Dark Mode</span>';
    }

    // Apply font size
    this.elements.fontSizeSelect.value = this.userData.settings.fontSize;
    this.applyFontSize(this.userData.settings.fontSize);

    // Apply auto-save notes setting
    this.elements.autoSaveNotesCheckbox.checked = this.userData.settings.autoSaveNotes;
  },

  /**
   * Apply font size setting
   * @param {string} size - Font size (small, medium, large)
   */
  applyFontSize(size) {
    const htmlElement = document.documentElement;

    switch (size) {
      case 'small':
        htmlElement.style.fontSize = '14px';
        break;
      case 'medium':
        htmlElement.style.fontSize = '16px';
        break;
      case 'large':
        htmlElement.style.fontSize = '18px';
        break;
      default:
        htmlElement.style.fontSize = '16px';
    }
  },

  /**
   * Toggle dark mode
   */
  toggleDarkMode() {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode', !isDarkMode);

    // Update icon and text
    this.elements.themeToggle.innerHTML = isDarkMode
      ? '<i class="fas fa-sun"></i> <span>Light Mode</span>'
      : '<i class="fas fa-moon"></i> <span>Dark Mode</span>';

    // Update user setting
    this.updateSetting('darkMode', isDarkMode);
  },

  /**
   * Update a user setting
   * @param {string} key - Setting key
   * @param {*} value - Setting value
   */
  updateSetting(key, value) {
    const settings = { [key]: value };
    this.userData = Storage.updateSettings(settings, this.userData);
  },

  /**
   * Show a specific view
   * @param {string} viewName - View name
   */
  showView(viewName) {
    // Hide all views
    Object.values(this.elements.views).forEach(view => {
      view.classList.remove('active');
    });

    // Show requested view
    if (this.elements.views[viewName]) {
      this.elements.views[viewName].classList.add('active');

      // Update state
      this.state.currentView = viewName;

      // Update URL
      this.updateUrl();

      // Scroll to top
      window.scrollTo(0, 0);

      // Update navigation links
      this.updateNavLinks(viewName);

      // On dashboard view, render modules
      if (viewName === 'dashboard') {
        this.renderModules();
      }
    }
  },

  /**
   * Update navigation links active state
   * @param {string} viewName - Current view name
   */
  updateNavLinks(viewName) {
    this.elements.navLinks.forEach(link => {
      if (link.dataset.view === viewName) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  },

  /**
   * Update URL based on current state
   */
  updateUrl() {
    let url = '/';
    let title = CONFIG.app.name;

    switch (this.state.currentView) {
      case 'dashboard':
        url = '/';
        title = CONFIG.app.name;
        break;
      case 'module':
        if (this.state.currentModuleId) {
          url = `/?module=${this.state.currentModuleId}`;
          const module = ContentLoader.getModule(this.state.currentModuleId);
          if (module) {
            title = `${module.title} | ${CONFIG.app.name}`;
          }
        }
        break;
      case 'topic':
        if (this.state.currentModuleId && this.state.currentTopicId) {
          url = `/?module=${this.state.currentModuleId}&topic=${this.state.currentTopicId}`;
          const topic = ContentLoader.getTopic(this.state.currentModuleId, this.state.currentTopicId);
          if (topic) {
            title = `${topic.title} | ${CONFIG.app.name}`;
          }
        }
        break;
      case 'resources':
        url = '/?view=resources';
        title = `Resources | ${CONFIG.app.name}`;
        break;
      case 'about':
        url = '/?view=about';
        title = `About | ${CONFIG.app.name}`;
        break;
    }

    // Update browser URL without reloading
    Utils.url.updateUrl(url, title);
    document.title = title;
  },

  /**
   * Handle browser navigation events
   * @param {Object} state - Navigation state
   */
  handleNavigation(state) {
    if (state.view) {
      this.showView(state.view);

      if (state.moduleId) {
        this.openModule(state.moduleId, false);

        if (state.topicId) {
          this.openTopic(state.moduleId, state.topicId, false);
        }
      }
    } else {
      this.showView('dashboard');
    }
  },

  /**
   * Render modules in dashboard
   */
  renderModules() {
    // Clear container
    Utils.dom.empty(this.elements.modulesContainer);

    // Get all module data organized by phase
    const modulesByPhase = ContentLoader.getModulesByPhase();

    // Render each phase and its modules
    Object.entries(modulesByPhase).forEach(([phaseId, phaseData]) => {
      // Create phase header
      const phaseHeader = Utils.dom.create('div',
        { className: 'phase-header' },
        `<h2>${phaseData.name}</h2>`
      );
      this.elements.modulesContainer.appendChild(phaseHeader);

      // Filter modules if needed
      const modulesToShow = this.state.showCompleted
        ? phaseData.modules
        : phaseData.modules.filter(module => !this.isModuleCompleted(module.id));

      // Create modules for this phase
      modulesToShow.forEach(module => {
        const moduleCard = this.createModuleCard(module, phaseData.name);
        this.elements.modulesContainer.appendChild(moduleCard);
      });
    });
  },

  /**
   * Create a module card element
   * @param {Object} module - Module data
   * @param {string} phaseName - Phase name
   * @returns {HTMLElement} - Module card element
   */
  createModuleCard(module, phaseName) {
    // Determine module status
    const isCompleted = this.isModuleCompleted(module.id);

    // Calculate progress
    const { completedCount, totalCount, progress } = this.calculateModuleProgress(module);

    let status = 'not-started';
    let statusLabel = 'Not Started';

    if (isCompleted) {
      status = 'completed';
      statusLabel = 'Completed';
    } else if (progress > 0) {
      status = 'in-progress';
      statusLabel = 'In Progress';
    }

    // Extract module number for display (assuming format like "module-1")
    const moduleNum = module.id.split('-')[1] || '';

    // Create card element
    const card = Utils.dom.create('div',
      {
        className: `module-card ${status}`,
        dataset: { id: module.id }
      }
    );

    card.innerHTML = `
      <div class="module-card-header">
        <div class="module-number">${moduleNum}</div>
        <div class="module-status status-${status}">${statusLabel}</div>
      </div>
      <div class="module-card-body">
        <h3 class="module-title">${module.title}</h3>
        <p class="module-description">${module.description}</p>
        <div class="module-meta">
          <div class="module-topics">${module.topics?.length || 0} topics</div>
          <div class="module-phase">${phaseName}</div>
        </div>
      </div>
      <div class="module-card-footer">
        <div class="module-progress">
          <div class="progress-bar">
            <div class="progress-value" style="width: ${progress}%"></div>
          </div>
          <span class="progress-percentage">${progress}%</span>
        </div>
        <button class="btn btn-primary btn-sm module-start-btn">
          ${progress > 0 ? 'Continue' : 'Start'}
        </button>
      </div>
    `;

    // Add event listener to open module
    card.addEventListener('click', () => {
      this.openModule(module.id);
    });

    // Stop propagation for start button to prevent double clicks
    const startBtn = card.querySelector('.module-start-btn');
    startBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.openModule(module.id);
    });

    return card;
  },

  /**
   * Calculate module progress
   * @param {Object} module - Module data
   * @returns {Object} - Progress information
   */
  calculateModuleProgress(module) {
    let totalCount = 0;
    let completedCount = 0;

    // Count subtopics across all topics
    if (module.topics && module.topics.length > 0) {
      module.topics.forEach(topic => {
        if (topic.subtopics && topic.subtopics.length > 0) {
          topic.subtopics.forEach(subtopic => {
            totalCount++;
            if (this.isTopicCompleted(subtopic.id)) {
              completedCount++;
            }
          });
        }
      });
    }

    // Calculate percentage
    const progress = totalCount > 0
      ? Math.round((completedCount / totalCount) * 100)
      : 0;

    return {
      completedCount,
      totalCount,
      progress
    };
  },

  /**
   * Open a module
   * @param {string} moduleId - Module ID
   * @param {boolean} updateNavigation - Whether to update browser navigation
   */
  openModule: async function (moduleId, updateNavigation = true) {
    const module = ContentLoader.getModule(moduleId);

    if (!module) return;

    // Update state
    this.state.currentModuleId = moduleId;
    this.state.currentTopicId = null;

    // Show module view
    this.showView('module');

    // Update UI elements
    this.elements.moduleTitle.textContent = module.title;
    this.elements.modulePhase.textContent = ContentLoader.getPhaseNameForModule(moduleId);
    this.elements.moduleEstimatedTime.textContent = module.estimatedTime || 'N/A';
    this.elements.moduleDescription.textContent = module.description || '';

    // Set bookmark button state
    const isBookmarked = this.isBookmarked('module', moduleId);
    this.elements.bookmarkModuleBtn.innerHTML = isBookmarked
      ? '<i class="fas fa-bookmark"></i> Bookmarked'
      : '<i class="far fa-bookmark"></i> Bookmark';

    // Render topics
    this.renderModuleTopics(module);

    // Render resources
    this.renderModuleResources(module);

    // Update navigation buttons
    this.updateModuleNavigation(moduleId);

    // Update complete button
    const isCompleted = this.isModuleCompleted(moduleId);
    this.elements.markModuleCompleteBtn.textContent = isCompleted
      ? 'Mark as Incomplete'
      : 'Mark as Complete';

    // Add to recent activity
    this.addActivity('module', moduleId, module.title);

    // Update URL if needed
    if (updateNavigation) {
      this.updateUrl();
    }

    // Add a small delay to ensure all rendering is complete
    setTimeout(() => {
      // If there's only one topic, expand it automatically
      const topicItems = document.querySelectorAll('.topic-item');
      if (topicItems.length === 1) {
        const topicContent = topicItems[0].querySelector('.topic-content');
        const toggleIcon = topicItems[0].querySelector('.topic-toggle i');

        if (topicContent) {
          topicContent.classList.add('expanded');
        }
        if (toggleIcon) {
          toggleIcon.classList.remove('fa-chevron-down');
          toggleIcon.classList.add('fa-chevron-up');
        }
      }
    }, 100);
  },

  /**
   * Render module topics
   * @param {Object} module - Module data
   */
  renderModuleTopics(module) {
    // Clear container
    Utils.dom.empty(this.elements.moduleTopics);

    if (!module.topics || module.topics.length === 0) {
      this.elements.moduleTopics.innerHTML = '<p>No topics available for this module yet.</p>';
      return;
    }

    module.topics.forEach(topic => {
      const topicElement = this.createTopicElement(topic, module.id);
      this.elements.moduleTopics.appendChild(topicElement);
    });
  },

  /**
   * Create a topic element for module view
   * @param {Object} topic - Topic data
   * @param {string} moduleId - Parent module ID
   * @returns {HTMLElement} - Topic element
   */
  createTopicElement(topic, moduleId) {
    // Calculate completion status
    const subtopicsTotal = topic.subtopics?.length || 0;
    const subtopicsCompleted = topic.subtopics
      ? topic.subtopics.filter(s => this.isTopicCompleted(s.id)).length
      : 0;
    const isCompleted = subtopicsTotal > 0 && subtopicsCompleted === subtopicsTotal;

    // Create element
    const topicElement = Utils.dom.create('div',
      {
        className: 'topic-item',
        dataset: { id: topic.id }
      }
    );

    topicElement.innerHTML = `
      <div class="topic-header">
        <h4 class="topic-title">
          ${isCompleted ? '<i class="fas fa-check-circle" style="color: var(--success);"></i> ' : ''}
          ${topic.title}
        </h4>
        <button class="topic-toggle">
          <i class="fas fa-chevron-down"></i>
        </button>
      </div>
      <div class="topic-content">
        <p>${topic.description || ''}</p>
        <div class="subtopics-progress">
          <div class="progress-text">
            <span>${subtopicsCompleted}/${subtopicsTotal}</span> subtopics completed
          </div>
          <div class="progress-bar">
            <div class="progress-value" style="width: ${subtopicsTotal > 0 ? (subtopicsCompleted / subtopicsTotal * 100) : 0}%"></div>
          </div>
        </div>
        <ul class="subtopics-list">
          ${this.renderSubtopicsList(topic.subtopics)}
        </ul>
      </div>
    `;

    // Add event listener to toggle topic content
    const toggleBtn = topicElement.querySelector('.topic-toggle');
    const topicContent = topicElement.querySelector('.topic-content');
    const toggleIcon = topicElement.querySelector('.topic-toggle i');

    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();

      topicContent.classList.toggle('expanded');
      toggleIcon.classList.toggle('fa-chevron-down');
      toggleIcon.classList.toggle('fa-chevron-up');
    });

    // Add event listener to open topic
    topicElement.addEventListener('click', (e) => {
      // Don't open if clicking on toggle button or subtopic
      if (e.target.closest('.topic-toggle') || e.target.closest('.subtopic-item')) {
        return;
      }

      this.openTopic(moduleId, topic.id);
    });

    return topicElement;
  },

  /**
   * Render subtopics list
   * @param {Object[]} subtopics - Subtopic data
   * @returns {string} - HTML for subtopics list
   */
  renderSubtopicsList(subtopics) {
    if (!subtopics || subtopics.length === 0) {
      return '<li class="empty-message">No subtopics available</li>';
    }

    return subtopics.map(subtopic => {
      const isCompleted = this.isTopicCompleted(subtopic.id);

      return `
        <li class="subtopic-item" data-id="${subtopic.id}">
          <span class="subtopic-status ${isCompleted ? 'completed' : ''}">
            <i class="fas ${isCompleted ? 'fa-check-circle' : 'fa-circle'}"></i>
          </span>
          <span class="subtopic-title">${subtopic.title}</span>
        </li>
      `;
    }).join('');
  },

  /**
   * Render module resources
   * @param {Object} module - Module data
   */
  renderModuleResources(module) {
    // Hide container if no resources
    if (!module.resources || module.resources.length === 0) {
      this.elements.moduleResourcesContainer.style.display = 'none';
      return;
    }

    // Show container and clear resources list
    this.elements.moduleResourcesContainer.style.display = 'block';
    Utils.dom.empty(this.elements.moduleResources);

    // Render resources
    module.resources.forEach(resource => {
      const resourceItem = Utils.dom.create('li', { className: 'resource-item' });

      // Choose icon based on resource type
      let iconClass = 'fa-link';
      switch (resource.type) {
        case 'documentation': iconClass = 'fa-book'; break;
        case 'video': iconClass = 'fa-video'; break;
        case 'guide': iconClass = 'fa-file-alt'; break;
        case 'tool': iconClass = 'fa-tools'; break;
        case 'project': iconClass = 'fa-folder-open'; break;
      }

      resourceItem.innerHTML = `
        <div class="resource-icon">
          <i class="fas ${iconClass}"></i>
        </div>
        <div class="resource-content">
          <a href="${resource.url}" target="_blank" rel="noopener noreferrer">
            ${resource.title}
          </a>
        </div>
      `;

      this.elements.moduleResources.appendChild(resourceItem);
    });
  },

  /**
   * Update module navigation buttons
   * @param {string} moduleId - Current module ID
   */
  updateModuleNavigation(moduleId) {
    const prevModule = ContentLoader.getPreviousModule(moduleId);
    const nextModule = ContentLoader.getNextModule(moduleId);

    // Update previous button
    if (prevModule) {
      this.elements.prevModuleBtn.disabled = false;
      this.elements.prevModuleBtn.onclick = () => this.openModule(prevModule.id);
    } else {
      this.elements.prevModuleBtn.disabled = true;
      this.elements.prevModuleBtn.onclick = null;
    }

    // Update next button
    if (nextModule) {
      this.elements.nextModuleBtn.disabled = false;
      this.elements.nextModuleBtn.onclick = () => this.openModule(nextModule.id);
    } else {
      this.elements.nextModuleBtn.disabled = true;
      this.elements.nextModuleBtn.onclick = null;
    }
  },

  /**
   * Open a topic
   * @param {string} moduleId - Module ID
   * @param {string} topicId - Topic ID
   * @param {boolean} updateNavigation - Whether to update browser navigation
   */
  async openTopic(moduleId, topicId, updateNavigation = true) {
    const module = ContentLoader.getModule(moduleId);
    const topic = module?.topics?.find(t => t.id === topicId);

    if (!module || !topic) return;

    // Update state
    this.state.currentModuleId = moduleId;
    this.state.currentTopicId = topicId;

    // Show topic view
    this.showView('topic');

    // Update UI elements
    this.elements.topicTitle.textContent = topic.title;
    this.elements.topicModuleTitleLink.textContent = module.title;
    this.elements.topicModuleTitleLink.onclick = (e) => {
      e.preventDefault();
      this.openModule(moduleId);
    };

    // Show loading indicator
    Utils.dom.showLoader(this.elements.topicContent, 'Loading content...');

    // Load topic content
    if (topic.contentPath) {
      const content = await ContentLoader.loadTopicContent(topic.contentPath);
      this.elements.topicContent.innerHTML = content;

      // Highlight code blocks
      Utils.string.highlightCode(this.elements.topicContent);
      // Make it visible
      this.elements.topicContent.classList.add('expanded');

    } else {
      // Show placeholder if no content
      this.elements.topicContent.innerHTML = `
        <div class="content-placeholder">
          <h3>Content Coming Soon</h3>
          <p>The content for this topic is currently under development.</p>
          <p>Please check back later for updates.</p>
        </div>
      `;
    }

    // Set bookmark button state
    const isBookmarked = this.isBookmarked('topic', topicId);
    this.elements.bookmarkTopicBtn.innerHTML = isBookmarked
      ? '<i class="fas fa-bookmark"></i> Bookmarked'
      : '<i class="far fa-bookmark"></i> Bookmark';

    // Update subtopics section
    this.renderSubtopicsSection(topic);

    // Update navigation buttons
    this.updateTopicNavigation(moduleId, topicId);

    // Load notes
    this.loadNotes(topicId);

    // Update mark complete button
    this.updateTopicCompleteButton(topic);

    // Add to recent activity
    this.addActivity('topic', topicId, topic.title, moduleId);

    // Update URL if needed
    if (updateNavigation) {
      this.updateUrl();
    }
  },

  /**
   * Render subtopics section
   * @param {Object} topic - Topic data
   */
  /**
 * Render subtopics section
 * @param {Object} topic - Topic data
 */
  renderSubtopicsSection(topic) {
    // Hide section if no subtopics
    if (!topic.subtopics || topic.subtopics.length === 0) {
      this.elements.subtopicsSection.style.display = 'none';
      return;
    }

    // Show section
    this.elements.subtopicsSection.style.display = 'block';

    // Clear container
    Utils.dom.empty(this.elements.subtopicsList);

    // Count completions
    const total = topic.subtopics.length;
    const completed = topic.subtopics.filter(s => this.isTopicCompleted(s.id)).length;

    // Update progress bar & count
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    this.elements.subtopicsProgressBar.style.width = `${progress}%`;
    this.elements.subtopicsCompletedCount.textContent = `${completed}/${total}`;

    // Render each subtopic
    topic.subtopics.forEach(subtopic => {
      const isCompleted = this.isTopicCompleted(subtopic.id);

      const subtopicItem = Utils.dom.create('div',
        { className: 'subtopic-item' },
        `
        <div class="subtopic-checkbox">
          <input type="checkbox" id="subtopic-${subtopic.id}"
            ${isCompleted ? 'checked' : ''}>
          <label for="subtopic-${subtopic.id}"></label>
        </div>
        <div class="subtopic-content">
          <span class="subtopic-title">${subtopic.title}</span>
        </div>
      `
      );

      // Checkbox handler
      const checkbox = subtopicItem.querySelector(`#subtopic-${subtopic.id}`);
      checkbox.addEventListener('change', e => {
        if (e.target.checked) {
          this.userData = Storage.completeTopic(subtopic.id, this.userData);
        } else {
          this.userData = Storage.uncompleteTopic(subtopic.id, this.userData);
        }
        // Refresh UI
        this.updateTopicCompleteButton(topic);
        this.updateProgressIndicators();
      });

      // ▶ Wire up title click to scroll into view
      const titleEl = subtopicItem.querySelector('.subtopic-title');
      titleEl.style.cursor = 'pointer';
      titleEl.addEventListener('click', () => {
        // Generate slug from subtopic title
        const slug = subtopic.title
          .toLowerCase()
          .replace(/[^\w]+/g, '-')
          .replace(/^-+|-+$/g, '');

        const target = this.elements.topicContent.querySelector(`#${slug}`);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          target.classList.add('highlight');
          setTimeout(() => target.classList.remove('highlight'), 1500);
        }
      });

      // Append to list
      this.elements.subtopicsList.appendChild(subtopicItem);
    });
  },  


  /**
   * Update topic navigation buttons
   * @param {string} moduleId - Current module ID
   * @param {string} topicId - Current topic ID
   */
  updateTopicNavigation(moduleId, topicId) {
    const prevTopic = ContentLoader.getPreviousTopic(moduleId, topicId);
    const nextTopic = ContentLoader.getNextTopic(moduleId, topicId);

    // Update previous button
    if (prevTopic) {
      this.elements.prevTopicBtn.disabled = false;
      this.elements.prevTopicBtn.onclick = () =>
        this.openTopic(prevTopic.moduleId || moduleId, prevTopic.id);
    } else {
      this.elements.prevTopicBtn.disabled = true;
      this.elements.prevTopicBtn.onclick = null;
    }

    // Update next button
    if (nextTopic) {
      this.elements.nextTopicBtn.disabled = false;
      this.elements.nextTopicBtn.onclick = () =>
        this.openTopic(nextTopic.moduleId || moduleId, nextTopic.id);
    } else {
      this.elements.nextTopicBtn.disabled = true;
      this.elements.nextTopicBtn.onclick = null;
    }
  },

  /**
   * Update topic complete button based on subtopics completion state
   * @param {Object} topic - Topic data
   */
  updateTopicCompleteButton(topic) {
    if (!topic.subtopics || topic.subtopics.length === 0) {
      this.elements.markTopicCompleteBtn.style.display = 'none';
      return;
    }

    this.elements.markTopicCompleteBtn.style.display = 'block';

    // Check if all subtopics are completed
    const allCompleted = topic.subtopics.every(
      subtopic => this.isTopicCompleted(subtopic.id)
    );

    this.elements.markTopicCompleteBtn.textContent = allCompleted
      ? 'Mark All as Incomplete'
      : 'Mark All as Complete';
  },

  /**
   * Toggle show/hide completed modules
   */
  toggleShowCompleted() {
    this.state.showCompleted = !this.state.showCompleted;

    // Update button text
    this.elements.showCompletedBtn.textContent = this.state.showCompleted
      ? 'Hide Completed'
      : 'Show Completed';

    // Re-render modules
    this.renderModules();
  },

  /**
   * Set view mode (grid/list)
   * @param {string} mode - View mode (grid/list)
   */
  setViewMode(mode) {
    // Update state
    this.state.viewMode = mode;

    // Update container class
    if (mode === 'grid') {
      this.elements.modulesContainer.classList.add('grid-view');
      this.elements.modulesContainer.classList.remove('list-view');
      this.elements.gridViewBtn.classList.add('active');
      this.elements.listViewBtn.classList.remove('active');
    } else {
      this.elements.modulesContainer.classList.add('list-view');
      this.elements.modulesContainer.classList.remove('grid-view');
      this.elements.gridViewBtn.classList.remove('active');
      this.elements.listViewBtn.classList.add('active');
    }

    // Re-render modules to update phase display
    this.renderModules();
  },

  /**
   * Toggle module completion
   */
  toggleModuleComplete() {
    if (!this.state.currentModuleId) return;

    const moduleId = this.state.currentModuleId;
    const isCompleted = this.isModuleCompleted(moduleId);

    if (isCompleted) {
      // Mark as incomplete
      this.userData = Storage.uncompleteModule(moduleId, this.userData);
      this.elements.markModuleCompleteBtn.textContent = 'Mark as Complete';
    } else {
      // Mark as complete
      this.userData = Storage.completeModule(moduleId, this.userData);
      this.elements.markModuleCompleteBtn.textContent = 'Mark as Incomplete';

      // Show success message
      Utils.notification.toast('Module marked as complete!', 'success');
    }

    // Update progress indicators
    this.updateProgressIndicators();
  },

  /**
   * Toggle topic completion (all subtopics)
   */
  toggleTopicComplete() {
    if (!this.state.currentModuleId || !this.state.currentTopicId) return;

    const moduleId = this.state.currentModuleId;
    const topicId = this.state.currentTopicId;

    const module = ContentLoader.getModule(moduleId);
    const topic = module?.topics?.find(t => t.id === topicId);

    if (!module || !topic || !topic.subtopics) return;

    // Check if all subtopics are completed
    const allCompleted = topic.subtopics.every(
      subtopic => this.isTopicCompleted(subtopic.id)
    );

    if (allCompleted) {
      // Mark all as incomplete
      this.userData = Storage.uncompleteMultipleTopics(
        topic.subtopics.map(s => s.id),
        this.userData
      );
      this.elements.markTopicCompleteBtn.textContent = 'Mark All as Complete';
    } else {
      // Mark all as complete
      this.userData = Storage.completeMultipleTopics(
        topic.subtopics.map(s => s.id),
        this.userData
      );
      this.elements.markTopicCompleteBtn.textContent = 'Mark All as Incomplete';

      // Show success message
      Utils.notification.toast('All subtopics marked as complete!', 'success');
    }

    // Update UI
    this.renderSubtopicsSection(topic);
    this.updateProgressIndicators();
  },

  /**
   * Check if a module is completed
   * @param {string} moduleId - Module ID
   * @returns {boolean} - Whether module is completed
   */
  isModuleCompleted(moduleId) {
    return this.userData.completedModules.includes(moduleId);
  },

  /**
   * Check if a topic is completed
   * @param {string} topicId - Topic ID
   * @returns {boolean} - Whether topic is completed
   */
  isTopicCompleted(topicId) {
    return this.userData.completedTopics.includes(topicId);
  },

  /**
   * Update progress indicators across the UI
   */
  updateProgressIndicators() {
    // Get all modules
    const modules = ContentLoader.getAllModules();

    // Count completed modules
    const completedModules = this.userData.completedModules.length;
    const totalModules = modules.length;

    // Count completed topics
    let completedTopics = 0;
    let totalTopics = 0;

    modules.forEach(module => {
      if (module.topics) {
        module.topics.forEach(topic => {
          if (topic.subtopics) {
            topic.subtopics.forEach(subtopic => {
              totalTopics++;
              if (this.isTopicCompleted(subtopic.id)) {
                completedTopics++;
              }
            });
          }
        });
      }
    });

    // Calculate overall progress percentage
    const overallProgress = totalTopics > 0
      ? Math.round((completedTopics / totalTopics) * 100)
      : 0;

    // Update dashboard indicators
    this.elements.overallProgressBar.style.width = `${overallProgress}%`;
    this.elements.overallProgressText.textContent = `${overallProgress}%`;

    this.elements.modulesCompletedCount.textContent = `${completedModules}/${totalModules}`;
    this.elements.topicsCompletedCount.textContent = `${completedTopics}/${totalTopics}`;

    // Estimated time spent (very rough estimate - 10 minutes per completed topic)
    const timeSpentHours = Math.round(completedTopics * 10 / 60);
    this.elements.timeSpent.textContent = `${timeSpentHours}h`;

    // Update sidebar progress
    this.elements.sidebarProgressBar.style.width = `${overallProgress}%`;
    this.elements.sidebarProgressText.textContent = `${overallProgress}% Complete`;
  },

  /**
   * Toggle bookmark for current module/topic
   * @param {string} type - Bookmark type (module/topic)
   */
  toggleBookmark(type) {
    if ((type === 'module' && !this.state.currentModuleId) ||
      (type === 'topic' && !this.state.currentTopicId)) {
      return;
    }

    const id = type === 'module' ? this.state.currentModuleId : this.state.currentTopicId;
    const isBookmarked = this.isBookmarked(type, id);

    if (isBookmarked) {
      // Remove bookmark
      this.userData = Storage.removeBookmark(type, id, this.userData);

      // Update button
      const bookmarkBtn = type === 'module'
        ? this.elements.bookmarkModuleBtn
        : this.elements.bookmarkTopicBtn;

      bookmarkBtn.innerHTML = '<i class="far fa-bookmark"></i> Bookmark';

      // Show notification
      Utils.notification.toast('Bookmark removed', 'info');
    } else {
      // Get item data
      let item;
      let moduleTitle;

      if (type === 'module') {
        item = ContentLoader.getModule(id);
        moduleTitle = item?.title;
      } else {
        const module = ContentLoader.getModule(this.state.currentModuleId);
        item = module?.topics?.find(t => t.id === id);
        moduleTitle = module?.title;
      }

      if (!item) return;

      // Add bookmark
      this.userData = Storage.addBookmark({
        type,
        id,
        title: item.title,
        moduleId: type === 'module' ? id : this.state.currentModuleId,
        moduleTitle: type === 'module' ? item.title : moduleTitle
      }, this.userData);

      // Update button
      const bookmarkBtn = type === 'module'
        ? this.elements.bookmarkModuleBtn
        : this.elements.bookmarkTopicBtn;

      bookmarkBtn.innerHTML = '<i class="fas fa-bookmark"></i> Bookmarked';

      // Show notification
      Utils.notification.toast('Bookmark added', 'success');
    }

    // Update bookmarks list
    this.renderBookmarks();
  },

  /**
   * Check if an item is bookmarked
   * @param {string} type - Bookmark type
   * @param {string} id - Item ID
   * @returns {boolean} - Whether item is bookmarked
   */
  isBookmarked(type, id) {
    return this.userData.bookmarks.some(
      bookmark => bookmark.type === type && bookmark.id === id
    );
  },

  /**
   * Render bookmarks in sidebar
   */
  renderBookmarks() {
    // Clear container
    Utils.dom.empty(this.elements.bookmarksList);

    if (this.userData.bookmarks.length === 0) {
      this.elements.bookmarksList.innerHTML = '<li class="empty-message">No bookmarks yet</li>';
      return;
    }

    // Sort by most recent first
    const sortedBookmarks = [...this.userData.bookmarks].sort(
      (a, b) => (b.timestamp || 0) - (a.timestamp || 0)
    );

    // Render bookmarks
    sortedBookmarks.forEach(bookmark => {
      const bookmarkItem = Utils.dom.create('li', { className: 'bookmark-item' });

      bookmarkItem.innerHTML = `
        <div class="bookmark-icon">
          <i class="fas ${bookmark.type === 'module' ? 'fa-book' : 'fa-file-alt'}"></i>
        </div>
        <div class="bookmark-content">
          <div class="bookmark-title">${bookmark.title}</div>
          <div class="bookmark-module">${bookmark.type === 'module' ? 'Module' : `From: ${bookmark.moduleTitle || 'Unknown'}`}</div>
        </div>
      `;

      // Add click event
      bookmarkItem.addEventListener('click', () => {
        if (bookmark.type === 'module') {
          this.openModule(bookmark.id);
        } else if (bookmark.type === 'topic') {
          this.openTopic(bookmark.moduleId, bookmark.id);
        }

        // Close sidebar on mobile
        if (window.innerWidth < 768) {
          this.toggleSidebar(false);
        }
      });

      this.elements.bookmarksList.appendChild(bookmarkItem);
    });
  },

  /**
   * Add activity to recent activity list
   * @param {string} type - Activity type (module/topic)
   * @param {string} id - Item ID
   * @param {string} title - Item title
   * @param {string} moduleId - Module ID (for topics)
   */
  addActivity(type, id, title, moduleId = null) {
    // Create activity object
    const activity = {
      type,
      id,
      title,
      moduleId,
      timestamp: Date.now()
    };

    // Add to storage
    this.userData = Storage.addActivity(activity, this.userData);

    // Update UI
    this.renderRecentActivity();
  },

  /**
   * Render recent activity in sidebar
   */
  renderRecentActivity() {
    // Clear container
    Utils.dom.empty(this.elements.activityList);

    if (!this.userData.activities || this.userData.activities.length === 0) {
      this.elements.activityList.innerHTML = '<li class="empty-message">No recent activity</li>';
      return;
    }

    // Render activities
    this.userData.activities.forEach(activity => {
      const activityItem = Utils.dom.create('li', { className: 'activity-item' });

      const timeAgo = Utils.date.relative(activity.timestamp);

      activityItem.innerHTML = `
        <div class="activity-icon">
          <i class="fas ${activity.type === 'module' ? 'fa-book' : 'fa-file-alt'}"></i>
        </div>
        <div class="activity-content">
          <div class="activity-title">${activity.title}</div>
          <div class="activity-time">${timeAgo}</div>
        </div>
      `;

      // Add click event
      activityItem.addEventListener('click', () => {
        if (activity.type === 'module') {
          this.openModule(activity.id);
        } else if (activity.type === 'topic' && activity.moduleId) {
          this.openTopic(activity.moduleId, activity.id);
        }

        // Close sidebar on mobile
        if (window.innerWidth < 768) {
          this.toggleSidebar(false);
        }
      });

      this.elements.activityList.appendChild(activityItem);
    });
  },

  /**
   * Toggle sidebar
   * @param {boolean|undefined} force - Force state (optional)
   */
  toggleSidebar(force) {
    const isOpen = force !== undefined ? force : !this.state.sidebarOpen;

    // Update state
    this.state.sidebarOpen = isOpen;

    // Update UI
    this.elements.profileSidebar.classList.toggle('active', isOpen);
    this.elements.sidebarOverlay.classList.toggle('active', isOpen);
  },

  /**
   * Toggle search modal
   * @param {boolean|undefined} force - Force state (optional)
   */
  toggleSearchModal(force) {
    const isOpen = force !== undefined ? force : !this.state.searchModalOpen;

    // Update state
    this.state.searchModalOpen = isOpen;

    // Update UI
    this.elements.searchModal.classList.toggle('active', isOpen);
    this.elements.modalOverlay.classList.toggle('active', isOpen);

    if (isOpen) {
      // Focus search input
      this.elements.modalSearchInput.focus();

      // Copy search input value if any
      if (this.elements.searchInput.value) {
        this.elements.modalSearchInput.value = this.elements.searchInput.value;
        this.performSearch(this.elements.modalSearchInput.value);
      }
    }
  },

  /**
   * Perform search for modal
   * @param {string} query - Search query
   */
  performSearch(query) {
    if (!query || query.trim().length < 2) {
      this.elements.searchResults.innerHTML = '<p class="empty-message">Enter at least 2 characters to search</p>';
      return;
    }

    // Get search results
    const results = ContentLoader.search(query);

    // Clear results container
    Utils.dom.empty(this.elements.searchResults);

    if (results.length === 0) {
      this.elements.searchResults.innerHTML = '<p class="empty-message">No results found</p>';
      return;
    }

    // Render results
    results.forEach(result => {
      const resultItem = Utils.dom.create('div', { className: 'search-result-item' });

      resultItem.innerHTML = `
        <div class="result-title">
          <i class="fas ${result.type === 'module' ? 'fa-book' : result.type === 'topic' ? 'fa-file-alt' : 'fa-list-ul'}"></i>
          ${result.title}
        </div>
        ${result.context ? `<div class="result-context">${Utils.string.truncate(result.context, 100)}</div>` : ''}
        <div class="result-path">${result.phase}${result.type !== 'module' ? ` > ${ContentLoader.getModule(result.moduleId)?.title || ''}` : ''}</div>
      `;

      // Add click event
      resultItem.addEventListener('click', () => {
        if (result.type === 'module') {
          this.openModule(result.id);
        } else if (result.type === 'topic') {
          this.openTopic(result.moduleId, result.id);
        } else if (result.type === 'subtopic') {
          this.openTopic(result.moduleId, result.topicId);
        }

        // Close search modal
        this.toggleSearchModal(false);
      });

      this.elements.searchResults.appendChild(resultItem);
    });
  },

  /**
    * Perform inline search (continued)
    * @param {string} query - Search query
    * @param {HTMLElement} resultsContainer - Container for results
    */
  performInlineSearch(query, resultsContainer) {
    if (!query || query.trim().length < 2) {
      resultsContainer.innerHTML = '<p class="empty-message">Enter at least 2 characters to search</p>';
      resultsContainer.classList.add('active');
      return;
    }

    // Get search results
    const results = ContentLoader.search(query);

    // Clear results container
    resultsContainer.innerHTML = '';

    if (results.length === 0) {
      resultsContainer.innerHTML = '<p class="empty-message">No results found</p>';
      resultsContainer.classList.add('active');
      return;
    }

    // Render limited results
    const limitedResults = results.slice(0, 6);
    limitedResults.forEach(result => {
      const resultItem = document.createElement('div');
      resultItem.className = 'search-result-item';

      resultItem.innerHTML = `
        <div class="result-title">
          <i class="fas ${result.type === 'module' ? 'fa-book' : result.type === 'topic' ? 'fa-file-alt' : 'fa-list-ul'}"></i>
          ${result.title}
        </div>
        ${result.context ? `<div class="result-context">${Utils.string.truncate(result.context, 60)}</div>` : ''}
        <div class="result-path">${result.phase}${result.type !== 'module' ? ` > ${ContentLoader.getModule(result.moduleId)?.title || ''}` : ''}</div>
      `;

      // Add click event
      resultItem.addEventListener('click', () => {
        if (result.type === 'module') {
          this.openModule(result.id);
        } else if (result.type === 'topic') {
          this.openTopic(result.moduleId, result.id);
        } else if (result.type === 'subtopic') {
          this.openTopic(result.moduleId, result.topicId);
        }

        // Hide search results
        resultsContainer.classList.remove('active');
      });

      resultsContainer.appendChild(resultItem);
    });

    // Add "See all results" if there are more
    if (results.length > 6) {
      const seeAll = document.createElement('div');
      seeAll.className = 'search-result-item';
      seeAll.innerHTML = `
        <div class="result-title" style="justify-content: center; color: var(--primary);">
          <i class="fas fa-search"></i> See all ${results.length} results
        </div>
      `;

      seeAll.addEventListener('click', () => {
        // Open the modal search for all results
        this.toggleSearchModal(true);
        document.getElementById('modal-search-input').value = query;
        this.performSearch(query);

        // Hide inline results
        resultsContainer.classList.remove('active');
      });

      resultsContainer.appendChild(seeAll);
    }

    // Show results container
    resultsContainer.classList.add('active');
  },

  /**
   * Toggle feedback modal
   * @param {boolean|undefined} force - Force state (optional)
   */
  toggleFeedbackModal(force) {
    const isOpen = force !== undefined ? force : !this.state.feedbackModalOpen;

    // Update state
    this.state.feedbackModalOpen = isOpen;

    // Update UI
    this.elements.feedbackModal.classList.toggle('active', isOpen);
    this.elements.modalOverlay.classList.toggle('active', isOpen);
  },

  /**
   * Toggle share modal
   * @param {boolean|undefined} force - Force state (optional)
   */
  toggleShareModal(force) {
    const isOpen = force !== undefined ? force : !this.state.shareModalOpen;

    // Update state
    this.state.shareModalOpen = isOpen;

    // Update UI
    this.elements.shareModal.classList.toggle('active', isOpen);
    this.elements.modalOverlay.classList.toggle('active', isOpen);

    if (isOpen) {
      // Generate share URL
      let shareUrl = window.location.origin + '/';

      if (this.state.currentView === 'module' && this.state.currentModuleId) {
        shareUrl += `?module=${this.state.currentModuleId}`;
      } else if (this.state.currentView === 'topic' && this.state.currentModuleId && this.state.currentTopicId) {
        shareUrl += `?module=${this.state.currentModuleId}&topic=${this.state.currentTopicId}`;
      }

      this.elements.shareUrl.value = shareUrl;
      this.elements.shareUrl.select();
    }
  },

  /**
   * Show confirm modal
   * @param {string} title - Modal title
   * @param {string} message - Modal message
   * @param {Function} callback - Confirmation callback
   */
  showConfirmModal(title, message, callback) {
    // Set content
    this.elements.confirmTitle.textContent = title;
    this.elements.confirmMessage.textContent = message;

    // Set callback
    this.state.confirmCallback = callback;

    // Show modal
    this.toggleConfirmModal(true);
  },

  /**
   * Toggle confirm modal
   * @param {boolean|undefined} force - Force state (optional)
   */
  toggleConfirmModal(force) {
    const isOpen = force !== undefined ? force : !this.state.confirmModalOpen;

    // Update state
    this.state.confirmModalOpen = isOpen;

    // Update UI
    this.elements.confirmModal.classList.toggle('active', isOpen);
    this.elements.modalOverlay.classList.toggle('active', isOpen);

    // Clear callback if closing
    if (!isOpen) {
      this.state.confirmCallback = null;
    }
  },

  /**
   * Toggle notes panel
   */
  toggleNotes() {
    this.state.notesOpen = !this.state.notesOpen;

    // Update UI
    this.elements.notesPanel.classList.toggle('active', this.state.notesOpen);

    // Update button text
    this.elements.toggleNotesBtn.innerHTML = this.state.notesOpen
      ? '<i class="far fa-sticky-note"></i> Hide Notes'
      : '<i class="far fa-sticky-note"></i> Notes';
  },

  /**
   * Load notes for current topic
   * @param {string} topicId - Topic ID
   */
  loadNotes(topicId) {
    const notes = this.userData.notes[topicId] || '';
    this.elements.notesTextarea.value = notes;
  },

  /**
   * Save notes for current topic
   */
  saveNotes() {
    if (!this.state.currentTopicId) return;

    const notes = this.elements.notesTextarea.value;
    this.userData = Storage.saveNote(this.state.currentTopicId, notes, this.userData);

    // Show notification if manual save
    if (!this.userData.settings.autoSaveNotes) {
      Utils.notification.toast('Notes saved', 'success');
    }
  },

  /**
   * Update loading indicator
   * @param {Object} loadingState - Loading state
   */
  updateLoadingIndicator(loadingState) {
    if (!this.elements.initialLoading) return;

    const { state, progress, total, message } = loadingState;

    // Update progress bar
    const progressPercent = total > 0 ? Math.round((progress / total) * 100) : 0;
    this.elements.loadingProgress.style.width = `${progressPercent}%`;

    // Update text
    this.elements.loadingText.textContent = message;

    // Hide loading screen when complete
    if (state === 'complete') {
      console.log("Loading complete - hiding loading screen");
      // Make sure the loading screen is hidden
      this.elements.initialLoading.style.opacity = '0';
      this.elements.initialLoading.style.visibility = 'hidden';

      // Remove from DOM after transition
      setTimeout(() => {
        if (this.elements.initialLoading && this.elements.initialLoading.parentNode) {
          this.elements.initialLoading.parentNode.removeChild(this.elements.initialLoading);
          console.log("Loading screen removed from DOM");
        }
      }, 500);
    }

    // Show error if any
    if (state === 'error') {
      this.elements.loadingText.innerHTML = `
      <span style="color: var(--danger);">Error loading content. Please refresh and try again.</span>
    `;
    }
  }
};