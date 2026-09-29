import nodemailer from 'nodemailer';
import prisma from './prisma';

export interface BookingEmailData {
  id?: string;
  bookingNumber: string;
  trackingId?: string | null;
  customer: {
    name: string;
    phone: string;
    email: string;
  };
  pickupCity: string;
  pickupDistrict?: string;
  pickupState: string;
  pickupAddress?: string;
  pickupPincode?: string;
  destinationCity: string;
  destinationDistrict?: string;
  destinationState: string;
  destinationAddress?: string;
  destinationPincode?: string;
  serviceNameSnapshot: string;
  pricingRuleSnapshot?: string | null;
  distanceKm: number;
  rateSnapshot: number;
  estimatedAmount: number;
  finalAmount?: number | null;
  customerLanguage?: string;
  status: string;
  vehicle?: {
    vehicleNumber: string;
    vehicleType: string;
    capacity?: string | null;
  } | null;
  driver?: {
    name: string;
    phone: string;
    email?: string | null;
  } | null;
}

// Nodemailer transport setup with standard SMTP environment variables
function getEmailTransporter() {
  const host = process.env.SMTP_HOST || process.env.EMAIL_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || process.env.EMAIL_PORT || '587', 10);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASSWORD;

  if (user && pass && pass.trim() !== '' && user !== 'your-email@gmail.com') {
    return nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });
  }

  // Development fallback: mock transporter that logs safely to console
  return {
    sendMail: async (options: any) => {
      console.log('✉️ [Email Sent Mock]');
      console.log(`To: ${options.to}`);
      console.log(`Subject: ${options.subject}`);
      return { messageId: `mock-msg-${Date.now()}` };
    },
  };
}

/**
 * Common HTML email header & wrapper styling matching Sabarisan Transport website theme
 */
