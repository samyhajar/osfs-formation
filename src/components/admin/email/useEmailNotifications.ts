import { useState } from 'react';
import { useTranslations } from 'next-intl';

type UseEmailNotificationsProps = {
  selectedDocumentIds: string[];
  selectedUserIds: string[];
  onSuccess?: () => void;
};

export const useEmailNotifications = ({
  selectedDocumentIds,
  selectedUserIds,
  onSuccess,
}: UseEmailNotificationsProps) => {
  const t = useTranslations('EmailPage');
  const [sendingEmails, setSendingEmails] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const sendEmailNotifications = async () => {
    if (selectedDocumentIds.length === 0 || selectedUserIds.length === 0) {
      return;
    }

    try {
      setSendingEmails(true);
      setErrorMessage('');
      setSuccessMessage('');

      // Get the current locale from the URL path
      const locale = window.location.pathname.split('/')[1] || 'en';

      const response = await fetch(`/${locale}/api/send-document-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentIds: selectedDocumentIds,
          recipientIds: selectedUserIds,
        }),
      });

      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send email notifications');
      }

      setSuccessMessage(t('emailSuccess'));

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error sending email notifications:', error);
      setErrorMessage(error instanceof Error ? error.message : t('emailError'));
    } finally {
      setSendingEmails(false);
    }
  };

  return {
    sendingEmails,
    successMessage,
    errorMessage,
    sendEmailNotifications,
  };
};
