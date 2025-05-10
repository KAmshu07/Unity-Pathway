/**
 * Utility functions for Unity Learning Platform
 * 
 * This file contains helper functions used throughout the application.
 */

const Utils = {
  /**
   * DOM manipulation utilities
   */
  dom: {
    /**
     * Shorthand for document.getElementById
     * @param {string} id - Element ID
     * @returns {HTMLElement} - The DOM element
     */
    getId: (id) => document.getElementById(id),
    
    /**
     * Shorthand for document.querySelector
     * @param {string} selector - CSS selector
     * @returns {HTMLElement} - The first matching DOM element
     */
    qs: (selector) => document.querySelector(selector),
    
    /**
     * Shorthand for document.querySelectorAll
     * @param {string} selector - CSS selector
     * @returns {NodeList} - All matching DOM elements
     */
    qsa: (selector) => document.querySelectorAll(selector),
    
    /**
     * Create a DOM element with attributes and content
     * @param {string} tag - HTML tag name
     * @param {Object} attrs - Attributes to set
     * @param {string|HTMLElement|HTMLElement[]} content - Inner content
     * @returns {HTMLElement} - The created element
     */
    create: (tag, attrs = {}, content = null) => {
      const element = document.createElement(tag);
      
      // Set attributes
      Object.entries(attrs).forEach(([key, value]) => {
        if (key === 'className') {
          element.className = value;
        } else if (key === 'dataset') {
          Object.entries(value).forEach(([dataKey, dataValue]) => {
            element.dataset[dataKey] = dataValue;
          });
        } else if (key.startsWith('on') && typeof value === 'function') {
          element.addEventListener(key.substring(2).toLowerCase(), value);
        } else {
          element.setAttribute(key, value);
        }
      });
      
      // Set content
      if (content !== null) {
        if (typeof content === 'string') {
          element.innerHTML = content;
        } else if (content instanceof HTMLElement) {
          element.appendChild(content);
        } else if (Array.isArray(content)) {
          content.forEach(item => {
            if (item instanceof HTMLElement) {
              element.appendChild(item);
            }
          });
        }
      }
      
      return element;
    },
    
    /**
     * Empty an element's contents
     * @param {HTMLElement} element - Element to empty
     */
    empty: (element) => {
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
    },
    
    /**
     * Show a loading spinner inside an element
     * @param {HTMLElement} element - Container element
     * @param {string} message - Optional message to display
     */
    showLoader: (element, message = 'Loading...') => {
      Utils.dom.empty(element);
      const loader = Utils.dom.create('div', { className: 'loading-placeholder' }, [
        Utils.dom.create('div', { className: 'loading-spinner' }),
        Utils.dom.create('p', {}, message)
      ]);
      element.appendChild(loader);
    }
  },
  
  /**
   * String manipulation utilities
   */
  string: {
    /**
     * Slugify a string for URLs
     * @param {string} text - Text to slugify
     * @returns {string} - URL-friendly slug
     */
    slugify: (text) => {
      return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')       // Replace spaces with -
        .replace(/&/g, '-and-')      // Replace & with 'and'
        .replace(/[^\w\-]+/g, '')    // Remove all non-word characters
        .replace(/\-\-+/g, '-');     // Replace multiple - with single -
    },
    
    /**
     * Truncate text to a specific length
     * @param {string} text - Text to truncate
     * @param {number} length - Maximum length
     * @param {string} suffix - Suffix to add when truncated
     * @returns {string} - Truncated text
     */
    truncate: (text, length = 100, suffix = '...') => {
      if (text.length <= length) return text;
      return text.substring(0, length).trim() + suffix;
    },
    
    /**
     * Convert markdown to HTML using the marked library
     * @param {string} markdown - Markdown text
     * @returns {string} - HTML string
     */
    markdownToHtml: (markdown) => {
      if (!markdown) return '';
      
      // If marked library is available, use it
      if (typeof marked !== 'undefined') {
        return marked.parse(markdown);
      }
      
      // Simple fallback if marked is not available
      return markdown
        .replace(/^# (.*$)/gm, '<h1>$1</h1>')
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
        .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
        .replace(/^##### (.*$)/gm, '<h5>$1</h5>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
        .replace(/^- (.*$)/gm, '<li>$1</li>')
        .replace(/^(\d+)\. (.*$)/gm, '<li>$2</li>')
        .replace(/<\/li>\s*<li>/g, '</li>\n<li>')
        .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
        .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/^(?!<h|<ul|<pre|<li)(.*$)/gm, '<p>$1</p>');
    },
    
    /**
     * Highlight code syntax (needs Prism.js)
     * @param {HTMLElement} element - Container with code elements
     */
    highlightCode: (element) => {
      if (typeof Prism !== 'undefined') {
        Prism.highlightAllUnder(element);
      }
    }
  },
  
  /**
   * Date and time utilities
   */
  date: {
    /**
     * Format a date as a readable string
     * @param {Date|number|string} date - Date to format
     * @param {boolean} includeTime - Whether to include time
     * @returns {string} - Formatted date string
     */
    format: (date, includeTime = false) => {
      const d = new Date(date);
      
      // Check if date is valid
      if (isNaN(d.getTime())) {
        return 'Invalid date';
      }
      
      const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      };
      
      if (includeTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
      }
      
      return d.toLocaleDateString(undefined, options);
    },
    
    /**
     * Get relative time string (e.g., "2 hours ago")
     * @param {Date|number|string} date - Date to format
     * @returns {string} - Relative time string
     */
    relative: (date) => {
      const d = new Date(date);
      
      // Check if date is valid
      if (isNaN(d.getTime())) {
        return 'Invalid date';
      }
      
      const now = new Date();
      const diffMs = now - d;
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHour = Math.floor(diffMin / 60);
      const diffDay = Math.floor(diffHour / 24);
      
      if (diffSec < 60) {
        return 'just now';
      } else if (diffMin < 60) {
        return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
      } else if (diffHour < 24) {
        return `${diffHour} hour${diffHour !== 1 ? 's' : ''} ago`;
      } else if (diffDay < 7) {
        return `${diffDay} day${diffDay !== 1 ? 's' : ''} ago`;
      } else {
        return Utils.date.format(date);
      }
    }
  },
  
  /**
   * URL and navigation utilities
   */
  url: {
    /**
     * Parse URL query parameters
     * @returns {Object} - Object with query parameters
     */
    getQueryParams: () => {
      const params = {};
      const queryString = window.location.search.substring(1);
      
      if (queryString) {
        const pairs = queryString.split('&');
        pairs.forEach(pair => {
          const [key, value] = pair.split('=');
          params[decodeURIComponent(key)] = decodeURIComponent(value || '');
        });
      }
      
      return params;
    },
    
    /**
     * Build a URL with query parameters
     * @param {string} baseUrl - Base URL
     * @param {Object} params - Query parameters
     * @returns {string} - URL with query parameters
     */
    buildUrl: (baseUrl, params = {}) => {
      const url = new URL(baseUrl, window.location.origin);
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          url.searchParams.append(key, value);
        }
      });
      
      return url.toString();
    },
    
    /**
     * Update browser URL without reloading
     * @param {string} url - URL to navigate to
     * @param {string} title - Page title
     */
    updateUrl: (url, title) => {
      if (window.history && window.history.pushState) {
        window.history.pushState({ url }, title, url);
      }
    }
  },
  
  /**
   * Async utilities
   */
  async: {
    /**
     * Sleep for a specified time
     * @param {number} ms - Milliseconds to sleep
     * @returns {Promise} - Promise that resolves after the specified time
     */
    sleep: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
    
    /**
     * Debounce a function
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} - Debounced function
     */
    debounce: (func, wait = 300) => {
      let timeout;
      
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },
    
    /**
     * Fetch with timeout and retry
     * @param {string} url - URL to fetch
     * @param {Object} options - Fetch options
     * @param {number} timeout - Timeout in milliseconds
     * @param {number} retries - Number of retries
     * @returns {Promise} - Fetch promise
     */
    fetchWithTimeout: async (url, options = {}, timeout = 10000, retries = 2) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      options.signal = controller.signal;
      
      try {
        const response = await fetch(url, options);
        clearTimeout(timeoutId);
        return response;
      } catch (error) {
        clearTimeout(timeoutId);
        
        if (retries > 0) {
          return Utils.async.fetchWithTimeout(url, options, timeout, retries - 1);
        }
        
        throw error;
      }
    }
  },
  
  /**
   * Notification and toast utilities
   */
  notification: {
    /**
     * Show a toast notification
     * @param {string} message - Notification message
     * @param {string} type - Notification type: 'success', 'error', 'warning', 'info'
     * @param {string} title - Optional title
     * @param {number} duration - Duration in milliseconds
     */
    toast: (message, type = 'info', title = '', duration = CONFIG.ui.toasts.duration) => {
      const toastContainer = Utils.dom.getId('toast-container');
      
      if (!toastContainer) return;
      
      // Limit number of visible toasts
      const visibleToasts = toastContainer.querySelectorAll('.toast.visible');
      if (visibleToasts.length >= CONFIG.ui.toasts.maxVisible) {
        toastContainer.removeChild(visibleToasts[0]);
      }
      
      // Set icon based on type
      let icon = 'info-circle';
      switch (type) {
        case 'success': icon = 'check-circle'; break;
        case 'error': icon = 'times-circle'; break;
        case 'warning': icon = 'exclamation-circle'; break;
      }
      
      // Create toast element
      const toast = Utils.dom.create('div', { className: `toast toast-${type}` }, [
        Utils.dom.create('div', { className: 'toast-icon' }, `<i class="fas fa-${icon}"></i>`),
        Utils.dom.create('div', { className: 'toast-content' }, [
          title ? Utils.dom.create('div', { className: 'toast-title' }, title) : null,
          Utils.dom.create('div', { className: 'toast-message' }, message)
        ]),
        Utils.dom.create('button', { 
          className: 'toast-close',
          onClick: (e) => {
            e.target.closest('.toast').remove();
          }
        }, '<i class="fas fa-times"></i>')
      ]);
      
      // Add to container
      toastContainer.appendChild(toast);
      
      // Make visible after a small delay (for animation)
      setTimeout(() => {
        toast.classList.add('visible');
      }, 10);
      
      // Auto-remove after duration
      setTimeout(() => {
        if (toast.parentNode) {
          toast.classList.remove('visible');
          setTimeout(() => {
            if (toast.parentNode) {
              toast.parentNode.removeChild(toast);
            }
          }, 300); // Match the CSS transition duration
        }
      }, duration);
    }
  },
  
  /**
   * Miscellaneous utilities
   */
  misc: {
    /**
     * Generate a unique ID
     * @returns {string} - Unique ID
     */
    generateId: () => {
      return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    },
    
    /**
     * Copy text to clipboard
     * @param {string} text - Text to copy
     * @returns {Promise<boolean>} - Success state
     */
    copyToClipboard: async (text) => {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(text);
          return true;
        }
        
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textarea);
        return successful;
      } catch (error) {
        console.error('Failed to copy text: ', error);
        return false;
      }
    }
  }
};
