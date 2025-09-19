# Omnisend Integration Setup

This document explains how to set up and use the Omnisend email integration for the OSFS Formation application.

## Environment Variables

Add the following environment variable to your `.env.local` file:

```bash
# Omnisend Configuration
OMNISEND_API_KEY=68cd36804a5b0b0d7aa7f706-DcjSo3QuZPEoUeLzYxO6bxTq12r4VBiSexPbsiyCEVlc6CQjky
```

## Features Implemented

### 1. Approval Emails

- **Endpoint**: `/api/send-approval-email`
- **Purpose**: Send account approval emails to new users
- **Features**:
  - Professional HTML email templates
  - Magic link generation for account confirmation
  - Contact creation in Omnisend with tags
  - Error handling and logging

### 2. Document Recommendation Emails

- **Endpoint**: `/[locale]/api/send-document-email`
- **Purpose**: Send document recommendation emails to users
- **Features**:
  - Bulk email sending to multiple recipients
  - Document list formatting
  - Contact tagging for segmentation
  - Detailed success/error reporting

### 3. Password Reset Emails

- **Method**: `omnisendClient.sendPasswordResetEmail()`
- **Purpose**: Send password reset emails
- **Features**:
  - Secure reset links
  - Professional email templates
  - Contact management

## API Client Features

### OmnisendClient Class

- **Location**: `src/lib/omnisend/client.ts`
- **Features**:
  - Contact management (create/update)
  - Email sending with templates
  - Error handling and logging
  - Configuration management

### Configuration

- **Location**: `src/lib/omnisend/config.ts`
- **Features**:
  - Centralized configuration
  - Email templates
  - Contact tags
  - Email settings

## Usage Examples

### Sending Approval Email

```typescript
import { omnisendClient } from '@/lib/omnisend/client';

await omnisendClient.sendApprovalEmail(
  'user@example.com',
  'John Doe',
  'https://app.example.com/confirm?token=abc123',
);
```

### Sending Document Recommendations

```typescript
await omnisendClient.sendDocumentEmail(
  'user@example.com',
  'John Doe',
  [
    { id: '1', title: 'Document 1' },
    { id: '2', title: 'Document 2' },
  ],
  'https://app.example.com/dashboard',
);
```

### Creating Contacts

```typescript
await omnisendClient.createContact({
  email: 'user@example.com',
  firstName: 'John',
  lastName: 'Doe',
  tags: ['osfs-formation', 'active'],
  customFields: {
    role: 'user',
    region: 'europe',
  },
});
```

## Email Templates

All emails use professional HTML templates with:

- Responsive design
- Brand colors (#2563eb)
- Clear call-to-action buttons
- Unsubscribe links
- Professional formatting

## Contact Tags

The system uses the following tags for contact segmentation:

- `osfs-formation` - General application tag
- `pending-approval` - Users awaiting approval
- `document-recommendations` - Users who receive document emails
- `approved` - Approved users
- `active` - Active users

## Error Handling

The integration includes comprehensive error handling:

- API key validation
- Network error handling
- Email sending failures
- Contact creation errors
- Detailed logging for debugging

## Testing

To test the integration:

1. **Set up environment variables**
2. **Test approval emails**: Use the admin panel to approve a user
3. **Test document emails**: Use the document recommendation feature
4. **Check Omnisend dashboard**: Verify contacts and email delivery

## Monitoring

Monitor the integration through:

- Application logs (console output)
- Omnisend dashboard
- Email delivery reports
- Contact segmentation

## Troubleshooting

### Common Issues

1. **API Key Error**: Ensure `OMNISEND_API_KEY` is set correctly
2. **Email Not Sending**: Check Omnisend API status and logs
3. **Contact Creation Failed**: Verify email format and API permissions
4. **Template Issues**: Check HTML content and variable substitution

### Debug Steps

1. Check environment variables
2. Verify API key permissions
3. Review application logs
4. Test with Omnisend API directly
5. Check email deliverability settings

## Security Considerations

- API keys are stored securely in environment variables
- Email content is sanitized
- Rate limiting is implemented
- Error messages don't expose sensitive information
- Contact data is handled according to privacy regulations

## Future Enhancements

Potential improvements:

- Email templates in Omnisend dashboard
- Advanced segmentation
- A/B testing for email content
- Analytics and reporting
- Automated email sequences
- Integration with user behavior tracking
