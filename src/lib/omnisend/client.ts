/**
 * Omnisend API Client
 * Handles all email communications through Omnisend API
 */

import { omnisendConfig } from './config';

export interface OmnisendContact {
  email: string;
  firstName?: string;
  lastName?: string;
  tags?: string[];
  customFields?: Record<string, string | number | boolean>;
}

export interface OmnisendEmailTemplate {
  templateId: string;
  subject: string;
  content: string;
  variables?: Record<string, string | number | boolean>;
}

export interface OmnisendEmailRequest {
  to: string;
  templateId?: string;
  subject?: string;
  content?: string;
  variables?: Record<string, string | number | boolean>;
  fromName?: string;
  fromEmail?: string;
}

export class OmnisendClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || omnisendConfig.apiKey;
    this.baseUrl = omnisendConfig.baseUrl;

    if (!this.apiKey) {
      throw new Error(
        'Omnisend API key is required. Please set OMNISEND_API_KEY environment variable.',
      );
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    console.log('📧 Omnisend API Request:', {
      url,
      method: options.method || 'GET',
      endpoint,
    });

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': this.apiKey,
        ...options.headers,
      },
    });

    console.log('📧 Omnisend API Response:', {
      status: response.status,
      statusText: response.statusText,
      endpoint,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('📧 Omnisend API Error:', {
        status: response.status,
        error: errorData,
        endpoint,
      });
      throw new Error(
        `Omnisend API error: ${response.status} - ${
          errorData.message || response.statusText
        }`,
      );
    }

    const data = await response.json();
    console.log('📧 Omnisend API Success:', {
      endpoint,
      dataKeys: Object.keys(data),
    });

    return data;
  }

  /**
   * Create or update a contact in Omnisend
   */
  async createContact(
    contact: OmnisendContact,
  ): Promise<{ success: boolean; contactId?: string }> {
    return this.makeRequest('/contacts', {
      method: 'POST',
      body: JSON.stringify({
        email: contact.email,
        firstName: contact.firstName,
        lastName: contact.lastName,
        tags: contact.tags || [],
        customFields: contact.customFields || {},
      }),
    });
  }

  /**
   * Send a transactional email
   */
  async sendEmail(
    emailRequest: OmnisendEmailRequest,
  ): Promise<{ success: boolean; messageId?: string }> {
    const payload: Record<string, unknown> = {
      to: emailRequest.to,
      fromName: emailRequest.fromName || omnisendConfig.defaultFromName,
      fromEmail: emailRequest.fromEmail || omnisendConfig.defaultFromEmail,
      trackOpens: omnisendConfig.settings.trackOpens,
      trackClicks: omnisendConfig.settings.trackClicks,
    };

    if (emailRequest.templateId) {
      payload.templateId = emailRequest.templateId;
      payload.variables = emailRequest.variables || {};
    } else {
      payload.subject = emailRequest.subject;
      payload.content = emailRequest.content;
    }

    return this.makeRequest('/emails', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  /**
   * Send approval email to new user
   */
  async sendApprovalEmail(
    email: string,
    name: string,
    approvalUrl: string,
  ): Promise<{ success: boolean; messageId?: string }> {
    const subject = omnisendConfig.templates.approval.subject;
    const content = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb;">Welcome to OSFS Formation!</h2>

            <p>Dear ${name},</p>

            <p>Your account has been approved and you can now access the OSFS Formation platform.</p>

            <p>Please click the button below to confirm your account and set your password:</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${approvalUrl}"
                 style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Confirm Account
              </a>
            </div>

            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #666;">${approvalUrl}</p>

            <p>If you have any questions, please don't hesitate to contact us.</p>

            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="font-size: 12px; color: #666;">
              This email was sent from OSFS Formation. If you didn't request this, please ignore this email.
            </p>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject,
      content,
    });
  }

  /**
   * Send document recommendation email
   */
  async sendDocumentEmail(
    email: string,
    name: string,
    documents: Array<{ id: string; title: string }>,
    loginUrl: string,
  ): Promise<{ success: boolean; messageId?: string }> {
    const subject = omnisendConfig.templates.documentRecommendation.subject;
    const documentList = documents.map((doc) => `• ${doc.title}`).join('\n');

    const content = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb;">New Document Recommendations</h2>

            <p>Dear ${name},</p>

            <p>We have new document recommendations for you:</p>

            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #333;">Recommended Documents:</h3>
              <pre style="white-space: pre-line; font-family: Arial, sans-serif; margin: 0;">${documentList}</pre>
            </div>

            <p>Please log in to your account to view and download these documents:</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${loginUrl}"
                 style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                View Documents
              </a>
            </div>

            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #666;">${loginUrl}</p>

            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="font-size: 12px; color: #666;">
              This email was sent from OSFS Formation. If you didn't request this, please ignore this email.
            </p>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject,
      content,
    });
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(
    email: string,
    name: string,
    resetUrl: string,
  ): Promise<{ success: boolean; messageId?: string }> {
    const subject = omnisendConfig.templates.passwordReset.subject;
    const content = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb;">Password Reset Request</h2>

            <p>Dear ${name},</p>

            <p>You have requested to reset your password for your OSFS Formation account.</p>

            <p>Please click the button below to reset your password:</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}"
                 style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Reset Password
              </a>
            </div>

            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #666;">${resetUrl}</p>

            <p><strong>This link will expire in 1 hour for security reasons.</strong></p>

            <p>If you didn't request this password reset, please ignore this email.</p>

            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="font-size: 12px; color: #666;">
              This email was sent from OSFS Formation. If you didn't request this, please ignore this email.
            </p>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject,
      content,
    });
  }
}

// Create a lazy singleton instance
let _omnisendClient: OmnisendClient | null = null;

export const getOmnisendClient = (): OmnisendClient => {
  if (!_omnisendClient) {
    _omnisendClient = new OmnisendClient();
  }
  return _omnisendClient;
};

// For backward compatibility, export a getter
export const omnisendClient = {
  get sendApprovalEmail() {
    return getOmnisendClient().sendApprovalEmail.bind(getOmnisendClient());
  },
  get sendDocumentEmail() {
    return getOmnisendClient().sendDocumentEmail.bind(getOmnisendClient());
  },
  get sendPasswordResetEmail() {
    return getOmnisendClient().sendPasswordResetEmail.bind(getOmnisendClient());
  },
  get createContact() {
    return getOmnisendClient().createContact.bind(getOmnisendClient());
  },
  get sendEmail() {
    return getOmnisendClient().sendEmail.bind(getOmnisendClient());
  },
};
