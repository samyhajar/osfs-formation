/**
 * Email templates for Omnisend integration
 */

export interface EmailTemplate {
  subject: string;
  htmlContent: string;
  textContent: string;
}

export interface DocumentEmailData {
  recipientName: string;
  documentTitles: string[];
  loginUrl: string;
  locale: string;
}

export interface ApprovalEmailData {
  recipientName: string;
  loginUrl: string;
  locale: string;
}

/**
 * Generate document recommendation email template
 */
export function generateDocumentEmailTemplate(data: DocumentEmailData): EmailTemplate {
  const { recipientName, documentTitles, loginUrl, locale } = data;
  
  const documentList = documentTitles.map(title => `• ${title}`).join('\n');
  
  const subject = locale === 'fr' 
    ? 'Nouveaux documents recommandés pour vous'
    : locale === 'es'
    ? 'Nuevos documentos recomendados para ti'
    : locale === 'de'
    ? 'Neue empfohlene Dokumente für Sie'
    : locale === 'it'
    ? 'Nuovi documenti consigliati per te'
    : locale === 'pt'
    ? 'Novos documentos recomendados para você'
    : locale === 'nl'
    ? 'Nieuwe aanbevolen documenten voor u'
    : 'New documents recommended for you';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h1 style="color: #2c3e50; margin: 0 0 10px 0;">${subject}</h1>
        <p style="margin: 0; color: #666;">
          ${locale === 'fr' 
            ? 'Bonjour'
            : locale === 'es'
            ? 'Hola'
            : locale === 'de'
            ? 'Hallo'
            : locale === 'it'
            ? 'Ciao'
            : locale === 'pt'
            ? 'Olá'
            : locale === 'nl'
            ? 'Hallo'
            : 'Hello'
          } ${recipientName},
        </p>
      </div>
      
      <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #e9ecef;">
        <p style="margin: 0 0 15px 0;">
          ${locale === 'fr'
            ? 'Nous avons de nouveaux documents à vous recommander :'
            : locale === 'es'
            ? 'Tenemos nuevos documentos para recomendarte:'
            : locale === 'de'
            ? 'Wir haben neue Dokumente für Sie zu empfehlen:'
            : locale === 'it'
            ? 'Abbiamo nuovi documenti da consigliarti:'
            : locale === 'pt'
            ? 'Temos novos documentos para recomendar:'
            : locale === 'nl'
            ? 'We hebben nieuwe documenten om aan te bevelen:'
            : 'We have new documents to recommend to you:'
          }
        </p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; margin: 15px 0;">
          <h3 style="margin: 0 0 10px 0; color: #2c3e50;">
            ${locale === 'fr'
              ? 'Documents recommandés :'
              : locale === 'es'
              ? 'Documentos recomendados:'
              : locale === 'de'
              ? 'Empfohlene Dokumente:'
              : locale === 'it'
              ? 'Documenti consigliati:'
              : locale === 'pt'
              ? 'Documentos recomendados:'
              : locale === 'nl'
              ? 'Aanbevolen documenten:'
              : 'Recommended documents:'
            }
          </h3>
          <ul style="margin: 0; padding-left: 20px;">
            ${documentTitles.map(title => `<li style="margin: 5px 0;">${title}</li>`).join('')}
          </ul>
        </div>
        
        <div style="text-align: center; margin: 25px 0;">
          <a href="${loginUrl}" 
             style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">
            ${locale === 'fr'
              ? 'Accéder aux documents'
              : locale === 'es'
              ? 'Acceder a los documentos'
              : locale === 'de'
              ? 'Auf Dokumente zugreifen'
              : locale === 'it'
              ? 'Accedi ai documenti'
              : locale === 'pt'
              ? 'Acessar documentos'
              : locale === 'nl'
              ? 'Toegang tot documenten'
              : 'Access documents'
            }
          </a>
        </div>
        
        <p style="margin: 20px 0 0 0; color: #666; font-size: 14px;">
          ${locale === 'fr'
            ? 'Connectez-vous à votre compte pour consulter ces nouveaux documents.'
            : locale === 'es'
            ? 'Inicia sesión en tu cuenta para revisar estos nuevos documentos.'
            : locale === 'de'
            ? 'Melden Sie sich in Ihrem Konto an, um diese neuen Dokumente zu überprüfen.'
            : locale === 'it'
            ? 'Accedi al tuo account per rivedere questi nuovi documenti.'
            : locale === 'pt'
            ? 'Faça login em sua conta para revisar estes novos documentos.'
            : locale === 'nl'
            ? 'Log in op uw account om deze nieuwe documenten te bekijken.'
            : 'Log in to your account to review these new documents.'
          }
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; color: #666; font-size: 12px;">
        <p style="margin: 0;">
          ${locale === 'fr'
            ? 'Cet email a été envoyé automatiquement. Veuillez ne pas y répondre.'
            : locale === 'es'
            ? 'Este correo fue enviado automáticamente. Por favor no respondas.'
            : locale === 'de'
            ? 'Diese E-Mail wurde automatisch gesendet. Bitte antworten Sie nicht.'
            : locale === 'it'
            ? 'Questa email è stata inviata automaticamente. Si prega di non rispondere.'
            : locale === 'pt'
            ? 'Este email foi enviado automaticamente. Por favor não responda.'
            : locale === 'nl'
            ? 'Deze e-mail is automatisch verzonden. Reageer niet.'
            : 'This email was sent automatically. Please do not reply.'
          }
        </p>
      </div>
    </body>
    </html>
  `;

  const textContent = `
${subject}

${locale === 'fr' 
  ? 'Bonjour'
  : locale === 'es'
  ? 'Hola'
  : locale === 'de'
  ? 'Hallo'
  : locale === 'it'
  ? 'Ciao'
  : locale === 'pt'
  ? 'Olá'
  : locale === 'nl'
  ? 'Hallo'
  : 'Hello'
} ${recipientName},

${locale === 'fr'
  ? 'Nous avons de nouveaux documents à vous recommander :'
  : locale === 'es'
  ? 'Tenemos nuevos documentos para recomendarte:'
  : locale === 'de'
  ? 'Wir haben neue Dokumente für Sie zu empfehlen:'
  : locale === 'it'
  ? 'Abbiamo nuovi documenti da consigliarti:'
  : locale === 'pt'
  ? 'Temos novos documentos para recomendar:'
  : locale === 'nl'
  ? 'We hebben nieuwe documenten om aan te bevelen:'
  : 'We have new documents to recommend to you:'
}

${documentList}

${locale === 'fr'
  ? 'Accédez aux documents :'
  : locale === 'es'
  ? 'Accede a los documentos:'
  : locale === 'de'
  ? 'Zugriff auf Dokumente:'
  : locale === 'it'
  ? 'Accedi ai documenti:'
  : locale === 'pt'
  ? 'Acesse os documentos:'
  : locale === 'nl'
  ? 'Toegang tot documenten:'
  : 'Access documents:'
}
${loginUrl}

${locale === 'fr'
  ? 'Connectez-vous à votre compte pour consulter ces nouveaux documents.'
  : locale === 'es'
  ? 'Inicia sesión en tu cuenta para revisar estos nuevos documentos.'
  : locale === 'de'
  ? 'Melden Sie sich in Ihrem Konto an, um diese neuen Dokumente zu überprüfen.'
  : locale === 'it'
  ? 'Accedi al tuo account per rivedere questi nuovi documenti.'
  : locale === 'pt'
  ? 'Faça login em sua conta para revisar estes novos documentos.'
  : locale === 'nl'
  ? 'Log in op uw account om deze nieuwe documenten te bekijken.'
  : 'Log in to your account to review these new documents.'
}
  `;

  return {
    subject,
    htmlContent,
    textContent,
  };
}

/**
 * Generate approval email template
 */
export function generateApprovalEmailTemplate(data: ApprovalEmailData): EmailTemplate {
  const { recipientName, loginUrl, locale } = data;
  
  const subject = locale === 'fr' 
    ? 'Votre compte a été approuvé'
    : locale === 'es'
    ? 'Tu cuenta ha sido aprobada'
    : locale === 'de'
    ? 'Ihr Konto wurde genehmigt'
    : locale === 'it'
    ? 'Il tuo account è stato approvato'
    : locale === 'pt'
    ? 'Sua conta foi aprovada'
    : locale === 'nl'
    ? 'Uw account is goedgekeurd'
    : 'Your account has been approved';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #d4edda; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #c3e6cb;">
        <h1 style="color: #155724; margin: 0 0 10px 0;">${subject}</h1>
        <p style="margin: 0; color: #155724;">
          ${locale === 'fr' 
            ? 'Félicitations'
            : locale === 'es'
            ? 'Felicitaciones'
            : locale === 'de'
            ? 'Herzlichen Glückwunsch'
            : locale === 'it'
            ? 'Congratulazioni'
            : locale === 'pt'
            ? 'Parabéns'
            : locale === 'nl'
            ? 'Gefeliciteerd'
            : 'Congratulations'
          } ${recipientName}!
        </p>
      </div>
      
      <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #e9ecef;">
        <p style="margin: 0 0 15px 0;">
          ${locale === 'fr'
            ? 'Votre compte a été approuvé avec succès. Vous pouvez maintenant accéder à la plateforme et commencer à utiliser tous les services disponibles.'
            : locale === 'es'
            ? 'Tu cuenta ha sido aprobada exitosamente. Ahora puedes acceder a la plataforma y comenzar a usar todos los servicios disponibles.'
            : locale === 'de'
            ? 'Ihr Konto wurde erfolgreich genehmigt. Sie können jetzt auf die Plattform zugreifen und alle verfügbaren Dienste nutzen.'
            : locale === 'it'
            ? 'Il tuo account è stato approvato con successo. Ora puoi accedere alla piattaforma e iniziare a utilizzare tutti i servizi disponibili.'
            : locale === 'pt'
            ? 'Sua conta foi aprovada com sucesso. Agora você pode acessar a plataforma e começar a usar todos os serviços disponíveis.'
            : locale === 'nl'
            ? 'Uw account is succesvol goedgekeurd. U kunt nu toegang krijgen tot het platform en alle beschikbare services gaan gebruiken.'
            : 'Your account has been successfully approved. You can now access the platform and start using all available services.'
          }
        </p>
        
        <div style="text-align: center; margin: 25px 0;">
          <a href="${loginUrl}" 
             style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">
            ${locale === 'fr'
              ? 'Accéder à la plateforme'
              : locale === 'es'
              ? 'Acceder a la plataforma'
              : locale === 'de'
              ? 'Auf die Plattform zugreifen'
              : locale === 'it'
              ? 'Accedi alla piattaforma'
              : locale === 'pt'
              ? 'Acessar a plataforma'
              : locale === 'nl'
              ? 'Toegang tot het platform'
              : 'Access platform'
            }
          </a>
        </div>
        
        <p style="margin: 20px 0 0 0; color: #666; font-size: 14px;">
          ${locale === 'fr'
            ? 'Si vous avez des questions ou besoin d\'aide, n\'hésitez pas à nous contacter.'
            : locale === 'es'
            ? 'Si tienes preguntas o necesitas ayuda, no dudes en contactarnos.'
            : locale === 'de'
            ? 'Wenn Sie Fragen haben oder Hilfe benötigen, zögern Sie nicht, uns zu kontaktieren.'
            : locale === 'it'
            ? 'Se hai domande o hai bisogno di aiuto, non esitare a contattarci.'
            : locale === 'pt'
            ? 'Se você tiver dúvidas ou precisar de ajuda, não hesite em nos contatar.'
            : locale === 'nl'
            ? 'Als u vragen heeft of hulp nodig heeft, aarzel dan niet om contact met ons op te nemen.'
            : 'If you have any questions or need assistance, please don\'t hesitate to contact us.'
          }
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; color: #666; font-size: 12px;">
        <p style="margin: 0;">
          ${locale === 'fr'
            ? 'Cet email a été envoyé automatiquement. Veuillez ne pas y répondre.'
            : locale === 'es'
            ? 'Este correo fue enviado automáticamente. Por favor no respondas.'
            : locale === 'de'
            ? 'Diese E-Mail wurde automatisch gesendet. Bitte antworten Sie nicht.'
            : locale === 'it'
            ? 'Questa email è stata inviata automaticamente. Si prega di non rispondere.'
            : locale === 'pt'
            ? 'Este email foi enviado automaticamente. Por favor não responda.'
            : locale === 'nl'
            ? 'Deze e-mail is automatisch verzonden. Reageer niet.'
            : 'This email was sent automatically. Please do not reply.'
          }
        </p>
      </div>
    </body>
    </html>
  `;

  const textContent = `
${subject}

${locale === 'fr' 
  ? 'Félicitations'
  : locale === 'es'
  ? 'Felicitaciones'
  : locale === 'de'
  ? 'Herzlichen Glückwunsch'
  : locale === 'it'
  ? 'Congratulazioni'
  : locale === 'pt'
  ? 'Parabéns'
  : locale === 'nl'
  ? 'Gefeliciteerd'
  : 'Congratulations'
} ${recipientName}!

${locale === 'fr'
  ? 'Votre compte a été approuvé avec succès. Vous pouvez maintenant accéder à la plateforme et commencer à utiliser tous les services disponibles.'
  : locale === 'es'
  ? 'Tu cuenta ha sido aprobada exitosamente. Ahora puedes acceder a la plataforma y comenzar a usar todos los servicios disponibles.'
  : locale === 'de'
  ? 'Ihr Konto wurde erfolgreich genehmigt. Sie können jetzt auf die Plattform zugreifen und alle verfügbaren Dienste nutzen.'
  : locale === 'it'
  ? 'Il tuo account è stato approvato con successo. Ora puoi accedere alla piattaforma e iniziare a utilizzare tutti i servizi disponibili.'
  : locale === 'pt'
  ? 'Sua conta foi aprovada com sucesso. Agora você pode acessar a plataforma e começar a usar todos os serviços disponíveis.'
  : locale === 'nl'
  ? 'Uw account is succesvol goedgekeurd. U kunt nu toegang krijgen tot het platform en alle beschikbare services gaan gebruiken.'
  : 'Your account has been successfully approved. You can now access the platform and start using all available services.'
}

${locale === 'fr'
  ? 'Accédez à la plateforme :'
  : locale === 'es'
  ? 'Accede a la plataforma:'
  : locale === 'de'
  ? 'Zugriff auf die Plattform:'
  : locale === 'it'
  ? 'Accedi alla piattaforma:'
  : locale === 'pt'
  ? 'Acesse a plataforma:'
  : locale === 'nl'
  ? 'Toegang tot het platform:'
  : 'Access platform:'
}
${loginUrl}

${locale === 'fr'
  ? 'Si vous avez des questions ou besoin d\'aide, n\'hésitez pas à nous contacter.'
  : locale === 'es'
  ? 'Si tienes preguntas o necesitas ayuda, no dudes en contactarnos.'
  : locale === 'de'
  ? 'Wenn Sie Fragen haben oder Hilfe benötigen, zögern Sie nicht, uns zu kontaktieren.'
  : locale === 'it'
  ? 'Se hai domande o hai bisogno di aiuto, non esitare a contattarci.'
  : locale === 'pt'
  ? 'Se você tiver dúvidas ou precisar de ajuda, não hesite em nos contatar.'
  : locale === 'nl'
  ? 'Als u vragen heeft of hulp nodig heeft, aarzel dan niet om contact met ons op te nemen.'
  : 'If you have any questions or need assistance, please don\'t hesitate to contact us.'
}
  `;

  return {
    subject,
    htmlContent,
    textContent,
  };
}
