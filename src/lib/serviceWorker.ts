/**
 * Service Worker Registration & Management
 * Handles SW lifecycle and cache management
 */

export interface ServiceWorkerConfig {
  enabled?: boolean;
  scope?: string;
  onUpdate?: () => void;
  onInstall?: () => void;
}

class ServiceWorkerManager {
  private registration: ServiceWorkerRegistration | null = null;
  private config: ServiceWorkerConfig;

  constructor(config: ServiceWorkerConfig = {}) {
    this.config = {
      enabled: true,
      scope: '/',
      ...config,
    };
  }

  /**
   * Register the service worker
   */
  async register(): Promise<ServiceWorkerRegistration | null> {
    if (!this.config.enabled) {
      console.log('[SW] Service worker disabled');
      return null;
    }

    if (!('serviceWorker' in navigator)) {
      console.log('[SW] Service Worker not supported in this browser');
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: this.config.scope,
      });

      this.registration = registration;
      console.log('[SW] Service Worker registered:', registration);

      // Handle updates
      registration.addEventListener('updatefound', () => {
        this.handleUpdateFound(registration);
      });

      // Handle controller change
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('[SW] Controller changed');
      });

      // Run install callback
      if (this.config.onInstall) {
        this.config.onInstall();
      }

      return registration;
    } catch (error) {
      console.error('[SW] Registration failed:', error);
      return null;
    }
  }

  /**
   * Handle service worker updates
   */
  private handleUpdateFound(registration: ServiceWorkerRegistration): void {
    const newWorker = registration.installing;
    if (!newWorker) return;

    newWorker.addEventListener('statechange', () => {
      if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
        // New SW available
        console.log('[SW] New version available');

        if (this.config.onUpdate) {
          this.config.onUpdate();
        }

        // Notify user of update
        this.notifyUpdate();
      }
    });
  }

  /**
   * Notify user of available update
   */
  private notifyUpdate(): void {
    const message = document.createElement('div');
    message.setAttribute('id', 'sw-update-notification');
    message.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 20px;
      background-color: hsl(234, 85%, 25%);
      color: hsl(234, 85%, 65%);
      padding: 16px;
      border-radius: 8px;
      border: 1px solid hsl(234, 85%, 65%);
      font-size: 14px;
      font-family: system-ui;
      z-index: 9998;
      max-width: 320px;
    `;

    const content = document.createElement('div');
    content.innerHTML = `
      <div style="margin-bottom: 12px;">🔄 New version available</div>
      <button id="sw-update-btn" style="
        background-color: hsl(234, 85%, 65%);
        color: hsl(234, 85%, 15%);
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 600;
        font-size: 13px;
      ">
        Update
      </button>
      <button id="sw-dismiss-btn" style="
        background-color: transparent;
        color: hsl(234, 85%, 65%);
        border: 1px solid hsl(234, 85%, 65%);
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 13px;
        margin-left: 8px;
      ">
        Later
      </button>
    `;

    message.appendChild(content);
    document.body.appendChild(message);

    document.getElementById('sw-update-btn')?.addEventListener('click', () => {
      this.skipWaiting();
      message.remove();
    });

    document.getElementById('sw-dismiss-btn')?.addEventListener('click', () => {
      message.remove();
    });

    // Auto-dismiss after 10 seconds
    setTimeout(() => {
      message.remove();
    }, 10000);
  }

  /**
   * Skip waiting and activate new service worker
   */
  async skipWaiting(): Promise<void> {
    const registrations = await navigator.serviceWorker.getRegistrations();
    registrations.forEach((registration) => {
      if (registration.waiting) {
        registration.waiting.postMessage({ action: 'skipWaiting' });
        window.location.reload();
      }
    });
  }

  /**
   * Unregister the service worker
   */
  async unregister(): Promise<void> {
    if (!this.registration) return;

    try {
      await this.registration.unregister();
      this.registration = null;
      console.log('[SW] Service Worker unregistered');
    } catch (error) {
      console.error('[SW] Unregister failed:', error);
    }
  }

  /**
   * Clear all caches
   */
  async clearCache(): Promise<void> {
    if (!this.registration?.active) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((name) => caches.delete(name)));
    } else {
      this.registration.active.postMessage({ action: 'clearCache' });
    }
    console.log('[SW] Caches cleared');
  }

  /**
   * Get cache info
   */
  async getCacheInfo(): Promise<string[]> {
    return caches.keys();
  }

  /**
   * Check for service worker updates
   */
  async checkForUpdates(): Promise<void> {
    if (!this.registration) return;

    try {
      await this.registration.update();
      console.log('[SW] Checked for updates');
    } catch (error) {
      console.error('[SW] Update check failed:', error);
    }
  }
}

// Singleton instance
let manager: ServiceWorkerManager | null = null;

/**
 * Initialize and return service worker manager
 */
export function initServiceWorker(config?: ServiceWorkerConfig): ServiceWorkerManager {
  if (!manager) {
    manager = new ServiceWorkerManager(config);
    manager.register();
  }
  return manager;
}

/**
 * Get service worker manager
 */
export function getServiceWorkerManager(): ServiceWorkerManager | null {
  return manager;
}

export default ServiceWorkerManager;