function wrapEmailTemplate(title: string, badgeText: string, badgeColor: string, contentHtml: string): string {
  const businessName = process.env.BUSINESS_NAME || 'Sabarisan Transport';
  const businessAddress = process.env.BUSINESS_ADDRESS || 'Near Bus Stand, Bhavani Main Road, Erode, Tamil Nadu 638004';
  const ownerPhone = process.env.OWNER_PHONE || '+91 98765 43210';

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
          body { margin: 0; padding: 0; background-color: #060911; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f1f5f9; }
          .wrapper { width: 100%; table-layout: fixed; background-color: #060911; padding: 30px 10px; }
          .container { max-width: 600px; margin: 0 auto; background-color: #0d1424; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); }
          .header { background: linear-gradient(135deg, #0d1424 0%, #1e1b4b 50%, #0d1424 100%); padding: 30px 24px; text-align: center; border-bottom: 1px solid #334155; }
          .logo-badge { display: inline-block; background: linear-gradient(135deg, #f59e0b, #e11d48, #6366f1); color: #ffffff; padding: 8px 16px; border-radius: 12px; font-weight: 900; font-size: 15px; letter-spacing: 0.5px; margin-bottom: 12px; box-shadow: 0 10px 15px -3px rgba(225, 29, 72, 0.3); }
          .header h1 { margin: 0; font-size: 20px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; }
          .header p { margin: 6px 0 0 0; font-size: 12px; color: #94a3b8; }
          .status-pill { display: inline-block; padding: 4px 14px; border-radius: 9999px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-top: 12px; }
          .content { padding: 28px 24px; }
          .section-title { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #f59e0b; margin-bottom: 12px; }
          .data-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          .data-table td { padding: 10px 12px; font-size: 13px; border-bottom: 1px solid #1e293b; }
          .data-label { color: #94a3b8; font-weight: 500; width: 38%; }
          .data-value { color: #ffffff; font-weight: 700; text-align: right; }
          .highlight-card { background: #090d16; border: 1px solid #334155; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center; }
          .amount-big { font-size: 26px; font-weight: 900; color: #10b981; margin-top: 4px; }
          .btn { display: inline-block; background: linear-gradient(135deg, #e11d48, #4f46e5); color: #ffffff !important; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: 800; font-size: 14px; letter-spacing: 0.3px; box-shadow: 0 10px 15px -3px rgba(225, 29, 72, 0.4); }
          .btn-emerald { background: linear-gradient(135deg, #10b981, #059669); }
          .btn-container { text-align: center; margin: 24px 0 12px 0; }
          .footer { padding: 20px 24px; background-color: #090d16; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #1e293b; line-height: 1.6; }
          .footer strong { color: #94a3b8; }
          a { color: #38bdf8; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="container">
            <!-- Header -->
            <div class="header">
              <div class="logo-badge">🚚 ${businessName.toUpperCase()}</div>
              <h1>${title}</h1>
              <p>Direct Goods Transport & Shifting Logistics &bull; Erode Yard</p>
              <div>
                <span class="status-pill" style="background-color: ${badgeColor}25; color: ${badgeColor}; border: 1px solid ${badgeColor};">
                  ${badgeText}
                </span>
              </div>
            </div>

            <!-- Content -->
            <div class="content">
              ${contentHtml}
            </div>

            <!-- Footer -->
            <div class="footer">
              <strong>${businessName}</strong> &bull; ${businessAddress}<br>
              24/7 Helpline: <a href="tel:${ownerPhone}">${ownerPhone}</a> &bull; Erode, Tamil Nadu<br>
              <span style="opacity: 0.7;">This is an automated operational dispatch notification.</span>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * 1. Sends both Owner Notification Email (Always English) and Customer Email (Localized)
 */
export async function sendBookingEmails(booking: BookingEmailData) {
  const transporter = getEmailTransporter();
  const from = process.env.SMTP_FROM || process.env.EMAIL_FROM || 'Sabarisan Transport <sabarisan5070@gmail.com>';
  const ownerEmail = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.OWNER_EMAIL || 'sabarisan5070@gmail.com';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // 1A. OWNER EMAIL - ENGLISH WITH FULL OPERATIONAL DETAILS
  const ownerContent = `
    <div class="section-title">Consignment Submission Details</div>
    <table class="data-table">
      <tr>
        <td class="data-label">Booking Reference</td>
        <td class="data-value" style="font-family: monospace; color: #f59e0b;">${booking.bookingNumber}</td>
      </tr>
      <tr>
        <td class="data-label">Customer Name</td>
        <td class="data-value">${booking.customer.name}</td>
      </tr>
      <tr>
        <td class="data-label">Phone Number</td>
        <td class="data-value"><a href="tel:${booking.customer.phone}" style="color: #10b981; font-weight: 800;">${booking.customer.phone}</a></td>
      </tr>
      <tr>
        <td class="data-label">Email Address</td>
        <td class="data-value">${booking.customer.email}</td>
      </tr>
      <tr>
        <td class="data-label">Pickup City</td>
        <td class="data-value">${booking.pickupCity}, ${booking.pickupState} (${booking.pickupPincode || 'N/A'})</td>
      </tr>
      <tr>
        <td class="data-label">Destination</td>
        <td class="data-value">${booking.destinationCity}, ${booking.destinationState} (${booking.destinationPincode || 'N/A'})</td>
      </tr>
      <tr>
        <td class="data-label">Service Type</td>
        <td class="data-value">${booking.serviceNameSnapshot}</td>
      </tr>
      ${booking.pricingRuleSnapshot ? `
      <tr>
        <td class="data-label">Pricing Tier</td>
        <td class="data-value">${booking.pricingRuleSnapshot}</td>
      </tr>` : ''}
      <tr>
        <td class="data-label">Calculated Distance</td>
        <td class="data-value">${booking.distanceKm} KM</td>
      </tr>
      <tr>
        <td class="data-label">Rate Applied</td>
        <td class="data-value">₹${booking.rateSnapshot} / KM</td>
      </tr>
      <tr>
        <td class="data-label">Customer Language</td>
        <td class="data-value">${(booking.customerLanguage || 'en').toUpperCase()}</td>
      </tr>
    </table>

    <div class="highlight-card">
      <div style="font-size: 12px; text-transform: uppercase; font-weight: 700; color: #94a3b8;">Estimated Booking Amount</div>
      <div class="amount-big">₹${booking.estimatedAmount.toLocaleString('en-IN')}</div>
    </div>

    <div class="btn-container">
      <a class="btn" href="${appUrl}/admin/bookings" target="_blank">Open Admin Portal & Confirm</a>
    </div>
  `;

  const ownerHtml = wrapEmailTemplate(
    'New Booking Submission Alert',
    `Booking Ref: ${booking.bookingNumber}`,
    '#f59e0b',
    ownerContent
  );

  try {
    const ownerRes = await transporter.sendMail({
      from,
      to: ownerEmail,
      subject: `🚨 [New Booking] ${booking.bookingNumber} - ${booking.pickupCity} to ${booking.destinationCity} (₹${booking.estimatedAmount})`,
      html: ownerHtml,
    });
    logEmail({
      type: 'OWNER_NEW_BOOKING',
      recipient: ownerEmail,
      bookingId: booking.id,
      status: 'SENT',
      providerMessageId: ownerRes.messageId,
    });
  } catch (err: any) {
    logEmail({
      type: 'OWNER_NEW_BOOKING',
      recipient: ownerEmail,
      bookingId: booking.id,
      status: 'FAILED',
      error: err?.message,
    });
  }

  // 1B. CUSTOMER EMAIL - LOCALIZED
  const customerContent = getCustomerBookingEmailContent(booking);
  try {
    const custRes = await transporter.sendMail({
      from,
      to: booking.customer.email,
      subject: customerContent.subject,
      html: customerContent.html,
    });
    logEmail({
      type: 'CUSTOMER_BOOKING_RECEIVED',
      recipient: booking.customer.email,
      bookingId: booking.id,
      status: 'SENT',
      providerMessageId: custRes.messageId,
    });
  } catch (err: any) {
    logEmail({
      type: 'CUSTOMER_BOOKING_RECEIVED',
      recipient: booking.customer.email,
      bookingId: booking.id,
      status: 'FAILED',
      error: err?.message,
    });
  }
}

/**
 * Generates localized HTML customer booking email
 */
function getCustomerBookingEmailContent(booking: BookingEmailData) {
  const lang = booking.customerLanguage || 'en';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const translations: Record<string, { title: string; subject: string; greeting: string; msg: string; note: string }> = {
    en: {
      title: 'Transport Booking Received',
      subject: `Transport Booking Received - ${booking.bookingNumber}`,
      greeting: `Hello ${booking.customer.name},`,
      msg: 'We have successfully received your transport booking request. Our operations coordinator in Erode will review your requirements and call you shortly to confirm the pickup schedule.',
      note: 'Note: Estimated pricing is based on per-KM calculation. Additional charges (tolls, helpers) will be finalized upon confirmation.',
    },
    ta: {
      title: 'முன்பதிவு பெறப்பட்டது',
      subject: `போக்குவரத்து முன்பதிவு பெறப்பட்டது - ${booking.bookingNumber}`,
      greeting: `வணக்கம் ${booking.customer.name},`,
      msg: 'உங்கள் போக்குவரத்து முன்பதிவு கோரிக்கை வெற்றிகரமாக பெறப்பட்டுள்ளது. எங்கள் ஈரோடு செயல்பாட்டு ஒருங்கிணைப்பாளர் உங்களை தொலைபேசி அல்லது வாட்ஸ்அப் மூலம் விரைவில் தொடர்பு கொண்டு உறுதி செய்வார்.',
      note: 'குறிப்பு: உத்தேச கட்டணம் கிலோமீட்டர் கணக்கீட்டின் அடிப்படையில் அமைந்துள்ளது. கூடுதல் கட்டணங்கள் (சுங்கக் கட்டணம்) உறுதிப்படுத்தலின் போது சேர்க்கப்படும்.',
    },
    kn: {
      title: 'ಬುಕಿಂಗ್ ಸ್ವೀಕರಿಸಲಾಗಿದೆ',
      subject: `ಸಾರಿಗೆ ಬುಕಿಂಗ್ ಸ್ವೀಕರಿಸಲಾಗಿದೆ - ${booking.bookingNumber}`,
      greeting: `ನಮಸ್ಕಾರ ${booking.customer.name},`,
      msg: 'ನಿಮ್ಮ ಸಾರಿಗೆ ಬುಕಿಂಗ್ ವಿನಂತಿಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಸ್ವೀಕರಿಸಲಾಗಿದೆ. ನಮ್ಮ ತಂಡವು ಶೀಘ್ರದಲ್ಲೇ ನಿಮ್ಮನ್ನು ಫೋನ್ ಮೂಲಕ ಸಂಪರ್ಕಿಸುತ್ತದೆ.',
      note: 'ಗಮನಿಸಿ: ಅಂದಾಜು ಶುಲ್ಕವು ಕಿಲೋಮೀಟರ್ ಲೆಕ್ಕಾಚಾರವನ್ನು ಆಧರಿಸಿದೆ.',
    },
    hi: {
      title: 'बुकिंग प्राप्त हुई',
      subject: `ट्रांसपोर्ट बुकिंग प्राप्त हुई - ${booking.bookingNumber}`,
      greeting: `नमस्ते ${booking.customer.name},`,
      msg: 'हमें आपका ट्रांसपोर्ट बुकिंग अनुरोध प्राप्त हो गया है। हमारी टीम जल्द ही आपसे फोन पर संपर्क करेगी।',
      note: 'नोट: अनुमानित मूल्य प्रति-किमी गणना पर आधारित है।',
    },
    ml: {
      title: 'ബുക്കിംഗ് ലഭിച്ചു',
      subject: `ട്രാൻസ്പോർട്ട് ബുക്കിംഗ് ലഭിച്ചു - ${booking.bookingNumber}`,
      greeting: `നമസ്കാരം ${booking.customer.name},`,
      msg: 'നിങ്ങളുടെ ട്രാൻസ്പോർട്ട് ബുക്കിംഗ് അഭ്യർത്ഥന ലഭിച്ചു. ഞങ്ങളുടെ ടീം ഉടൻ തന്നെ നിങ്ങളെ ഫോൺ വഴി ബന്ധപ്പെടും.',
      note: 'ശ്രദ്ധിക്കുക: കണക്കാക്കിയ നിരക്ക് കിലോമീറ്റർ അടിസ്ഥാനമാക്കിയുള്ളതാണ്.',
    },
  };

  const t = translations[lang] || translations.en;

  const content = `
    <p style="font-size: 15px; font-weight: 700; color: #ffffff; margin-top: 0;">${t.greeting}</p>
    <p style="color: #cbd5e1; font-size: 13px; line-height: 1.6;">${t.msg}</p>

    <div class="section-title">Trip Summary</div>
    <table class="data-table">
      <tr>
        <td class="data-label">Booking Reference</td>
        <td class="data-value" style="font-family: monospace; color: #f59e0b;">${booking.bookingNumber}</td>
      </tr>
      <tr>
        <td class="data-label">Route</td>
        <td class="data-value">${booking.pickupCity} &rarr; ${booking.destinationCity}</td>
      </tr>
      <tr>
        <td class="data-label">Service</td>
        <td class="data-value">${booking.serviceNameSnapshot}</td>
      </tr>
      <tr>
        <td class="data-label">Estimated Distance</td>
        <td class="data-value">${booking.distanceKm} KM</td>
      </tr>
    </table>

    <div class="highlight-card">
      <div style="font-size: 12px; text-transform: uppercase; font-weight: 700; color: #94a3b8;">Estimated Transport Cost</div>
      <div class="amount-big">₹${booking.estimatedAmount.toLocaleString('en-IN')}</div>
    </div>

    <p style="font-size: 11px; color: #94a3b8; line-height: 1.5; margin-bottom: 20px;">${t.note}</p>

    <div class="btn-container">
      <a class="btn" href="${appUrl}/track?id=${encodeURIComponent(booking.bookingNumber)}" target="_blank">View Booking Status</a>
    </div>
  `;

  const html = wrapEmailTemplate(
    t.title,
    `Booking Ref: ${booking.bookingNumber}`,
    '#38bdf8',
    content
  );

  return { subject: t.subject, html };
}

/**
 * 2. Sends Confirmation & Tracking ID Email to Customer
 */
export async function sendConfirmationEmail(booking: any) {
  const transporter = getEmailTransporter();
  const from = process.env.SMTP_FROM || process.env.EMAIL_FROM || 'Sabarisan Transport <sabarisan5070@gmail.com>';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const trackLink = `${appUrl}/track?id=${encodeURIComponent(booking.trackingId)}`;

  const content = `
    <p style="font-size: 15px; font-weight: 700; color: #ffffff; margin-top: 0;">Dear ${booking.customer.name},</p>
    <p style="color: #cbd5e1; font-size: 13px; line-height: 1.6;">
      Great news! Your transport shipment from <strong>${booking.pickupCity}</strong> to <strong>${booking.destinationCity}</strong> has been officially confirmed by <strong>Sabarisan Transport</strong>.
    </p>

    <div class="highlight-card" style="border: 2px solid #38bdf8; background: #0c1830;">
      <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #38bdf8; letter-spacing: 1px;">YOUR OFFICIAL TRACKING ID</div>
      <div style="font-family: monospace; font-size: 24px; font-weight: 900; color: #ffffff; margin: 8px 0; letter-spacing: 1px;">
        ${booking.trackingId}
      </div>
      <div style="font-size: 12px; color: #94a3b8;">Use this Tracking ID anytime to monitor vehicle movement and delivery checkpoints.</div>
    </div>

    <div class="section-title">Trip Information</div>
    <table class="data-table">
      <tr>
        <td class="data-label">Booking Reference</td>
        <td class="data-value" style="font-family: monospace;">${booking.bookingNumber}</td>
      </tr>
      <tr>
        <td class="data-label">Service</td>
        <td class="data-value">${booking.serviceNameSnapshot}</td>
      </tr>
      <tr>
        <td class="data-label">Route & Distance</td>
        <td class="data-value">${booking.pickupCity} &rarr; ${booking.destinationCity} (${booking.distanceKm} KM)</td>
      </tr>
      ${booking.vehicle ? `
      <tr>
        <td class="data-label">Assigned Vehicle</td>
        <td class="data-value" style="color: #f59e0b; font-family: monospace;">${booking.vehicle.vehicleNumber} (${booking.vehicle.vehicleType})</td>
      </tr>` : ''}
    </table>

    <div class="btn-container">
      <a class="btn btn-emerald" href="${trackLink}" target="_blank">Track Live Shipment Online</a>
    </div>
  `;

  const html = wrapEmailTemplate(
    'Shipment Booking Confirmed',
    `Tracking ID: ${booking.trackingId}`,
    '#10b981',
    content
  );

  try {
    const res = await transporter.sendMail({
      from,
      to: booking.customer.email,
      subject: `✅ Booking Confirmed! Tracking ID: ${booking.trackingId} - Sabarisan Transport`,
      html,
    });
    logEmail({
      type: 'CUSTOMER_CONFIRMATION',
      recipient: booking.customer.email,
      bookingId: booking.id,
      status: 'SENT',
      providerMessageId: res.messageId,
    });
  } catch (err: any) {
    logEmail({
      type: 'CUSTOMER_CONFIRMATION',
      recipient: booking.customer.email,
      bookingId: booking.id,
      status: 'FAILED',
      error: err?.message,
    });
  }
}

/**
 * 3. Sends Driver Trip Assignment Email
 */
export async function sendDriverAssignmentEmail(booking: any, driver: any, vehicle: any) {
  if (!driver?.email) return;

  const transporter = getEmailTransporter();
  const from = process.env.SMTP_FROM || process.env.EMAIL_FROM || 'Sabarisan Transport <sabarisan5070@gmail.com>';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const content = `
    <p style="font-size: 15px; font-weight: 700; color: #ffffff; margin-top: 0;">Hello ${driver.name},</p>
    <p style="color: #cbd5e1; font-size: 13px; line-height: 1.6;">
      You have been assigned a new transport consignment trip by the Sabarisan Transport Operations Hub in Erode. Please review the customer and route details below.
    </p>

    <div class="section-title">Dispatch Assignment</div>
    <table class="data-table">
      <tr>
        <td class="data-label">Booking No / Tracking ID</td>
        <td class="data-value" style="font-family: monospace; color: #f59e0b;">${booking.bookingNumber} ${booking.trackingId ? `(${booking.trackingId})` : ''}</td>
      </tr>
      <tr>
        <td class="data-label">Assigned Vehicle</td>
        <td class="data-value" style="font-family: monospace; color: #38bdf8;">${vehicle.vehicleNumber} &bull; ${vehicle.vehicleType}</td>
      </tr>
      <tr>
        <td class="data-label">Customer Name</td>
        <td class="data-value">${booking.customer.name}</td>
      </tr>
      <tr>
        <td class="data-label">Customer Phone</td>
        <td class="data-value"><a href="tel:${booking.customer.phone}" style="color: #10b981; font-weight: 800;">${booking.customer.phone}</a></td>
      </tr>
      <tr>
        <td class="data-label">Pickup Address</td>
        <td class="data-value">${booking.pickupAddress || `${booking.pickupCity}, ${booking.pickupState}`}</td>
      </tr>
      <tr>
        <td class="data-label">Delivery Destination</td>
        <td class="data-value">${booking.destinationAddress || `${booking.destinationCity}, ${booking.destinationState}`}</td>
      </tr>
      <tr>
        <td class="data-label">Total Distance</td>
        <td class="data-value">${booking.distanceKm} KM</td>
      </tr>
    </table>

    <div class="btn-container">
      <a class="btn" href="${appUrl}/driver/dashboard" target="_blank">Open Driver Portal & Update Status</a>
    </div>
  `;

  const html = wrapEmailTemplate(
    'New Dispatch Assignment',
    `Vehicle: ${vehicle.vehicleNumber}`,
    '#6366f1',
    content
  );

  try {
    const res = await transporter.sendMail({
      from,
      to: driver.email,
      subject: `🚚 New Trip Assigned: ${booking.pickupCity} to ${booking.destinationCity} (${vehicle.vehicleNumber})`,
      html,
    });
    logEmail({
      type: 'DRIVER_TRIP_ASSIGNED',
      recipient: driver.email,
      bookingId: booking.id,
      status: 'SENT',
      providerMessageId: res.messageId,
    });
  } catch (err: any) {
    logEmail({
      type: 'DRIVER_TRIP_ASSIGNED',
      recipient: driver.email,
      bookingId: booking.id,
      status: 'FAILED',
      error: err?.message,
    });
  }
}

/**
 * 4. Sends Delivery Completed Email to Customer
 */
export async function sendDeliveryCompletedEmail(booking: any) {
  const transporter = getEmailTransporter();
  const from = process.env.SMTP_FROM || process.env.EMAIL_FROM || 'Sabarisan Transport <sabarisan5070@gmail.com>';
  const finalPaid = booking.finalAmount ?? booking.estimatedAmount;

  const content = `
    <p style="font-size: 15px; font-weight: 700; color: #ffffff; margin-top: 0;">Dear ${booking.customer.name},</p>
    <p style="color: #cbd5e1; font-size: 13px; line-height: 1.6;">
      Your consignment from <strong>${booking.pickupCity}</strong> has been successfully delivered to <strong>${booking.destinationCity}</strong>. Thank you for choosing <strong>Sabarisan Transport</strong>!
    </p>

    <div class="highlight-card" style="border: 1px solid #10b981; background: #062419;">
      <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #34d399;">DELIVERY COMPLETED</div>
      <div class="amount-big">₹${finalPaid.toLocaleString('en-IN')}</div>
      <div style="font-size: 11px; color: #94a3b8; margin-top: 4px;">Total Paid Amount</div>
    </div>

    <div class="section-title">Consignment Receipt</div>
    <table class="data-table">
      <tr>
        <td class="data-label">Booking Reference</td>
        <td class="data-value" style="font-family: monospace;">${booking.bookingNumber}</td>
      </tr>
      ${booking.trackingId ? `
      <tr>
        <td class="data-label">Tracking ID</td>
        <td class="data-value" style="font-family: monospace; color: #38bdf8;">${booking.trackingId}</td>
      </tr>` : ''}
      <tr>
        <td class="data-label">Route</td>
        <td class="data-value">${booking.pickupCity} &rarr; ${booking.destinationCity} (${booking.distanceKm} KM)</td>
      </tr>
      <tr>
        <td class="data-label">Service</td>
        <td class="data-value">${booking.serviceNameSnapshot}</td>
      </tr>
    </table>

    <p style="color: #cbd5e1; font-size: 12px; text-align: center; margin-top: 20px;">
      We value your trust. For any feedback or future transport bookings, please contact us at +91 98765 43210.
    </p>
  `;

  const html = wrapEmailTemplate(
    'Consignment Successfully Delivered',
    'Status: DELIVERED',
    '#10b981',
    content
  );

  try {
    const res = await transporter.sendMail({
      from,
      to: booking.customer.email,
      subject: `🎉 Consignment Delivered Successfully - ${booking.bookingNumber} - Sabarisan Transport`,
      html,
    });
    logEmail({
      type: 'CUSTOMER_DELIVERED',
      recipient: booking.customer.email,
      bookingId: booking.id,
      status: 'SENT',
      providerMessageId: res.messageId,
    });
  } catch (err: any) {
    logEmail({
      type: 'CUSTOMER_DELIVERED',
      recipient: booking.customer.email,
      bookingId: booking.id,
      status: 'FAILED',
      error: err?.message,
    });
  }
}

async function logEmail(data: {
  type: string;
  recipient: string;
  bookingId?: string;
  status: string;
  providerMessageId?: string;
  error?: string;
}) {
  try {
    await prisma.emailLog.create({
      data: {
        type: data.type,
        recipient: data.recipient,
        bookingId: data.bookingId,
        status: data.status,
        providerMessageId: data.providerMessageId,
        error: data.error,
      },
    });
  } catch {
    // In memory or offline
  }
}
