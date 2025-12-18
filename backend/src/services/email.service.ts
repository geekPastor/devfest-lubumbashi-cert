import nodemailer from 'nodemailer';
import { config } from '../config';

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: config.email.service,
      auth: {
        user: config.email.user,
        pass: config.email.password
      }
    });
  }

  async sendVerificationCode(email: string, code: string): Promise<void> {
    const mailOptions = {
      from: `"GDG Lubumbashi" <${config.email.user}>`,
      to: email,
      subject: 'DevFest Lubumbashi 2025 - Code de vérification',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4285F4;">DevFest Lubumbashi 2025</h2>
          <p>Hello,</p>
          <p>Votre code de vérification pour le système de certification DevFest Lubumbashi 2025 est :</p>
          <h1 style="color: #4285F4; font-size: 32px; letter-spacing: 5px;">${code}</h1>
          <p>Ce code expirera dans 15 minutes.</p>
          <p>Si vous n'avez pas demandé ce code, veuillez ignorer cet e-mail.</p>
          <p>Cordialement,<br>Équipe GDG Lubumbashi</p>
        </div>
      `
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendCertificateEmail(
    email: string,
    certificateUrl: string,
    verificationUrl: string,
    name: string = 'there',
    type: 'volunteer' | 'speaker' = 'volunteer'
  ): Promise<void> {
    // Customize message based on type
    const roleText = type === 'speaker' ? 'speaking' : 'volunteering';
    const roleTitle = type === 'speaker' ? 'Intervenant' : 'Volontaire';
    const thankYouMessage = type === 'speaker'
      ? `Merci d'avoir pris la parole lors du DevFest Lubumbashi 2025 ! Votre contribution en tant qu'intervenant a inspiré et enrichi notre communauté.`
      : `Merci d'avoir participé en tant que volontaire au DevFest Lubumbashi 2025 ! Votre dévouement et votre travail acharné ont rendu cet événement possible.`;

    const mailOptions = {
      from: `"GDG Lubumbashi" <${config.email.user}>`,
      to: email,
      subject: `DevFest Lubumbashi 2025 - Votre certificat de ${roleTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            @media only screen and (max-width: 600px) {
              .container { width: 100% !important; padding: 20px !important; }
              .button { width: 100% !important; display: block !important; margin: 10px 0 !important; }
            }
          </style>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <!-- Main Container -->
                <table role="presentation" class="container" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">

                  <!-- Header with GDG Colors -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #4285F4 0%, #34A853 50%, #FBBC04 100%); padding: 40px 30px; text-align: center;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                        DevFest Ado-Ekiti 2025
                      </h1>
                      <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px; opacity: 0.95;">
                        Certificat de reconnaissance - ${roleTitle}
                      </p>
                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="margin: 0 0 20px 0; color: #202124; font-size: 24px; font-weight: 600;">
                        Bonjour ${name}!
                      </h2>

                      <p style="margin: 0 0 20px 0; color: #5f6368; font-size: 16px; line-height: 1.6;">
                        ${thankYouMessage}
                      </p>

                      <p style="margin: 0 0 30px 0; color: #5f6368; font-size: 16px; line-height: 1.6;">
                        Your certificate has been generated and is ready! You can download it or view the verification page below:
                      </p>

                      <!-- Action Buttons -->
                      <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 0 0 30px 0;">
                        <tr>
                          <td style="padding: 10px 0;">
                            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                              <tr>
                                <td style="border-radius: 6px; background: linear-gradient(135deg, #4285F4, #5396F5); box-shadow: 0 2px 4px rgba(66,133,244,0.3);">
                                  <a href="${certificateUrl}" style="display: block; padding: 14px 20px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px; text-align: center;">
                                    📥 Télécharger le certificat
                                  </a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 0;">
                            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                              <tr>
                                <td style="border-radius: 6px; background: linear-gradient(135deg, #34A853, #45B862); box-shadow: 0 2px 4px rgba(52,168,83,0.3);">
                                  <a href="${verificationUrl}" style="display: block; padding: 14px 20px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px; text-align: center;">
                                    🔍 Afficher la page de vérification
                                  </a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>

                      <!-- Info Box -->
                      <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f8f9fa; border-radius: 6px; padding: 20px; margin: 0 0 30px 0;">
                        <tr>
                          <td>
                            <p style="margin: 0 0 10px 0; color: #5f6368; font-size: 14px; line-height: 1.6;">
                              <strong style="color: #202124;">💡 Astuce rapide :</strong> partagez votre certificat sur LinkedIn pour mettre en avant votre contribution ! Rendez-vous sur la page de vérification pour l'ajouter à votre profil professionnel.
                            </p>
                          </td>
                        </tr>
                      </table>

                      <p style="margin: 0 0 10px 0; color: #5f6368; font-size: 16px; line-height: 1.6;">
                        Nous apprécions votre contribution à la réalisation d'un DevFest Lubumbashi 2025 mémorable et réussi !
                      </p>

                      <p style="margin: 20px 0 0 0; color: #5f6368; font-size: 16px; line-height: 1.6;">
                        <strong style="color: #202124;">Cordialement,</strong><br>
                        <span style="color: #4285F4; font-weight: 600;">Équipe du GDG Lubumbashi</span>
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e8eaed;">
                      <p style="margin: 0 0 10px 0; color: #5f6368; font-size: 14px;">
                        <strong style="color: #202124;">GDG Lubumbashi</strong>
                      </p>
                      <p style="margin: 0 0 15px 0; color: #80868b; font-size: 12px; line-height: 1.5;">
                        Building the future of technology together
                      </p>
                      <p style="margin: 0; color: #80868b; font-size: 12px;">
                        Cet e-mail vous est envoyé au sujet de votre participation au DevFest Lubumbashi 2025.
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    };

    await this.transporter.sendMail(mailOptions);
  }
}

export const emailService = new EmailService();