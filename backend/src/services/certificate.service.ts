import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { storageService } from './storage.service';

class CertificateService {
  private readonly CERTIFICATE_WIDTH = 1748;
  private readonly CERTIFICATE_HEIGHT = 1240;
  private readonly BORDER_WIDTH = 50;
  private readonly ASSETS_DIR = path.join(__dirname, '../../assets');

  private async generateCertificateSvg(volunteerName: string, certificateId: string, issueDate: string): Promise<string> {
    const sanitizedName = this.escapeXml(volunteerName);

    // SVG for the text content only (will be composited with images)
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${this.CERTIFICATE_WIDTH}" height="${this.CERTIFICATE_HEIGHT}">
        <!-- Transparent background, will be composited on white -->
        <rect width="100%" height="100%" fill="transparent" />

        <!-- Certificate title -->
        <text x="50%" y="300" text-anchor="middle" font-family="Arial, sans-serif" font-size="52" fill="#000000" font-weight="700">Certificate of Appreciation</text>

        <!-- "This is to certify that" -->
        <text x="50%" y="420" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" fill="#000000">This is to certify that</text>

        <!-- Volunteer name - Large and bold -->
        <text x="50%" y="550" text-anchor="middle" font-family="Arial, sans-serif" font-size="88" fill="#000000" font-weight="900">${sanitizedName}</text>

        <!-- Body text -->
        <text x="50%" y="650" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="#000000">Has volunteered at <tspan font-weight="700">DevFest Ado-Ekiti 2025</tspan> and contributed to</text>
        <text x="50%" y="690" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="#000000">making the event a success</text>

        <!-- Signature section -->
        <text x="180" y="915" font-family="Arial, sans-serif" font-size="26" fill="#000000" font-weight="700">David Oluwabusayo</text>
        <text x="180" y="945" font-family="Arial, sans-serif" font-size="20" fill="#000000">Lead Organizer</text>

        <!-- Footer: issuer, id, date -->
        <text x="180" y="1015" font-family="Arial, sans-serif" font-size="20" fill="#000000">Issued by: GDG Ado-Ekiti</text>
        <text x="874" y="1015" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="#000000">Certificate ID: ${certificateId}</text>
        <text x="1568" y="1015" text-anchor="end" font-family="Arial, sans-serif" font-size="20" fill="#000000">Issued date: ${issueDate}</text>
      </svg>
    `;

    return svg;
  }

  private async generateSpeakerCertificateSvg(volunteerName: string, certificateId: string, issueDate: string): Promise<string> {
    const sanitizedName = this.escapeXml(volunteerName);

    // SVG for speaker certificate text with enhanced styling
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${this.CERTIFICATE_WIDTH}" height="${this.CERTIFICATE_HEIGHT}">
        <defs>
          <!-- Subtle shadow for name -->
          <filter id="nameShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
            <feOffset dx="0" dy="2" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <!-- Gradient for decorative accent -->
          <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#EA4335;stop-opacity:1" />
            <stop offset="33%" style="stop-color:#FBBC04;stop-opacity:1" />
            <stop offset="66%" style="stop-color:#34A853;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#4285F4;stop-opacity:1" />
          </linearGradient>
        </defs>

        <!-- Transparent background, will be composited on white -->
        <rect width="100%" height="100%" fill="transparent" />

        <!-- Decorative accent line above title -->
        <rect x="724" y="270" width="300" height="3" fill="url(#accentGradient)" rx="1.5"/>

        <!-- Certificate title -->
        <text x="50%" y="300" text-anchor="middle" font-family="Arial, sans-serif" font-size="52" fill="#000000" font-weight="700">Certificate of Appreciation</text>

        <!-- "This is to certify that" -->
        <text x="50%" y="420" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" fill="#333333" font-style="italic">This is to certify that</text>

        <!-- Speaker name - Large and bold with shadow -->
        <text x="50%" y="550" text-anchor="middle" font-family="Arial, sans-serif" font-size="88" fill="#000000" font-weight="900" filter="url(#nameShadow)">${sanitizedName}</text>

        <!-- Body text - comes BEFORE icons -->
        <text x="50%" y="650" text-anchor="middle" font-family="Arial, sans-serif" font-size="26" fill="#1a1a1a">Has shared their expertise at <tspan font-weight="700" fill="#4285F4">DevFest Ado-Ekiti 2025</tspan> and</text>
        <text x="50%" y="690" text-anchor="middle" font-family="Arial, sans-serif" font-size="26" fill="#1a1a1a">contributed to making the event a success</text>

        <!-- Signature section -->
        <text x="180" y="915" font-family="Arial, sans-serif" font-size="26" fill="#000000" font-weight="700">David Oluwabusayo</text>
        <text x="180" y="945" font-family="Arial, sans-serif" font-size="20" fill="#666666">Lead Organizer</text>

        <!-- Footer: issuer, id, date -->
        <text x="180" y="1015" font-family="Arial, sans-serif" font-size="20" fill="#666666">Issued by: GDG Ado-Ekiti</text>
        <text x="874" y="1015" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="#666666">Certificate ID: ${certificateId}</text>
        <text x="1568" y="1015" text-anchor="end" font-family="Arial, sans-serif" font-size="20" fill="#666666">Issued date: ${issueDate}</text>
      </svg>
    `;

    return svg;
  }

