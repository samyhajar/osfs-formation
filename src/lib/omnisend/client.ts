/**
 * Omnisend API Client
 * Handles authentication and API calls to Omnisend
 */

export interface OmnisendContact {
  identifiers: Array<{
    type: 'email';
    id: string;
    channels: {
      email: {
        status: 'subscribed' | 'unsubscribed';
        statusDate: string;
      };
    };
  }>;
  firstName?: string;
  lastName?: string;
  tags?: string[];
  customFields?: Record<string, string | number | boolean>;
}

export interface OmnisendEmail {
  to: string;
  subject: string;
  htmlContent?: string;
  textContent?: string;
  fromName?: string;
  fromEmail?: string;
}

export interface OmnisendEvent {
  eventType: string;
  contact: {
    email: string;
    firstName?: string;
    lastName?: string;
  };
  eventData?: Record<string, string | number | boolean>;
}

export class OmnisendClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.omnisend.com/v5';
  }

  /**
   * Create or update a contact in Omnisend
   */
  async createContact(contact: OmnisendContact): Promise<{ success: boolean; contactId?: string; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/contacts`, {
        method: 'POST',
        headers: {
          'X-API-KEY': this.apiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(contact),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return {
        success: true,
        contactId: data.contactID,
      };
    } catch (error) {
      console.error('Omnisend createContact error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Send a transactional email through Omnisend
   */
  async sendEmail(email: OmnisendEmail): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      // For transactional emails, we'll use Omnisend's Events API
      // This triggers automated emails based on events
      const eventData = {
        eventType: 'transactional_email',
        contact: {
          email: email.to,
        },
        eventData: {
          subject: email.subject,
          htmlContent: email.htmlContent,
          textContent: email.textContent,
          fromName: email.fromName,
          fromEmail: email.fromEmail,
        },
      };

      const response = await fetch(`${this.baseUrl}/events`, {
        method: 'POST',
        headers: {
          'X-API-KEY': this.apiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return {
        success: true,
        messageId: data.eventID,
      };
    } catch (error) {
      console.error('Omnisend sendEmail error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Track an event for a contact
   */
  async trackEvent(event: OmnisendEvent): Promise<{ success: boolean; eventId?: string; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/events`, {
        method: 'POST',
        headers: {
          'X-API-KEY': this.apiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(event),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return {
        success: true,
        eventId: data.eventID,
      };
    } catch (error) {
      console.error('Omnisend trackEvent error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get contact information
   */
  async getContact(email: string): Promise<{ success: boolean; contact?: Record<string, unknown>; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/contacts?email=${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
          'X-API-KEY': this.apiKey,
          'Accept': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return {
        success: true,
        contact: data.contacts?.[0] || null,
      };
    } catch (error) {
      console.error('Omnisend getContact error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
}

// Create a singleton instance
let omnisendClient: OmnisendClient | null = null;

export function getOmnisendClient(): OmnisendClient {
  if (!omnisendClient) {
    const apiKey = process.env.OMNISEND_API_KEY;
    if (!apiKey) {
      throw new Error('OMNISEND_API_KEY environment variable is not set');
    }
    omnisendClient = new OmnisendClient(apiKey);
  }
  return omnisendClient;
}
