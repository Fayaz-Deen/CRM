import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Textarea } from '../ui';
import { useContactStore } from '../../store/contactStore';
import type { Contact } from '../../types';
import { useAuthStore } from '../../store/authStore';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  emails: z.string().optional(),
  phones: z.string().optional(),
  whatsappNumber: z.string().optional(),
  instagramHandle: z.string().optional(),
  company: z.string().optional(),
  tags: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
  birthday: z.string().optional(),
  anniversary: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactFormProps {
  contact?: Contact;
  onSuccess: () => void;
}

export function ContactForm({ contact, onSuccess }: ContactFormProps) {
  const { createContact, updateContact, isLoading } = useContactStore();
  const { user } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: contact ? {
      name: contact.name,
      emails: contact.emails.join(', '),
      phones: contact.phones.join(', '),
      whatsappNumber: contact.whatsappNumber || '',
      instagramHandle: contact.instagramHandle || '',
      company: contact.company || '',
      tags: contact.tags.join(', '),
      address: contact.address || '',
      notes: contact.notes || '',
      birthday: contact.birthday || '',
      anniversary: contact.anniversary || '',
    } : {},
  });

  const onSubmit = async (data: ContactFormData) => {
    const contactData = {
      userId: user!.id,
      name: data.name,
      emails: data.emails ? data.emails.split(',').map((e) => e.trim()).filter(Boolean) : [],
      phones: data.phones ? data.phones.split(',').map((p) => p.trim()).filter(Boolean) : [],
      whatsappNumber: data.whatsappNumber || undefined,
      instagramHandle: data.instagramHandle || undefined,
      company: data.company || undefined,
      tags: data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      address: data.address || undefined,
      notes: data.notes || undefined,
      birthday: data.birthday || undefined,
      anniversary: data.anniversary || undefined,
    };

    if (contact) {
      await updateContact(contact.id, contactData);
    } else {
      await createContact(contactData);
    }
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Name *" {...register('name')} error={errors.name?.message} />
      <Input label="Emails (comma separated)" {...register('emails')} placeholder="john@example.com, john.doe@work.com" />
      <Input label="Phone Numbers (comma separated)" {...register('phones')} placeholder="+1234567890, +0987654321" />
      <Input label="WhatsApp Number" {...register('whatsappNumber')} placeholder="+1234567890" />
      <Input label="Instagram Handle" {...register('instagramHandle')} placeholder="@username" />
      <Input label="Company" {...register('company')} />
      <Input label="Tags (comma separated)" {...register('tags')} placeholder="friend, work, vip" />
      <Input label="Address" {...register('address')} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Birthday" type="date" {...register('birthday')} />
        <Input label="Anniversary" type="date" {...register('anniversary')} />
      </div>
      <Textarea label="Notes" {...register('notes')} rows={3} />
      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" isLoading={isLoading}>
          {contact ? 'Update Contact' : 'Add Contact'}
        </Button>
      </div>
    </form>
  );
}
