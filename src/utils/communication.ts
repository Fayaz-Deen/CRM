import type { Contact } from '../types';

export const openWhatsApp = (contact: Contact, message?: string) => {
  const number = contact.whatsappNumber || contact.phones[0];
  if (!number) return;
  const cleanNumber = number.replace(/\D/g, '');
  const url = message
    ? `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`
    : `https://wa.me/${cleanNumber}`;
  window.open(url, '_blank');
};

export const openEmail = (contact: Contact, subject?: string, body?: string) => {
  const email = contact.emails[0];
  if (!email) return;
  let url = `mailto:${email}`;
  const params = new URLSearchParams();
  if (subject) params.set('subject', subject);
  if (body) params.set('body', body);
  if (params.toString()) url += `?${params.toString()}`;
  window.location.href = url;
};

export const openSMS = (contact: Contact, message?: string) => {
  const phone = contact.phones[0];
  if (!phone) return;
  const url = message
    ? `sms:${phone}?body=${encodeURIComponent(message)}`
    : `sms:${phone}`;
  window.location.href = url;
};

export const openInstagram = (contact: Contact) => {
  if (!contact.instagramHandle) return;
  const handle = contact.instagramHandle.replace('@', '');
  window.open(`https://instagram.com/${handle}`, '_blank');
};

export const openPhoneCall = (contact: Contact) => {
  const phone = contact.phones[0];
  if (!phone) return;
  window.location.href = `tel:${phone}`;
};

export const getDefaultMessage = (type: 'followup' | 'birthday' | 'anniversary', contactName: string): string => {
  const firstName = contactName.split(' ')[0];
  switch (type) {
    case 'followup':
      return `Hi ${firstName}, hope you're doing well! Just wanted to follow up on our previous conversation.`;
    case 'birthday':
      return `Happy Birthday, ${firstName}! Wishing you a wonderful day filled with joy and happiness!`;
    case 'anniversary':
      return `Happy Anniversary, ${firstName}! Wishing you many more years of happiness!`;
    default:
      return '';
  }
};
