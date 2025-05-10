/**
 * Storage Module for Unity Learning Platform
 * 
 * Handles data persistence for user progress, settings, and other data.
 * Uses localStorage for client-side storage.
 */

const Storage = {
  /**
   * Default structure for user data
   */
  defaultUserData: {
    // User progress
    completedModules: [],
    completedTopics: [],
    
    // User content
    bookmarks: [],
    notes: {},
    
    // Activity history
    activities: [],
    
    // User settings
    settings: {
      darkMode: CONFIG.storage.defaultSettings.darkMode,
      fontSize: CONFIG.storage.defaultSettings.fontSize,
      autoSaveNotes: CONFIG.storage.defaultSettings.autoSaveNotes
    },
    
    // Metadata
    lastUpdated: Date.now()
  },
  
  /**
   * Initialize storage and load user data
   * @returns {Object} User data object
   */
  init() {
    let userData;
    
    try {
      // Try to load data from localStorage
      const storedData = localStorage.getItem(CONFIG.storage.userDataKey);
      
      if (storedData) {
        userData = JSON.parse(storedData);
        
        // Ensure all required properties exist by merging with default
        userData = this.migrateUserData(userData);
      } else {
        // If no data exists, use default
        userData = { ...this.defaultUserData };
        this.saveUserData(userData);
      }
    } catch (error) {
      console.error('Error initializing storage', error);
      userData = { ...this.defaultUserData };
      this.saveUserData(userData);
    }
    
    return userData;
  },
  
  /**
   * Save user data to localStorage
   * @param {Object} userData - User data to save
   * @returns {boolean} Success status
   */
  saveUserData(userData) {
    try {
      // Update last modified timestamp
      userData.lastUpdated = Date.now();
      
      // Save to localStorage
      localStorage.setItem(CONFIG.storage.userDataKey, JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error('Error saving user data', error);
      Utils.notification.toast('Failed to save your progress', 'error');
      return false;
    }
  },
  
  /**
   * Reset user data to defaults
   * @returns {Object} Fresh user data
   */
  resetUserData() {
    const userData = { ...this.defaultUserData };
    this.saveUserData(userData);
    return userData;
  },
  
  /**
   * Migrate/upgrade user data structure if needed
   * @param {Object} userData - Existing user data
   * @returns {Object} Updated user data with all required properties
   */
  migrateUserData(userData) {
    // Deep merge with defaults to ensure all properties exist
    const merged = this.deepMerge(this.defaultUserData, userData);
    
    // TODO: Add version-specific migrations here if needed in the future
    
    return merged;
  },
  
  /**
   * Deep merge two objects
   * @param {Object} target - Target object
   * @param {Object} source - Source object
   * @returns {Object} Merged object
   */
  deepMerge(target, source) {
    const output = { ...target };
    
    if (isObject(target) && isObject(source)) {
      Object.keys(source).forEach(key => {
        if (isObject(source[key])) {
          if (!(key in target)) {
            Object.assign(output, { [key]: source[key] });
          } else {
            output[key] = this.deepMerge(target[key], source[key]);
          }
        } else {
          Object.assign(output, { [key]: source[key] });
        }
      });
    }
    
    return output;
    
    function isObject(item) {
      return (item && typeof item === 'object' && !Array.isArray(item));
    }
  },
  
  /**
   * Add a module to completed list
   * @param {string} moduleId - Module ID to mark as completed
   * @param {Object} userData - User data object
   * @returns {Object} Updated user data
   */
  completeModule(moduleId, userData) {
    // Skip if already completed
    if (userData.completedModules.includes(moduleId)) {
      return userData;
    }
    
    // Add to completed modules
    userData.completedModules.push(moduleId);
    
    // Update lastUpdated timestamp
    userData.lastUpdated = Date.now();
    
    // Save changes
    this.saveUserData(userData);
    
    return userData;
  },
  
  /**
   * Remove a module from completed list
   * @param {string} moduleId - Module ID to mark as incomplete
   * @param {Object} userData - User data object
   * @returns {Object} Updated user data
   */
  uncompleteModule(moduleId, userData) {
    // Remove from completed modules
    userData.completedModules = userData.completedModules.filter(id => id !== moduleId);
    
    // Update lastUpdated timestamp
    userData.lastUpdated = Date.now();
    
    // Save changes
    this.saveUserData(userData);
    
    return userData;
  },
  
  /**
   * Add a topic to completed list
   * @param {string} topicId - Topic ID to mark as completed
   * @param {Object} userData - User data object
   * @returns {Object} Updated user data
   */
  completeTopic(topicId, userData) {
    // Skip if already completed
    if (userData.completedTopics.includes(topicId)) {
      return userData;
    }
    
    // Add to completed topics
    userData.completedTopics.push(topicId);
    
    // Update lastUpdated timestamp
    userData.lastUpdated = Date.now();
    
    // Save changes
    this.saveUserData(userData);
    
    return userData;
  },
  
  /**
   * Remove a topic from completed list
   * @param {string} topicId - Topic ID to mark as incomplete
   * @param {Object} userData - User data object
   * @returns {Object} Updated user data
   */
  uncompleteTopic(topicId, userData) {
    // Remove from completed topics
    userData.completedTopics = userData.completedTopics.filter(id => id !== topicId);
    
    // Update lastUpdated timestamp
    userData.lastUpdated = Date.now();
    
    // Save changes
    this.saveUserData(userData);
    
    return userData;
  },
  
  /**
   * Complete multiple topics at once
   * @param {string[]} topicIds - Array of topic IDs to mark as completed
   * @param {Object} userData - User data object
   * @returns {Object} Updated user data
   */
  completeMultipleTopics(topicIds, userData) {
    // Add all topics that aren't already completed
    topicIds.forEach(topicId => {
      if (!userData.completedTopics.includes(topicId)) {
        userData.completedTopics.push(topicId);
      }
    });
    
    // Update lastUpdated timestamp
    userData.lastUpdated = Date.now();
    
    // Save changes
    this.saveUserData(userData);
    
    return userData;
  },
  
  /**
   * Uncomplete multiple topics at once
   * @param {string[]} topicIds - Array of topic IDs to mark as incomplete
   * @param {Object} userData - User data object
   * @returns {Object} Updated user data
   */
  uncompleteMultipleTopics(topicIds, userData) {
    // Remove all specified topics
    userData.completedTopics = userData.completedTopics.filter(
      id => !topicIds.includes(id)
    );
    
    // Update lastUpdated timestamp
    userData.lastUpdated = Date.now();
    
    // Save changes
    this.saveUserData(userData);
    
    return userData;
  },
  
  /**
   * Add a bookmark
   * @param {Object} bookmark - Bookmark object with type, id, title, etc.
   * @param {Object} userData - User data object
   * @returns {Object} Updated user data
   */
  addBookmark(bookmark, userData) {
    // Check if bookmark already exists
    const exists = userData.bookmarks.some(
      b => b.type === bookmark.type && b.id === bookmark.id
    );
    
    if (!exists) {
      // Add new bookmark with timestamp
      userData.bookmarks.push({
        ...bookmark,
        timestamp: Date.now()
      });
      
      // Update lastUpdated timestamp
      userData.lastUpdated = Date.now();
      
      // Save changes
      this.saveUserData(userData);
    }
    
    return userData;
  },
  
  /**
   * Remove a bookmark
   * @param {string} type - Bookmark type (module, topic)
   * @param {string} id - Item ID
   * @param {Object} userData - User data object
   * @returns {Object} Updated user data
   */
  removeBookmark(type, id, userData) {
    // Filter out the bookmark
    userData.bookmarks = userData.bookmarks.filter(
      bookmark => !(bookmark.type === type && bookmark.id === id)
    );
    
    // Update lastUpdated timestamp
    userData.lastUpdated = Date.now();
    
    // Save changes
    this.saveUserData(userData);
    
    return userData;
  },
  
  /**
   * Save a note for a topic
   * @param {string} topicId - Topic ID
   * @param {string} content - Note content
   * @param {Object} userData - User data object
   * @returns {Object} Updated user data
   */
  saveNote(topicId, content, userData) {
    // Add or update note
    userData.notes[topicId] = content;
    
    // Update lastUpdated timestamp
    userData.lastUpdated = Date.now();
    
    // Save changes
    this.saveUserData(userData);
    
    return userData;
  },
  
  /**
   * Delete a note for a topic
   * @param {string} topicId - Topic ID
   * @param {Object} userData - User data object
   * @returns {Object} Updated user data
   */
  deleteNote(topicId, userData) {
    // Remove note if it exists
    if (userData.notes[topicId]) {
      delete userData.notes[topicId];
      
      // Update lastUpdated timestamp
      userData.lastUpdated = Date.now();
      
      // Save changes
      this.saveUserData(userData);
    }
    
    return userData;
  },
  
  /**
   * Add an activity to the recent activities list
   * @param {Object} activity - Activity object
   * @param {Object} userData - User data object
   * @returns {Object} Updated user data
   */
  addActivity(activity, userData) {
    // Add timestamp if not present
    if (!activity.timestamp) {
      activity.timestamp = Date.now();
    }
    
    // Add to activities array
    userData.activities.unshift(activity);
    
    // Limit to max number of activities
    if (userData.activities.length > CONFIG.performance.maxRecentActivities) {
      userData.activities = userData.activities.slice(0, CONFIG.performance.maxRecentActivities);
    }
    
    // Update lastUpdated timestamp
    userData.lastUpdated = Date.now();
    
    // Save changes
    this.saveUserData(userData);
    
    return userData;
  },
  
  /**
   * Update user settings
   * @param {Object} settings - Settings object to update
   * @param {Object} userData - User data object
   * @returns {Object} Updated user data
   */
  updateSettings(settings, userData) {
    // Update settings
    userData.settings = {
      ...userData.settings,
      ...settings
    };
    
    // Update lastUpdated timestamp
    userData.lastUpdated = Date.now();
    
    // Save changes
    this.saveUserData(userData);
    
    return userData;
  }
};
