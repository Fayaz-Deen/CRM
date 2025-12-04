import { Phone, Mail, MessageCircle, Video, Users, MessageSquare, Instagram } from 'lucide-react';
import { Badge } from '../ui';
import { formatDateTime } from '../../utils/dates';
import type { Meeting, MeetingMedium } from '../../types';

const mediumIcons: Record<MeetingMedium, typeof Phone> = {
  phone_call: Phone,
  whatsapp: MessageCircle,
  email: Mail,
  sms: MessageSquare,
  in_person: Users,
  video_call: Video,
  instagram_dm: Instagram,
  other: MessageSquare,
};

const mediumColors: Record<MeetingMedium, string> = {
  phone_call: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400',
  whatsapp: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400',
  email: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400',
  sms: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400',
  in_person: 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400',
  video_call: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900 dark:text-cyan-400',
  instagram_dm: 'bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-400',
  other: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
};

interface MeetingTimelineProps {
  meetings: Meeting[];
}

export function MeetingTimeline({ meetings }: MeetingTimelineProps) {
  const sortedMeetings = [...meetings].sort(
    (a, b) => new Date(b.meetingDate).getTime() - new Date(a.meetingDate).getTime()
  );

  if (sortedMeetings.length === 0) {
    return (
      <p className="py-8 text-center text-[hsl(var(--muted-foreground))]">
        No meetings logged yet
      </p>
    );
  }

  return (
    <div className="relative space-y-4">
      <div className="absolute left-5 top-0 h-full w-0.5 bg-[hsl(var(--border))]" />
      {sortedMeetings.map((meeting) => {
        const Icon = mediumIcons[meeting.medium];
        return (
          <div key={meeting.id} className="relative flex gap-4 pl-12">
            <div className={`absolute left-2 flex h-7 w-7 items-center justify-center rounded-full ${mediumColors[meeting.medium]}`}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4">
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant="secondary" className="mb-2">
                    {meeting.medium.replace('_', ' ')}
                  </Badge>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">
                    {formatDateTime(meeting.meetingDate)}
                  </p>
                </div>
              </div>
              {meeting.notes && <p className="mt-2 text-sm">{meeting.notes}</p>}
              {meeting.outcome && (
                <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
                  <strong>Outcome:</strong> {meeting.outcome}
                </p>
              )}
              {meeting.followupDate && (
                <p className="mt-1 text-sm text-orange-500">
                  Follow-up: {new Date(meeting.followupDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