  private escapeXml(input: string): string {
    return input.replace(/[<>&"']/g, (c) => ({
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      '"': '&quot;',
      "'": '&apos;'
    } as any)[c]);
  }

  private async createColoredBorders(): Promise<Buffer> {
    // Create the colored borders matching the sample - 4 equal parts for each edge
    const halfWidth = this.CERTIFICATE_WIDTH / 2;
    const halfHeight = this.CERTIFICATE_HEIGHT / 2;

    const borderSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${this.CERTIFICATE_WIDTH}" height="${this.CERTIFICATE_HEIGHT}">
        <!-- TOP BORDER: Red (left half) and Green (right half) -->
        <rect x="0" y="0" width="${halfWidth}" height="${this.BORDER_WIDTH}" fill="#EA4335"/>
        <rect x="${halfWidth}" y="0" width="${halfWidth}" height="${this.BORDER_WIDTH}" fill="#34A853"/>

        <!-- LEFT BORDER: Blue (full height minus top border) -->
        <rect x="0" y="${this.BORDER_WIDTH}" width="${this.BORDER_WIDTH}" height="${this.CERTIFICATE_HEIGHT - this.BORDER_WIDTH}" fill="#4285F4"/>

        <!-- RIGHT BORDER: Green (top half) and Yellow (bottom half) -->
        <rect x="${this.CERTIFICATE_WIDTH - this.BORDER_WIDTH}" y="${this.BORDER_WIDTH}" width="${this.BORDER_WIDTH}" height="${halfHeight - this.BORDER_WIDTH / 2}" fill="#34A853"/>
        <rect x="${this.CERTIFICATE_WIDTH - this.BORDER_WIDTH}" y="${halfHeight + this.BORDER_WIDTH / 2}" width="${this.BORDER_WIDTH}" height="${halfHeight - this.BORDER_WIDTH / 2}" fill="#FBBC04"/>

        <!-- BOTTOM BORDER: Blue (left half) and Yellow (right half) -->
        <rect x="${this.BORDER_WIDTH}" y="${this.CERTIFICATE_HEIGHT - this.BORDER_WIDTH}" width="${halfWidth - this.BORDER_WIDTH}" height="${this.BORDER_WIDTH}" fill="#4285F4"/>
        <rect x="${halfWidth}" y="${this.CERTIFICATE_HEIGHT - this.BORDER_WIDTH}" width="${halfWidth - this.BORDER_WIDTH}" height="${this.BORDER_WIDTH}" fill="#FBBC04"/>
      </svg>
    `;

    return Buffer.from(borderSvg);
  }

  private async createWhiteBackground(): Promise<Buffer> {
    // Create white background with decorative double-line border frame
    const innerWidth = this.CERTIFICATE_WIDTH - (this.BORDER_WIDTH * 2);
    const innerHeight = this.CERTIFICATE_HEIGHT - (this.BORDER_WIDTH * 2);
    const accentSize = 8; // Small blue square accent
    const borderInset = 25; // Space from edge for inner border

    const backgroundSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${innerWidth}" height="${innerHeight}">
        <!-- White background -->
        <rect width="100%" height="100%" fill="#FFFFFF"/>

        <!-- Blue accent square in top-left corner -->
        <rect x="0" y="0" width="${accentSize}" height="${accentSize}" fill="#4285F4"/>

        <!-- Outer border frame - thin gray line -->
        <rect x="5" y="5" width="${innerWidth - 10}" height="${innerHeight - 10}"
              fill="none" stroke="#999999" stroke-width="1.5" rx="2"/>

        <!-- Inner decorative border - slightly thicker -->
        <rect x="${borderInset}" y="${borderInset}"
              width="${innerWidth - (borderInset * 2)}"
              height="${innerHeight - (borderInset * 2)}"
              fill="none" stroke="#666666" stroke-width="2" rx="3"/>
      </svg>
    `;

    return await sharp(Buffer.from(backgroundSvg))
      .png()
      .toBuffer();
  }

  private async createSpeakerCertificate(volunteerName: string, certificateId: string): Promise<{ imageBuffer: Buffer; imageUrl: string }> {
    const issueDate = 'November 15, 2025';

    try {
      // Load speaker-specific assets
      const speakerAssetsDir = path.join(this.ASSETS_DIR, 'speaker');
      const logoPath = path.join(speakerAssetsDir, 'logo.png');
      const signaturePath = path.join(speakerAssetsDir, 'signature.png');

      // Load decorative icons
      const anglePath = path.join(speakerAssetsDir, 'angle.png');
      const colliPath = path.join(speakerAssetsDir, 'colli.png');
      const hashPath = path.join(speakerAssetsDir, 'hash.png');
      const infinityPath = path.join(speakerAssetsDir, 'infinity.png');

      // Resize assets
      const logoBuffer = await sharp(logoPath)
        .resize(500, null, { fit: 'inside', withoutEnlargement: true })
        .png()
        .toBuffer();

      const signatureBuffer = await sharp(signaturePath)
        .resize(160, 130, { fit: 'inside', withoutEnlargement: true })
        .png()
        .toBuffer();

      // Resize decorative icons - larger and more prominent
      const iconSize = 105;
      const angleBuffer = await sharp(anglePath)
        .resize(iconSize, iconSize, { fit: 'inside' })
        .png()
        .toBuffer();

      const infinityBuffer = await sharp(infinityPath)
        .resize(iconSize, iconSize, { fit: 'inside' })
        .png()
        .toBuffer();

      const colliBuffer = await sharp(colliPath)
        .resize(iconSize, iconSize, { fit: 'inside' })
        .png()
        .toBuffer();

      const hashBuffer = await sharp(hashPath)
        .resize(iconSize, iconSize, { fit: 'inside' })
        .png()
        .toBuffer();

      // Generate text SVG
      const textSvg = await this.generateSpeakerCertificateSvg(volunteerName, certificateId, issueDate);
      const textBuffer = await sharp(Buffer.from(textSvg))
        .png()
        .toBuffer();

      // Create base canvas with colored borders
      const borderBuffer = await this.createColoredBorders();
      const whiteBackground = await this.createWhiteBackground();

      // Get metadata for positioning
      const logoMeta = await sharp(logoBuffer).metadata();
      const signatureMeta = await sharp(signatureBuffer).metadata();

      // Calculate positions for decorative icons
      // Position them horizontally centered, BELOW the text
      const iconY = 755; // Below the body text
      const iconSpacing = 45; // Much tighter spacing - icons grouped together
      const totalIconsWidth = (iconSize * 4) + (iconSpacing * 3);
      const startX = (this.CERTIFICATE_WIDTH - totalIconsWidth) / 2;

      // Calculate signature position
      const nameTextStartX = 180;
      const estimatedNameWidth = 250;
      const signatureX = nameTextStartX + (estimatedNameWidth / 2) - ((signatureMeta.width || 160) / 2);

      // Create the final certificate by compositing all layers
      const imageBuffer = await sharp(borderBuffer)
        .composite([
          // White background inside the borders
          {
            input: whiteBackground,
            top: this.BORDER_WIDTH,
            left: this.BORDER_WIDTH
          },
          // Logo at the top
          {
            input: logoBuffer,
            top: 90,
            left: Math.floor((this.CERTIFICATE_WIDTH - (logoMeta.width || 500)) / 2)
          },
          // Text overlay
          {
            input: textBuffer,
            top: 0,
            left: 0
          },
          // Decorative icons - angle, infinity, colli, hash
          {
            input: angleBuffer,
            top: iconY,
            left: Math.floor(startX)
          },
          {
            input: infinityBuffer,
            top: iconY,
            left: Math.floor(startX + iconSize + iconSpacing)
          },
          {
            input: colliBuffer,
            top: iconY,
            left: Math.floor(startX + (iconSize + iconSpacing) * 2)
          },
          {
            input: hashBuffer,
            top: iconY,
            left: Math.floor(startX + (iconSize + iconSpacing) * 3)
          },
          // Signature
          {
            input: signatureBuffer,
            top: 770,
            left: Math.floor(signatureX)
          }
        ])
        .png({
          quality: 100,
          compressionLevel: 6,
          palette: false
        })
        .toBuffer();

      // Save using storageService
      const imageUrl = await storageService.saveCertificate(certificateId, imageBuffer);

      return { imageBuffer, imageUrl };
    } catch (error) {
      console.error('Error generating speaker certificate:', error);
      throw new Error('Failed to generate speaker certificate');
    }
  }

  async createCertificate(volunteerName: string, certificateId: string, type: 'volunteer' | 'speaker' = 'volunteer'): Promise<{ imageBuffer: Buffer; imageUrl: string }> {
    // Route to appropriate certificate creation method
    if (type === 'speaker') {
      return this.createSpeakerCertificate(volunteerName, certificateId);
    }

    // Default volunteer certificate
    const issueDate = 'November 15, 2025';

    try {
      // Load assets
      const logoPath = path.join(this.ASSETS_DIR, 'logo.png');
      const signaturePath = path.join(this.ASSETS_DIR, 'signature.png');
      const badgePath = path.join(this.ASSETS_DIR, 'badge.png');

      // Resize assets to appropriate sizes for the new dimensions
      const logoBuffer = await sharp(logoPath)
        .resize(500, null, { fit: 'inside', withoutEnlargement: true })
        .png()
        .toBuffer();

      const signatureBuffer = await sharp(signaturePath)
        .resize(160, 130, { fit: 'inside', withoutEnlargement: true })
        .png()
        .toBuffer();

      const badgeBuffer = await sharp(badgePath)
        .resize(150, 150, { fit: 'inside', withoutEnlargement: true })
        .png()
        .toBuffer();

      // Generate text SVG
      const textSvg = await this.generateCertificateSvg(volunteerName, certificateId, issueDate);
      const textBuffer = await sharp(Buffer.from(textSvg))
        .png()
        .toBuffer();

      // Create base canvas with colored borders
      const borderBuffer = await this.createColoredBorders();
      const whiteBackground = await this.createWhiteBackground();

      // Get metadata for positioning
      const logoMeta = await sharp(logoBuffer).metadata();
      const signatureMeta = await sharp(signatureBuffer).metadata();
      const badgeMeta = await sharp(badgeBuffer).metadata();

      // Calculate signature position - centered above "David Oluwabusayo" text
      // The text starts at x=180, and typical width for this name is ~250px
      // Center the signature (width ~160px) on the text
      const nameTextStartX = 180;
      const estimatedNameWidth = 250;
      const signatureX = nameTextStartX + (estimatedNameWidth / 2) - ((signatureMeta.width || 160) / 2);

      // Create the final certificate by compositing all layers
      const imageBuffer = await sharp(borderBuffer)
        .composite([
          // White background inside the borders
          {
            input: whiteBackground,
            top: this.BORDER_WIDTH,
            left: this.BORDER_WIDTH
          },
          // Logo at the top
          {
            input: logoBuffer,
            top: 90,
            left: Math.floor((this.CERTIFICATE_WIDTH - (logoMeta.width || 500)) / 2)
          },
          // Text overlay
          {
            input: textBuffer,
            top: 0,
            left: 0
          },
          // Signature - centered above "David Oluwabusayo" name
          {
            input: signatureBuffer,
            top: 770,
            left: Math.floor(signatureX)
          },
          // Badge at bottom right
          {
            input: badgeBuffer,
            top: 800,
            left: this.CERTIFICATE_WIDTH - (badgeMeta.width || 150) - 180
          }
        ])
        .png({
          quality: 100,
          compressionLevel: 6,
          palette: false
        })
        .toBuffer();

      // Save using storageService
      const imageUrl = await storageService.saveCertificate(certificateId, imageBuffer);

      return { imageBuffer, imageUrl };
    } catch (error) {
      console.error('Error generating certificate:', error);
      throw new Error('Failed to generate certificate');
    }
  }
}

export const certificateService = new CertificateService();