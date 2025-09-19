/**
 * Email service using Omnisend
 * Handles sending emails through Omnisend API
 */

import { getOmnisendClient, OmnisendContact, OmnisendEmail } from './client';
import { generateDocumentEmailTemplate, generateApprovalEmailTemplate } from './templates';

export interface EmailRecipient {
  email: string;
  name: string;
}

export interface DocumentEmailRequest {
  recipients: EmailRecipient[];
  documentTitles: string[];
  loginUrl: string;
  locale: string;
}

export interface ApprovalEmailRequest {
  recipient: EmailRecipient;
  loginUrl: string;
  locale: string;
}

export interface EmailResult {
  success: boolean;
  sentCount: number;
  failedCount: number;
  errors: string[];
  messageIds: string[];
}

/**
 * Send document recommendation emails
 */
export async function sendDocumentEmails(request: DocumentEmailRequest): Promise<EmailResult> {
  const { recipients, documentTitles, loginUrl, locale } = request;
  const omnisend = getOmnisendClient();
  
  const results: EmailResult = {
    success: true,
    sentCount: 0,
    failedCount: 0,
    errors: [],
    messageIds: [],
  };

  for (const recipient of recipients) {
    try {
      // First, ensure the contact exists in Omnisend
      const contactData: OmnisendContact = {
        identifiers: [{
          type: 'email',
          id: recipient.email,
          channels: {
            email: {
              status: 'subscribed',
              statusDate: new Date().toISOString(),
            },
          },
        }],
        firstName: recipient.name.split(' ')[0],
        lastName: recipient.name.split(' ').slice(1).join(' '),
        tags: ['document-recipient'],
      };

      // Create or update contact
      const contactResult = await omnisend.createContact(contactData);
      if (!contactResult.success) {
        console.warn(`Failed to create/update contact for ${recipient.email}:`, contactResult.error);
        // Continue with email sending even if contact creation fails
      }

      // Generate email template
      const template = generateDocumentEmailTemplate({
        recipientName: recipient.name,
        documentTitles,
        loginUrl,
        locale,
      });

      // Send email
      const emailData: OmnisendEmail = {
        to: recipient.email,
        subject: template.subject,
        htmlContent: template.htmlContent,
        textContent: template.textContent,
        fromName: 'OSFS Formation',
        fromEmail: 'noreply@osfs-formation.com',
      };

      const emailResult = await omnisend.sendEmail(emailData);
      
      if (emailResult.success) {
        results.sentCount++;
        if (emailResult.messageId) {
          results.messageIds.push(emailResult.messageId);
        }
        console.log(`Document email sent successfully to ${recipient.email}`);
      } else {
        results.failedCount++;
        results.errors.push(`Failed to send to ${recipient.email}: ${emailResult.error}`);
        console.error(`Failed to send document email to ${recipient.email}:`, emailResult.error);
      }
    } catch (error) {
      results.failedCount++;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      results.errors.push(`Failed to send to ${recipient.email}: ${errorMessage}`);
      console.error(`Error sending document email to ${recipient.email}:`, error);
    }
  }

  // Update overall success status
  results.success = results.failedCount === 0;
  
  return results;
}

/**
 * Send approval email
 */
export async function sendApprovalEmail(request: ApprovalEmailRequest): Promise<EmailResult> {
  const { recipient, loginUrl, locale } = request;
  const omnisend = getOmnisendClient();
  
  const results: EmailResult = {
    success: true,
    sentCount: 0,
    failedCount: 0,
    errors: [],
    messageIds: [],
  };

  try {
    // First, ensure the contact exists in Omnisend
    const contactData: OmnisendContact = {
      identifiers: [{
        type: 'email',
        id: recipient.email,
        channels: {
          email: {
            status: 'subscribed',
            statusDate: new Date().toISOString(),
          },
        },
      }],
      firstName: recipient.name.split(' ')[0],
      lastName: recipient.name.split(' ').slice(1).join(' '),
      tags: ['approved-user'],
    };

    // Create or update contact
    const contactResult = await omnisend.createContact(contactData);
    if (!contactResult.success) {
      console.warn(`Failed to create/update contact for ${recipient.email}:`, contactResult.error);
      // Continue with email sending even if contact creation fails
    }

    // Generate email template
    const template = generateApprovalEmailTemplate({
      recipientName: recipient.name,
      loginUrl,
      locale,
    });

    // Send email
    const emailData: OmnisendEmail = {
      to: recipient.email,
      subject: template.subject,
      htmlContent: template.htmlContent,
      textContent: template.textContent,
      fromName: 'OSFS Formation',
      fromEmail: 'noreply@osfs-formation.com',
    };

    const emailResult = await omnisend.sendEmail(emailData);
    
    if (emailResult.success) {
      results.sentCount = 1;
      if (emailResult.messageId) {
        results.messageIds.push(emailResult.messageId);
      }
      console.log(`Approval email sent successfully to ${recipient.email}`);
    } else {
      results.failedCount = 1;
      results.errors.push(`Failed to send to ${recipient.email}: ${emailResult.error}`);
      console.error(`Failed to send approval email to ${recipient.email}:`, emailResult.error);
    }
  } catch (error) {
    results.failedCount = 1;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    results.errors.push(`Failed to send to ${recipient.email}: ${errorMessage}`);
    console.error(`Error sending approval email to ${recipient.email}:`, error);
  }

  // Update overall success status
  results.success = results.failedCount === 0;
  
  return results;
}

/**
 * Track user events in Omnisend
 */
export async function trackUserEvent(
  email: string,
  eventType: string,
  eventData?: Record<string, string | number | boolean>
): Promise<{ success: boolean; error?: string }> {
  try {
    const omnisend = getOmnisendClient();
    
    const result = await omnisend.trackEvent({
      eventType,
      contact: {
        email,
      },
      eventData,
    });

    if (result.success) {
      console.log(`Event ${eventType} tracked successfully for ${email}`);
      return { success: true };
    } else {
      console.error(`Failed to track event ${eventType} for ${email}:`, result.error);
      return { success: false, error: result.error };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error tracking event ${eventType} for ${email}:`, error);
    return { success: false, error: errorMessage };
  }
}
