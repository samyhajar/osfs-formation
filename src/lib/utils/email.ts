import type { WPMember } from '@/lib/wordpress/types';

/**
 * Extracts email address from member data.
 * Tries multiple sources: meta fields, ACF fields, and fallback to generated email.
 */
export function getMemberEmail(member: WPMember): string {
  // Try to get email from meta fields
  if (typeof member.meta?.email === 'string') {
    return member.meta.email;
  }

  if (typeof member.meta?.contact_email === 'string') {
    return member.meta.contact_email;
  }

  // Try to get email from ACF fields
  if (member.acf) {
    const acfEmail =
      member.acf.email || member.acf.contact_email || member.acf.email_address;
    if (typeof acfEmail === 'string' && acfEmail.includes('@')) {
      return acfEmail;
    }
  }

  // Fallback: generate email based on name
  const name = member.title.rendered;
  const emailName = name
    .toLowerCase()
    .replace(/[^a-z\s]/g, '') // Remove non-letter characters except spaces
    .replace(/\s+/g, '.') // Replace spaces with dots
    .replace(/\.+/g, '.') // Replace multiple dots with single dot
    .replace(/^\.+|\.+$/g, ''); // Remove leading/trailing dots

  const generatedEmail = `${emailName}@osfs.org`;
  console.log(`📧 Generated email for ${name}: ${generatedEmail}`);
  return generatedEmail;
}

/**
 * Opens the default email client with the provided email addresses.
 */
export function openEmailClient(
  emails: string[],
  subject?: string,
  body?: string,
): void {
  console.log(`📧 Opening email client with ${emails.length} emails:`, emails);

  if (emails.length === 0) {
    console.warn('No email addresses provided');
    return;
  }

  // Filter out invalid emails
  const validEmails = emails.filter(
    (email) => email && email.includes('@') && email.includes('.'),
  );

  if (validEmails.length === 0) {
    console.warn('No valid email addresses provided');
    alert('No valid email addresses found. Please contact the administrator.');
    return;
  }

  let mailtoUrl = `mailto:${validEmails.join(',')}`;

  if (subject) {
    mailtoUrl += `?subject=${encodeURIComponent(subject)}`;
  }

  if (body) {
    const separator = subject ? '&' : '?';
    mailtoUrl += `${separator}body=${encodeURIComponent(body)}`;
  }

  // Check if URL is too long (some email clients have limits)
  if (mailtoUrl.length > 2000) {
    console.warn('Email URL too long, opening with first few recipients');
    const truncatedEmails = validEmails.slice(
      0,
      Math.floor(validEmails.length / 2),
    );
    openEmailClient(truncatedEmails, subject, body);

    // Notify user about truncation
    alert(
      `Email opened with ${
        truncatedEmails.length
      } recipients. Due to technical limitations, please send separate emails to the remaining ${
        validEmails.length - truncatedEmails.length
      } recipients.`,
    );
    return;
  }

  try {
    console.log(`📧 Opening mailto URL:`, mailtoUrl);

    // Try multiple methods to open email client without navigation
    let emailClientAttempted = false;

    // Method 1: Try with iframe (doesn't navigate the page)
    try {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.style.width = '1px';
      iframe.style.height = '1px';
      iframe.src = mailtoUrl;
      document.body.appendChild(iframe);

      // Remove iframe after attempting to trigger email client
      setTimeout(() => {
        try {
          document.body.removeChild(iframe);
        } catch (_e) {
          // Ignore removal errors
        }
      }, 2000);

      emailClientAttempted = true;
      console.log('📧 Attempted to open email client via iframe');
    } catch (e) {
      console.warn('iframe method failed:', e);
    }

    // Method 2: Try with a new window that closes quickly
    if (!emailClientAttempted) {
      try {
        const emailWindow = window.open(
          mailtoUrl,
          '_blank',
          'width=1,height=1',
        );
        if (emailWindow) {
          // Close the window after a short delay
          setTimeout(() => {
            try {
              emailWindow.close();
            } catch (_e) {
              // Ignore close errors
            }
          }, 1000);
          emailClientAttempted = true;
          console.log('📧 Attempted to open email client via popup window');
        }
      } catch (e) {
        console.warn('popup window method failed:', e);
      }
    }

    // Always show the helpful modal since mailto behavior is unpredictable
    // This gives users the email addresses and options regardless
    setTimeout(() => {
      handleEmailClientFailure(validEmails, mailtoUrl);
    }, 1000);
  } catch (error) {
    console.error('Failed to open email client:', error);
    handleEmailClientFailure(validEmails, mailtoUrl);
  }
}

