import CONFIG from "../config";
import AuthHelper from "./auth-helper";

const VAPID_PUBLIC_KEY = "BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk";

class NotificationHelper {
  static async requestPermission() {
    if (!("Notification" in window)) {
      console.warn("This browser does not support notifications");
      return false;
    }

    if (!("serviceWorker" in navigator)) {
      console.warn("This browser does not support service workers");
      return false;
    }

    if (!("PushManager" in window)) {
      console.warn("This browser does not support push messaging");
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  static async registerServiceWorker() {
    if (!("serviceWorker" in navigator)) {
      throw new Error("Service Worker not supported");
    }

    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });

      console.log("Service Worker registered successfully:", registration);

      // Wait for service worker to be ready
      await navigator.serviceWorker.ready;

      return registration;
    } catch (error) {
      console.error("Service Worker registration failed:", error);
      throw error;
    }
  }

  static urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  static async subscribeToPush() {
    try {
      const registration = await navigator.serviceWorker.ready;

      // Check if already subscribed
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        // Subscribe to push notifications
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        });
      }

      console.log("Push subscription:", subscription);

      // Send subscription to server
      await this.sendSubscriptionToServer(subscription);

      // Clear the disabled flag when user explicitly enables notifications
      localStorage.removeItem("notificationsDisabled");

      return subscription;
    } catch (error) {
      console.error("Failed to subscribe to push notifications:", error);
      throw error;
    }
  }

  static async sendSubscriptionToServer(subscription) {
    const { token } = AuthHelper.getAuth();

    if (!token) {
      throw new Error("User not authenticated");
    }

    const subscriptionData = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey("p256dh")))),
        auth: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey("auth")))),
      },
    };

    try {
      const response = await fetch(`${CONFIG.BASE_URL}/notifications/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(subscriptionData),
      });

      const result = await response.json();

      if (result.error) {
        throw new Error(result.message || "Failed to subscribe to notifications");
      }

      console.log("Subscription sent to server successfully:", result);
      return result;
    } catch (error) {
      console.error("Failed to send subscription to server:", error);
      throw error;
    }
  }

  static async unsubscribeFromPush() {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        console.log("No subscription found");
        // Still mark as disabled even if no subscription exists
        localStorage.setItem("notificationsDisabled", "true");
        return;
      }

      // Unsubscribe from browser
      await subscription.unsubscribe();

      // Notify server
      await this.sendUnsubscriptionToServer(subscription.endpoint);

      // Mark that user has explicitly disabled notifications
      localStorage.setItem("notificationsDisabled", "true");

      console.log("Successfully unsubscribed from push notifications");
    } catch (error) {
      console.error("Failed to unsubscribe from push notifications:", error);
      throw error;
    }
  }

  static async sendUnsubscriptionToServer(endpoint) {
    const { token } = AuthHelper.getAuth();

    if (!token) {
      throw new Error("User not authenticated");
    }

    try {
      const response = await fetch(`${CONFIG.BASE_URL}/notifications/subscribe`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ endpoint }),
      });

      const result = await response.json();

      if (result.error) {
        throw new Error(result.message || "Failed to unsubscribe from notifications");
      }

      console.log("Unsubscription sent to server successfully:", result);
      return result;
    } catch (error) {
      console.error("Failed to send unsubscription to server:", error);
      throw error;
    }
  }

  static async isSubscribed() {
    try {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        return false;
      }

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      return !!subscription;
    } catch (error) {
      console.error("Error checking subscription status:", error);
      return false;
    }
  }

  static async showLocalNotification(title, options = {}) {
    if (!("Notification" in window)) {
      console.warn("This browser does not support notifications");
      return;
    }

    if (Notification.permission === "granted") {
      const notification = new Notification(title, {
        icon: "/favicon.png",
        badge: "/favicon.png",
        ...options,
      });

      // Auto close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);

      return notification;
    } else {
      console.warn("Notification permission not granted");
    }
  }

  static async initializeNotifications() {
    try {
      // Register service worker
      await this.registerServiceWorker();

      // Check if user has explicitly disabled notifications
      const userDisabledNotifications = localStorage.getItem("notificationsDisabled") === "true";

      if (userDisabledNotifications) {
        console.log("User has disabled notifications, skipping auto-subscription");
        return false;
      }

      // Request notification permission
      const permissionGranted = await this.requestPermission();

      if (permissionGranted && AuthHelper.isUserSignedIn()) {
        // Only subscribe if user hasn't explicitly disabled notifications
        const isCurrentlySubscribed = await this.isSubscribed();
        if (!isCurrentlySubscribed) {
          await this.subscribeToPush();
          console.log("Push notifications initialized successfully");
        }
      }

      return permissionGranted;
    } catch (error) {
      console.error("Failed to initialize notifications:", error);
      throw error;
    }
  }
}

export default NotificationHelper;
