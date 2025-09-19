/**
 * Comprehensive Email Service using Omnisend
 * This service ensures all emails are sent through Omnisend instead of Supabase SMTP
 */

import { omnisendClient } from './client';

export interface EmailService {
  sendApprovalEmail: (email: string, name: string, approvalUrl: string) => Promise<{ success: boolean; messageId?: string }>;
  sendDocumentEmail: (email: string, name: string, documents: Array<{ id: string; title: string }>, loginUrl: string) => Promise<{ success: boolean; messageId?: string }>;
  sendPasswordResetEmail: (email: string, name: string, resetUrl: string) => Promise<{ success: boolean; messageId?: string }>;
  sendWelcomeEmail: (email: string, name: string, loginUrl: string) => Promise<{ success: boolean; messageId?: string }>;
  sendNotificationEmail: (email: string, name: string, subject: string, content: string) => Promise<{ success: boolean; messageId?: string }>;
}

class OmnisendEmailService implements EmailService {
  /**
   * Send account approval email
   */
  async sendApprovalEmail(
    email: string,
    name: string,
    approvalUrl: string,
  ): Promise<{ success: boolean; messageId?: string }> {
    try {
      const result = await omnisendClient.sendApprovalEmail(email, name, approvalUrl);
      
      // Create/update contact in Omnisend
      await omnisendClient.createContact({
        email,
        firstName: name,
        tags: ['osfs-formation', 'pending-approval'],
      });

      return result;
    } catch (error) {
      console.error('Error sending approval email:', error);
      throw error;
    }
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
    try {
      const result = await omnisendClient.sendDocumentEmail(email, name, documents, loginUrl);
      
      // Update contact in Omnisend with document recommendation tag
      await omnisendClient.createContact({
        email,
        firstName: name,
        tags: ['osfs-formation', 'document-recommendations'],
      });

      return result;
    } catch (error) {
      console.error('Error sending document email:', error);
      throw error;
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(
    email: string,
    name: string,
    resetUrl: string,
  ): Promise<{ success: boolean; messageId?: string }> {
    try {
      const result = await omnisendClient.sendPasswordResetEmail(email, name, resetUrl);
      
      // Update contact in Omnisend with password reset tag
      await omnisendClient.createContact({
        email,
        firstName: name,
        tags: ['osfs-formation', 'password-reset-requested'],
      });

      return result;
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  }

  /**
   * Send welcome email to newly approved users
   */
  async sendWelcomeEmail(
    email: string,
    name: string,
    loginUrl: string,
  ): Promise<{ success: boolean; messageId?: string }> {
    try {
      const subject = 'Welcome to OSFS Formation!';
      const content = `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #2563eb;">Welcome to OSFS Formation!</h2>

              <p>Dear ${name},</p>

              <p>Your account has been approved and you can now access the OSFS Formation platform.</p>

              <p>Please click the button below to log in to your account:</p>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${loginUrl}"
                   style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  Log In to Your Account
                </a>
              </div>

              <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #666;">${loginUrl}</p>

              <p>If you have any questions, please don't hesitate to contact us.</p>

              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              <p style="font-size: 12px; color: #666;">
                This email was sent from OSFS Formation.
              </p>
            </div>
          </body>
        </html>
      `;

      const result = await omnisendClient.sendEmail({
        to: email,
        subject,
        content,
      });

      // Update contact in Omnisend with welcome tag
      await omnisendClient.createContact({
        email,
        firstName: name,
        tags: ['osfs-formation', 'welcome', 'approved'],
      });

      return result;
    } catch (error) {
      console.error('Error sending welcome email:', error);
      throw error;
    }
  }

  /**
   * Send custom notification email
   */
  async sendNotificationEmail(
    email: string,
    name: string,
    subject: string,
    content: string,
  ): Promise<{ success: boolean; messageId?: string }> {
    try {
      const result = await omnisendClient.sendEmail({
        to: email,
        subject,
        content,
      });

      // Update contact in Omnisend with notification tag
      await omnisendClient.createContact({
        email,
        firstName: name,
        tags: ['osfs-formation', 'notifications'],
      });

      return result;
    } catch (error) {
      console.error('Error sending notification email:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const emailService = new OmnisendEmailService();

// Export the class for testing
export { OmnisendEmailService };
