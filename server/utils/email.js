import nodemailer from 'nodemailer';
import { SMTP_USER, SMTP_PASS, SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_SERVICE, MAIL_FROM, ADMIN_EMAIL } from '../config/constants.js';

export const getMailTransport = () => {
  const user = SMTP_USER;
  const pass = SMTP_PASS;

  if (!user || !pass) return null;

  if (SMTP_HOST) {
    return nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: { user, pass }
    });
  }

  return nodemailer.createTransport({
    service: SMTP_SERVICE,
    auth: { user, pass }
  });
};

export const formatOrderLines = (order) => {
  return (order.items || [])
    .map((item) => `${item.quantity} x ${item.name}${item.size ? ` (${item.size})` : ''} - ₹${item.price * item.quantity}`)
    .join('\n');
};

export const generateOrderEmailHTML = (order, isAdmin = false) => {
  const orderId = String(order._id);
  const itemsHTML = (order.items || [])
    .map((item) => {
      const imageUrl = item.image ? `${item.image}?q=50&w=150` : '';
      const imageTag = imageUrl ? `<img src="${imageUrl}" alt="${item.name}" style="width: 120px; height: auto; border-radius: 4px; margin-bottom: 8px;" />` : '';
      return `
        <tr style="border-bottom: 1px solid #e0e0e0; padding: 12px 0;">
          <td style="padding: 12px 0; text-align: left;">
            ${imageTag}
            <div style="font-weight: 500; margin-top: 8px;">${item.name}</div>
            ${item.size ? `<div style="color: #666; font-size: 14px;">Size: ${item.size}</div>` : ''}
            <div style="color: #666; font-size: 14px;">Qty: ${item.quantity}</div>
          </td>
          <td style="padding: 12px 12px; text-align: right; white-space: nowrap;">
            <div style="font-weight: 500;">₹${item.price * item.quantity}</div>
          </td>
        </tr>
      `;
    })
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #333; line-height: 1.6; margin: 0; padding: 0; background-color: #f9f9f9;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #e0e0e0; padding-bottom: 20px;">
          <h1 style="margin: 0; font-size: 24px; color: #000; letter-spacing: 0.05em;">THELOGOLESS</h1>
          <p style="margin: 8px 0 0 0; color: #666; font-size: 12px; letter-spacing: 0.1em;">QUIET LUXURY BRAND</p>
        </div>

        <h2 style="margin: 0 0 12px 0; font-size: 18px; color: #000;">
          ${isAdmin ? 'New Order Received' : 'Order Confirmed'}
        </h2>
        <p style="margin: 0 0 20px 0; color: #666;">
          ${isAdmin ? `Hi Admin,` : `Hi ${order.customerName},`}
        </p>

        ${!isAdmin ? `<p style="margin: 0 0 20px 0; color: #666;">Your order <strong>${orderId}</strong> has been confirmed. Below are the details of your purchase.</p>` : `<p style="margin: 0 0 20px 0; color: #666;">A new order has been placed. Here are the details:</p>`}

        ${isAdmin ? `<div style="background-color: #f5f5f5; padding: 12px; border-radius: 4px; margin-bottom: 20px;">
          <div style="margin-bottom: 8px;"><strong>Customer:</strong> ${order.customerName}</div>
          <div style="margin-bottom: 8px;"><strong>Email:</strong> ${order.customerEmail}</div>
          <div><strong>Shipping City:</strong> ${order.location || 'Not provided'}</div>
        </div>` : ''}

        <h3 style="margin: 20px 0 12px 0; font-size: 16px; color: #000;">Order Items</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tbody>
            ${itemsHTML}
          </tbody>
        </table>

        <div style="border-top: 2px solid #e0e0e0; padding-top: 12px; margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span>Subtotal:</span>
            <span>₹${order.subtotal}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: 600;">
            <span>Total:</span>
            <span>₹${order.total}</span>
          </div>
        </div>

        ${!isAdmin ? `<p style="margin: 20px 0; color: #666; font-size: 14px;">We will contact you with the next update on your order status. Thank you for shopping with THELOGOLESS.</p>` : ''}

        <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #999; font-size: 12px;">
          <p style="margin: 0;">© 2026 thelogoless. All rights reserved.</p>
          <p style="margin: 4px 0 0 0;">Quiet Luxury Brand Suite</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const sendOrderEmails = async (order) => {
  const transport = getMailTransport();
  if (!transport) {
    console.warn('Order email skipped. Add SMTP_USER and SMTP_PASS/GMAIL_APP_PASSWORD to .env to enable mail.');
    return { sent: false, skipped: true };
  }

  const from = MAIL_FROM;
  const orderId = String(order._id);

  const orderLines = formatOrderLines(order);
  const customerText = [
    `Hi ${order.customerName},`,
    '',
    `Your THELOGOLESS order ${orderId} has been confirmed.`,
    '',
    orderLines,
    '',
    `Total: ₹${order.total}`,
    `Shipping city: ${order.location || 'Not provided'}`,
    '',
    'We will contact you with the next update.'
  ].join('\n');

  const adminText = [
    `New THELOGOLESS order received: ${orderId}`,
    '',
    `Customer: ${order.customerName}`,
    `Email: ${order.customerEmail}`,
    `Shipping city: ${order.location || 'Not provided'}`,
    '',
    orderLines,
    '',
    `Total: ₹${order.total}`
  ].join('\n');

  try {
    await Promise.all([
      transport.sendMail({
        from,
        to: order.customerEmail,
        subject: `THELOGOLESS order confirmed - ${orderId}`,
        text: customerText,
        html: generateOrderEmailHTML(order, false)
      }),
      transport.sendMail({
        from,
        to: ADMIN_EMAIL,
        subject: `New THELOGOLESS order - ${orderId}`,
        text: adminText,
        html: generateOrderEmailHTML(order, true)
      })
    ]);

    return { sent: true, skipped: false };
  } catch (error) {
    console.error('Order email failed:', error);
    return { sent: false, skipped: false, error: 'Email delivery failed' };
  }
};
