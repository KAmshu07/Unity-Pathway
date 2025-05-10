/**
 * Configuration settings for Unity Learning Platform
 * 
 * This file contains global configuration settings that can be modified
 * without changing the core application code.
 */

const CONFIG = {
  /**
   * Application settings
   */
  app: {
    name: "Unity Developer Pathway",
    version: "1.0.0",
    description: "From beginner to independent developer with our comprehensive learning path"
  },
  
  /**
   * Content paths and settings
   */
  content: {
    // Base path for all content
    basePath: "./docs/content/",
    
    // Structure file that defines phases and module organization
    structureFile: "structure.json",
    
    // Path to module JSON files
    modulesPath: "modules/",
    
    // Path to topic markdown files
    topicsPath: "topics/",
    
    // Default resources to show in resources view
    defaultResources: {
      documentation: [
        { title: "Unity Manual", url: "https://docs.unity3d.com/Manual/index.html" },
        { title: "Unity Scripting API", url: "https://docs.unity3d.com/ScriptReference/index.html" },
        { title: "C# Documentation", url: "https://docs.microsoft.com/en-us/dotnet/csharp/" }
      ],
      community: [
        { title: "Unity Forums", url: "https://forum.unity.com/" },
        { title: "Unity Community", url: "https://unity.com/community" },
        { title: "Unity Answers", url: "https://answers.unity.com/" }
      ],
      tools: [
        { title: "Download Unity", url: "https://unity.com/download" },
        { title: "Visual Studio", url: "https://visualstudio.microsoft.com/" },
        { title: "Visual Studio Code", url: "https://code.visualstudio.com/" }
      ]
    },
    
    // Content loading settings
    loading: {
      initialDelay: 500, // ms to show initial loading screen for better UX
      timeout: 10000, // ms before showing timeout error for content loading
      retries: 2 // number of retries for failed content loading
    }
  },
  
  /**
   * Local storage settings
   */
  storage: {
    // Key for storing user data in localStorage
    userDataKey: "unityLearningPlatform_userData",
    
    // Default user settings
    defaultSettings: {
      darkMode: false,
      fontSize: "medium", // small, medium, large
      autoSaveNotes: true
    }
  },
  
  /**
   * Performance and optimization settings
   */
  performance: {
    // Debounce time for search input (ms)
    searchDebounce: 300,
    
    // Maximum number of recent activities to store
    maxRecentActivities: 10,
    
    // Maximum number of search results to display
    maxSearchResults: 50
  },
  
  /**
   * UI settings
   */
  ui: {
    // Toast notification settings
    toasts: {
      duration: 5000, // ms for toast to remain visible
      maxVisible: 3 // maximum number of visible toasts at once
    },
    
    // Animation durations
    animations: {
      pageTransition: 300, // ms for page transitions
      modalTransition: 250 // ms for modal animations
    }
  }
};
