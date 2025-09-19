/**
 * Omnisend Configuration
 * Environment variables and configuration for Omnisend integration
 */

export const omnisendConfig = {
  apiKey: process.env.OMNISEND_API_KEY || '',
  baseUrl: 'https://api.omnisend.com/v3',
  defaultFromName: 'OSFS Formation',
  defaultFromEmail: 'noreply@osfs-formation.com',

  // Email templates
  templates: {
    approval: {
      subject: 'Account Approval - OSFS Formation',
      templateId: 'approval-template', // Optional: if using Omnisend templates
    },
    documentRecommendation: {
      subject: 'New Document Recommendations - OSFS Formation',
      templateId: 'document-template', // Optional: if using Omnisend templates
    },
    passwordReset: {
      subject: 'Password Reset - OSFS Formation',
      templateId: 'password-reset-template', // Optional: if using Omnisend templates
    },
  },

  // Contact tags
  tags: {
    osfsFormation: 'osfs-formation',
    pendingApproval: 'pending-approval',
    documentRecommendations: 'document-recommendations',
    approved: 'approved',
    active: 'active',
  },

  // Email settings
  settings: {
    trackOpens: true,
    trackClicks: true,
    unsubscribe: true,
  },
};

export default omnisendConfig;
