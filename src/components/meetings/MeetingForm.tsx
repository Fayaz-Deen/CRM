import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Textarea, Select } from '../ui';
import { useMeetingStore } from '../../store/meetingStore';
import { useContactStore } from '../../store/contactStore';
import { useAuthStore } from '../../store/authStore';
import type { MeetingMedium } from '../../types';

const meetingSchema = z.object({
  meetingDate: z.string().min(1, 'Date is required'),
  medium: z.string().min(1, 'Medium is required'),
  notes: z.string().optional(),
  outcome: z.string().optional(),
  followupDate: z.string().optional(),
});

type MeetingFormData = z.infer<typeof meetingSchema>;

const mediumOptions = [
  { value: 'phone_call', label: 'Phone Call' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'email', label: 'Email' },
  { value: 'sms', label: 'SMS' },
  { value: 'in_person', label: 'In Person' },
  { value: 'video_call', label: 'Video Call' },
  { value: 'instagram_dm', label: 'Instagram DM' },
  { value: 'other', label: 'Other' },
];

interface MeetingFormProps {
  contactId: string;
  onSuccess: () => void;
}

export function MeetingForm({ contactId, onSuccess }: MeetingFormProps) {
  const { createMeeting, isLoading } = useMeetingStore();
  const { updateContact } = useContactStore();
  const { user } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MeetingFormData>({
    resolver: zodResolver(meetingSchema),
    defaultValues: {
      meetingDate: new Date().toISOString().slice(0, 16),
      medium: 'phone_call',
    },
  });

  const onSubmit = async (data: MeetingFormData) => {
    await createMeeting({
      contactId,
      userId: user!.id,
      meetingDate: data.meetingDate,
      medium: data.medium as MeetingMedium,
      notes: data.notes,
      outcome: data.outcome,
      followupDate: data.followupDate || undefined,
    });
    await updateContact(contactId, { lastContactedAt: new Date().toISOString() });
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Date & Time *" type="datetime-local" {...register('meetingDate')} error={errors.meetingDate?.message} />
      <Select label="Medium *" options={mediumOptions} {...register('medium')} error={errors.medium?.message} />
      <Textarea label="Notes" {...register('notes')} rows={3} placeholder="What was discussed..." />
      <Input label="Outcome" {...register('outcome')} placeholder="Deal closed, Follow-up needed, etc." />
      <Input label="Follow-up Date" type="date" {...register('followupDate')} />
      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" isLoading={isLoading}>Log Meeting</Button>
      </div>
    </form>
  );
}
