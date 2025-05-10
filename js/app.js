/**
 * Main Application Script for Unity Learning Platform
 * 
 * This is the entry point that initializes and connects all components.
 */

// Global app instance
const App = {
  /**
   * Application state
   */
  state: {
    initialized: false,
    loading: true,
    error: null
  },
  
  /**
   * Initialize the application
   */
  async init() {
    try {
      console.log(`Initializing ${CONFIG.app.name} v${CONFIG.app.version}`);
      
      // First initialize user data storage
      const userData = Storage.init();
      console.log('User data loaded successfully');
      
      // Initialize content loader and load structure
      console.log('Loading content...');
      await ContentLoader.init();
      console.log('Content loaded successfully');
      
      // Initialize UI manager
      UIManager.init(userData);
      console.log('UI initialized successfully');
      
      // Update app state
      this.state.initialized = true;
      this.state.loading = false;
      
      console.log(`${CONFIG.app.name} initialized successfully`);
    } catch (error) {
      console.error('Error initializing application:', error);
      
      // Update app state
      this.state.error = error;
      this.state.loading = false;
      
      // Show error in UI
      this.showInitializationError(error);
    }
  },
  
  /**
   * Show initialization error to user
   * @param {Error} error - Error object
   */
  showInitializationError(error) {
    const initialLoading = document.getElementById('initial-loading');
    
    if (initialLoading) {
      // Update loading screen to show error
      const loadingText = initialLoading.querySelector('.loading-text');
      const progressBar = initialLoading.querySelector('.loading-progress-bar');
      
      if (loadingText) {
        loadingText.innerHTML = `
          <div class="error-message">
            <h3>Error Loading Content</h3>
            <p>Sorry, we couldn't load the learning content. Please try refreshing the page.</p>
            <details>
              <summary>Technical Details</summary>
              <pre>${error.message}</pre>
            </details>
            <button class="btn btn-primary" onclick="location.reload()">Refresh Page</button>
          </div>
        `;
      }
      
      if (progressBar) {
        progressBar.style.display = 'none';
      }
    }
  }
};

// Start the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize app with a small delay to ensure all scripts are loaded
  setTimeout(() => App.init(), 100);
});

setTimeout(() => {
  const loadingScreen = document.getElementById('initial-loading');
  if (loadingScreen) {
    console.log("Force hiding loading screen as fallback");
    loadingScreen.style.opacity = '0';
    loadingScreen.style.visibility = 'hidden';
    
    setTimeout(() => {
      if (loadingScreen.parentNode) {
        loadingScreen.parentNode.removeChild(loadingScreen);
      }
    }, 500);
  }
}, 2000);