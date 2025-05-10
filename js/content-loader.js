/**
 * Content Loader for Unity Learning Platform
 * 
 * Handles loading all content from JSON and markdown files.
 * Supports caching, error handling, and progress tracking.
 */

const ContentLoader = {
  /**
   * Content cache
   */
  cache: {
    structure: null,
    modules: {},
    topics: {}
  },

  /**
   * Loading state tracking
   */
  loading: {
    state: 'idle', // idle, loading, error, complete
    progress: 0,
    total: 0,
    message: '',
    error: null
  },

  /**
   * Initialize content loader
   * @returns {Promise<Object>} - Content structure
   */
  async init() {
    try {
      this.setLoadingState('loading', 0, 1, 'Loading content structure...');

      // First load the structure file
      const structure = await this.loadStructure();

      // Count total modules to load for progress tracking
      const moduleCount = this.countModules(structure);
      this.setLoadingState('loading', 0, moduleCount, 'Loading modules...');

      // Load all modules in parallel
      const moduleIds = this.getAllModuleIds(structure);
      let loadedCount = 0;

      await Promise.all(moduleIds.map(async (moduleId) => {
        await this.loadModule(moduleId);
        loadedCount++;
        this.setLoadingState('loading', loadedCount, moduleCount, `Loaded ${loadedCount} of ${moduleCount} modules...`);
      }));

      // Make sure this is being called with the correct state
      console.log("Setting loading state to complete");
      this.setLoadingState('complete', moduleCount, moduleCount, 'Content loaded successfully');
      return structure;
    } catch (error) {
      this.setLoadingState('error', 0, 0, 'Failed to load content', error);
      throw error;
    }
  },

  /**
   * Set loading state and trigger events
   * @param {string} state - Loading state
   * @param {number} progress - Current progress
   * @param {number} total - Total items to load
   * @param {string} message - Status message
   * @param {Error} error - Error object if applicable
   */
  setLoadingState(state, progress, total, message, error = null) {
    this.loading = {
      state,
      progress,
      total,
      message,
      error
    };

    // Dispatch loading state change event
    const event = new CustomEvent('contentloader:statechange', { detail: { ...this.loading } });
    document.dispatchEvent(event);
  },

  /**
   * Load the structure file
   * @returns {Promise<Object>} - Structure object
   */
  async loadStructure() {
    // Check cache first
    if (this.cache.structure) {
      return this.cache.structure;
    }

    try {
      // Fetch structure file
      const response = await Utils.async.fetchWithTimeout(
        `${CONFIG.content.basePath}${CONFIG.content.structureFile}`,
        {},
        CONFIG.content.loading.timeout,
        CONFIG.content.loading.retries
      );

      if (!response.ok) {
        throw new Error(`Failed to load structure file: ${response.status} ${response.statusText}`);
      }

      // Parse JSON
      const structure = await response.json();

      // Cache result
      this.cache.structure = structure;

      return structure;
    } catch (error) {
      console.error('Error loading structure file:', error);
      throw error;
    }
  },

  /**
   * Load a module by ID
   * @param {string} moduleId - Module ID
   * @returns {Promise<Object>} - Module object
   */
  async loadModule(moduleId) {
    // Check cache first
    if (this.cache.modules[moduleId]) {
      return this.cache.modules[moduleId];
    }

    try {
      // Fetch module file
      const response = await Utils.async.fetchWithTimeout(
        `${CONFIG.content.basePath}${CONFIG.content.modulesPath}${moduleId}.json`,
        {},
        CONFIG.content.loading.timeout,
        CONFIG.content.loading.retries
      );

      // If module file is not found, create a placeholder
      if (!response.ok) {
        if (response.status === 404) {
          const placeholder = this.createPlaceholderModule(moduleId);
          this.cache.modules[moduleId] = placeholder;
          return placeholder;
        }

        throw new Error(`Failed to load module ${moduleId}: ${response.status} ${response.statusText}`);
      }

      // Parse JSON
      const module = await response.json();

      // Cache result
      this.cache.modules[moduleId] = module;

      return module;
    } catch (error) {
      console.error(`Error loading module ${moduleId}:`, error);

      // Create placeholder on error
      const placeholder = this.createPlaceholderModule(moduleId);
      this.cache.modules[moduleId] = placeholder;
      return placeholder;
    }
  },

  /**
   * Load a topic's content
   * @param {string} contentPath - Path to topic content
   * @returns {Promise<string>} - Topic content HTML
   */
  async loadTopicContent(contentPath) {
    if (!contentPath) return null;

    // Check cache first
    if (this.cache.topics[contentPath]) {
      return this.cache.topics[contentPath];
    }

    try {
      // Fetch topic file
      const response = await Utils.async.fetchWithTimeout(
        `${CONFIG.content.basePath}${contentPath}`,
        {},
        CONFIG.content.loading.timeout,
        CONFIG.content.loading.retries
      );

      if (!response.ok) {
        throw new Error(`Failed to load topic content: ${response.status} ${response.statusText}`);
      }

      // Get content as text
      const content = await response.text();

      // Convert to HTML if it's a markdown file
      let html;
      if (contentPath.endsWith('.md')) {
        html = Utils.string.markdownToHtml(content);
      } else {
        html = content;
      }

      // Cache result
      this.cache.topics[contentPath] = html;

      return html;
    } catch (error) {
      console.error(`Error loading topic content ${contentPath}:`, error);

      // Return error message as content
      const errorContent = `
        <div class="content-error">
          <h3>Failed to load content</h3>
          <p>Sorry, we couldn't load the content for this topic. Please try again later.</p>
          <pre class="error-details">${error.message}</pre>
        </div>
      `;

      return errorContent;
    }
  },

  /**
   * Create a placeholder module for missing content
   * @param {string} moduleId - Module ID
   * @returns {Object} - Placeholder module object
   */
  createPlaceholderModule(moduleId) {
    // Extract module number from ID (assuming format like 'module-1')
    const moduleNum = moduleId.split('-')[1] || '?';

    return {
      id: moduleId,
      title: `Module ${moduleNum} (Coming Soon)`,
      description: "This module is currently under development. Check back soon for new content.",
      estimatedTime: "TBD",
      phase: this.findPhaseForModule(moduleId),
      order: parseInt(moduleNum) || 999,
      topics: [],
      resources: []
    };
  },

  /**
   * Find which phase a module belongs to
   * @param {string} moduleId - Module ID
   * @returns {string|null} - Phase ID or null if not found
   */
  findPhaseForModule(moduleId) {
    const structure = this.cache.structure;
    if (!structure) return null;

    // Check regular phases
    for (const phase of structure.phases) {
      if (phase.modules.includes(moduleId)) {
        return phase.id;
      }
    }

    // Check specialized areas
    if (structure.specializedAreas) {
      for (const area of structure.specializedAreas) {
        if (area.modules.includes(moduleId)) {
          return area.id;
        }
      }
    }

    return null;
  },

  /**
   * Get a flat list of all module IDs
   * @param {Object} structure - Content structure
   * @returns {string[]} - Array of module IDs
   */
  getAllModuleIds(structure) {
    const moduleIds = [];

    // Add modules from regular phases
    structure.phases.forEach(phase => {
      phase.modules.forEach(moduleId => {
        moduleIds.push(moduleId);
      });
    });

    // Add modules from specialized areas if they exist
    if (structure.specializedAreas) {
      structure.specializedAreas.forEach(area => {
        area.modules.forEach(moduleId => {
          moduleIds.push(moduleId);
        });
      });
    }

    return moduleIds;
  },

  /**
   * Count total number of modules
   * @param {Object} structure - Content structure
   * @returns {number} - Total module count
   */
  countModules(structure) {
    let count = 0;

    // Count modules in regular phases
    structure.phases.forEach(phase => {
      count += phase.modules.length;
    });

    // Count modules in specialized areas if they exist
    if (structure.specializedAreas) {
      structure.specializedAreas.forEach(area => {
        count += area.modules.length;
      });
    }

    return count;
  },

  /**
   * Get a module by ID
   * @param {string} moduleId - Module ID
   * @returns {Object|null} - Module object or null if not found
   */
  getModule(moduleId) {
    return this.cache.modules[moduleId] || null;
  },

  /**
   * Get all modules as a flat array, sorted by order
   * @returns {Object[]} - Array of module objects
   */
  getAllModules() {
    return Object.values(this.cache.modules)
      .sort((a, b) => a.order - b.order);
  },

  /**
   * Get modules grouped by phase
   * @returns {Object} - Modules organized by phase
   */
  getModulesByPhase() {
    const structure = this.cache.structure;
    if (!structure) return {};

    const modulesByPhase = {};

    // Process regular phases
    structure.phases.forEach(phase => {
      modulesByPhase[phase.id] = {
        name: phase.name,
        description: phase.description,
        modules: phase.modules
          .map(moduleId => this.getModule(moduleId))
          .filter(module => module) // Filter out null values
          .sort((a, b) => a.order - b.order) // Sort by order
      };
    });

    // Process specialized areas if they exist
    if (structure.specializedAreas) {
      structure.specializedAreas.forEach(area => {
        modulesByPhase[area.id] = {
          name: area.name,
          description: area.description,
          modules: area.modules
            .map(moduleId => this.getModule(moduleId))
            .filter(module => module) // Filter out null values
            .sort((a, b) => a.order - b.order) // Sort by order
        };
      });
    }

    return modulesByPhase;
  },

  /**
   * Find a module by order (numerical position)
   * @param {number} order - Module order/position
   * @returns {Object|null} - Module object or null if not found
   */
  getModuleByOrder(order) {
    return this.getAllModules().find(module => module.order === order) || null;
  },

  /**
   * Get the next module after the given moduleId
   * @param {string} moduleId - Current module ID
   * @returns {Object|null} - Next module or null if not found
   */
  getNextModule(moduleId) {
    const module = this.getModule(moduleId);
    if (!module) return null;

    return this.getModuleByOrder(module.order + 1);
  },

  /**
   * Get the previous module before the given moduleId
   * @param {string} moduleId - Current module ID
   * @returns {Object|null} - Previous module or null if not found
   */
  getPreviousModule(moduleId) {
    const module = this.getModule(moduleId);
    if (!module) return null;

    return this.getModuleByOrder(module.order - 1);
  },

  /**
   * Get a topic by ID from a specific module
   * @param {string} moduleId - Module ID
   * @param {string} topicId - Topic ID
   * @returns {Object|null} - Topic object or null if not found
   */
  getTopic(moduleId, topicId) {
    const module = this.getModule(moduleId);
    if (!module || !module.topics) return null;

    return module.topics.find(topic => topic.id === topicId) || null;
  },

  /**
   * Get the next topic within a module or the first topic of the next module
   * @param {string} moduleId - Current module ID
   * @param {string} topicId - Current topic ID
   * @returns {Object|null} - Next topic or null if not found
   */
  getNextTopic(moduleId, topicId) {
    const module = this.getModule(moduleId);
    if (!module || !module.topics) return null;

    const topicIndex = module.topics.findIndex(topic => topic.id === topicId);
    if (topicIndex === -1) return null;

    // If there's another topic in this module, return it
    if (topicIndex < module.topics.length - 1) {
      return {
        ...module.topics[topicIndex + 1],
        moduleId: module.id // Add the moduleId for convenience
      };
    }

    // Otherwise, try to get the first topic of the next module
    const nextModule = this.getNextModule(moduleId);
    if (nextModule && nextModule.topics && nextModule.topics.length > 0) {
      return {
        ...nextModule.topics[0],
        moduleId: nextModule.id // Add the moduleId for convenience
      };
    }

    return null;
  },

  /**
   * Get the previous topic within a module or the last topic of the previous module
   * @param {string} moduleId - Current module ID
   * @param {string} topicId - Current topic ID
   * @returns {Object|null} - Previous topic or null if not found
   */
  getPreviousTopic(moduleId, topicId) {
    const module = this.getModule(moduleId);
    if (!module || !module.topics) return null;

    const topicIndex = module.topics.findIndex(topic => topic.id === topicId);
    if (topicIndex === -1) return null;

    // If there's a previous topic in this module, return it
    if (topicIndex > 0) {
      return {
        ...module.topics[topicIndex - 1],
        moduleId: module.id // Add the moduleId for convenience
      };
    }

    // Otherwise, try to get the last topic of the previous module
    const prevModule = this.getPreviousModule(moduleId);
    if (prevModule && prevModule.topics && prevModule.topics.length > 0) {
      return {
        ...prevModule.topics[prevModule.topics.length - 1],
        moduleId: prevModule.id // Add the moduleId for convenience
      };
    }

    return null;
  },

  /**
   * Get a list of all phases 
   * @returns {Object[]} - Array of phase objects
   */
  getAllPhases() {
    const structure = this.cache.structure;
    if (!structure) return [];

    return structure.phases;
  },

  /**
   * Get a list of all specialized areas
   * @returns {Object[]} - Array of specialized area objects
   */
  getAllSpecializedAreas() {
    const structure = this.cache.structure;
    if (!structure || !structure.specializedAreas) return [];

    return structure.specializedAreas;
  },

  /**
   * Get a phase by ID
   * @param {string} phaseId - Phase ID
   * @returns {Object|null} - Phase object or null if not found
   */
  getPhase(phaseId) {
    const structure = this.cache.structure;
    if (!structure) return null;

    // Check regular phases
    const phase = structure.phases.find(p => p.id === phaseId);
    if (phase) return phase;

    // Check specialized areas
    if (structure.specializedAreas) {
      const area = structure.specializedAreas.find(a => a.id === phaseId);
      if (area) return area;
    }

    return null;
  },

  /**
   * Search for content across all modules and topics
   * @param {string} query - Search query
   * @returns {Object[]} - Array of search results
   */
  search(query) {
    if (!query || typeof query !== 'string' || query.length < 2) {
      return [];
    }

    const searchQuery = query.toLowerCase().trim();
    const results = [];
    const modules = this.getAllModules();

    // Limit number of results
    const maxResults = CONFIG.performance.maxSearchResults;

    // Search in modules
    for (const module of modules) {
      // Check title and description
      const titleMatch = module.title.toLowerCase().includes(searchQuery);
      const descMatch = module.description.toLowerCase().includes(searchQuery);

      if (titleMatch || descMatch) {
        results.push({
          type: 'module',
          id: module.id,
          title: module.title,
          context: module.description,
          phase: this.getPhaseNameForModule(module.id)
        });

        // Break if we reached max results
        if (results.length >= maxResults) break;
      }

      // If we have topics, search them too
      if (module.topics && results.length < maxResults) {
        for (const topic of module.topics) {
          // Check title and description
          const topicTitleMatch = topic.title.toLowerCase().includes(searchQuery);
          const topicDescMatch = topic.description &&
            topic.description.toLowerCase().includes(searchQuery);

          if (topicTitleMatch || topicDescMatch) {
            results.push({
              type: 'topic',
              id: topic.id,
              moduleId: module.id,
              title: topic.title,
              context: topic.description || '',
              phase: this.getPhaseNameForModule(module.id)
            });

            // Break if we reached max results
            if (results.length >= maxResults) break;
          }

          // If we have subtopics, search them too
          if (topic.subtopics && results.length < maxResults) {
            for (const subtopic of topic.subtopics) {
              // Check title
              const subtopicTitleMatch = subtopic.title.toLowerCase().includes(searchQuery);

              if (subtopicTitleMatch) {
                results.push({
                  type: 'subtopic',
                  id: subtopic.id,
                  topicId: topic.id,
                  moduleId: module.id,
                  title: subtopic.title,
                  context: `From: ${topic.title}`,
                  phase: this.getPhaseNameForModule(module.id)
                });

                // Break if we reached max results
                if (results.length >= maxResults) break;
              }
            }
          }

          // Break topic loop if we reached max results
          if (results.length >= maxResults) break;
        }
      }

      // Break module loop if we reached max results
      if (results.length >= maxResults) break;
    }

    return results;
  },

  /**
   * Get phase name for a module
   * @param {string} moduleId - Module ID
   * @returns {string} - Phase name
   */
  getPhaseNameForModule(moduleId) {
    const phaseId = this.findPhaseForModule(moduleId);
    if (!phaseId) return 'Unknown Phase';

    const phase = this.getPhase(phaseId);
    return phase ? phase.name : 'Unknown Phase';
  },

  /**
   * Clear all content cache
   */
  clearCache() {
    this.cache = {
      structure: null,
      modules: {},
      topics: {}
    };
  }
};