/**
 * Handles email client failure with user-friendly fallbacks
 */
function handleEmailClientFailure(emails: string[], mailtoUrl: string): void {
  // Show a modal with options instead of just copying to clipboard
  const emailList = emails.join(', ');

  const _message = `Unable to open your email client automatically. Here are your options:

📧 Email addresses: ${emailList}

📋 Click "Copy Emails" to copy addresses to clipboard
🔗 Click "Try Again" to attempt opening email client
📱 Or manually compose an email with these addresses`;

  // Create a custom modal for better UX
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
    font-family: system-ui, -apple-system, sans-serif;
  `;

  const modalContent = document.createElement('div');
  modalContent.style.cssText = `
    background: white;
    padding: 24px;
    border-radius: 8px;
    max-width: 500px;
    margin: 20px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  `;

  modalContent.innerHTML = `
    <h3 style="margin: 0 0 16px 0; color: #1f2937; font-size: 18px; font-weight: 600;">
      📧 Email Contact Options
    </h3>
    <p style="margin: 0 0 16px 0; color: #4b5563; line-height: 1.5;">
      We've attempted to open your email client. If it didn't open automatically, you can use these options:
    </p>
    <div style="background: #f3f4f6; padding: 12px; border-radius: 4px; margin: 16px 0; font-family: monospace; font-size: 14px; word-break: break-all;">
      ${emailList}
    </div>
    <div style="margin: 16px 0; padding: 12px; background: #fef3c7; border-radius: 4px; border-left: 4px solid #f59e0b;">
      <p style="margin: 0; font-size: 14px; color: #92400e;">
        <strong>💡 Tip:</strong> Copy the email addresses and paste them into your preferred email application (Gmail, Outlook, etc.)
      </p>
    </div>
    <div style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 20px;">
      <button id="copyEmails" style="
        background: #3b82f6;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
      ">📋 Copy Emails</button>
      <button id="openGmail" style="
        background: #dc2626;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
      ">📧 Open Gmail</button>
      <button id="tryAgain" style="
        background: #10b981;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
      ">🔄 Try Again</button>
      <button id="closeModal" style="
        background: #6b7280;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
      ">✕ Close</button>
    </div>
  `;

  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  // Add event listeners
  const copyButton = modal.querySelector('#copyEmails') as HTMLButtonElement;
  const gmailButton = modal.querySelector('#openGmail') as HTMLButtonElement;
  const tryAgainButton = modal.querySelector('#tryAgain') as HTMLButtonElement;
  const closeButton = modal.querySelector('#closeModal') as HTMLButtonElement;

  copyButton.addEventListener('click', () => {
    navigator.clipboard
      .writeText(emailList)
      .then(() => {
        copyButton.textContent = '✅ Copied!';
        copyButton.style.background = '#10b981';
        setTimeout(() => {
          copyButton.textContent = '📋 Copy Emails';
          copyButton.style.background = '#3b82f6';
        }, 2000);
      })
      .catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = emailList;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        copyButton.textContent = '✅ Copied!';
        copyButton.style.background = '#10b981';
      });
  });

  gmailButton.addEventListener('click', () => {
    // Open Gmail compose with the email addresses
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      emails.join(','),
    )}&su=${encodeURIComponent('Message from OSFS Formation')}`;
    window.open(gmailUrl, '_blank');
  });

  tryAgainButton.addEventListener('click', () => {
    window.open(mailtoUrl, '_blank');
  });

  closeButton.addEventListener('click', () => {
    document.body.removeChild(modal);
  });

  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
}

/**
 * Validates if an email address appears to be valid.
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Gets email addresses for multiple members.
 */
export function getMemberEmails(members: WPMember[]): string[] {
  return members.map((member) => getMemberEmail(member));
}
