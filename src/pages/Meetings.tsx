import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { Card, Badge } from '../components/ui';
import { useMeetingStore } from '../store/meetingStore';
import { formatDateTime } from '../utils/dates';

export function Meetings() {
  const { meetings, fetchMeetings, isLoading } = useMeetingStore();

  useEffect(() => { fetchMeetings(); }, [fetchMeetings]);

  const sortedMeetings = [...meetings].sort((a, b) => new Date(b.meetingDate).getTime() - new Date(a.meetingDate).getTime());

  if (isLoading) return <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[hsl(var(--primary))] border-t-transparent" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">All Meetings</h1>
      {sortedMeetings.length === 0 ? (
        <Card className="p-12 text-center"><Calendar className="mx-auto h-12 w-12 text-[hsl(var(--muted-foreground))]" /><p className="mt-4 text-[hsl(var(--muted-foreground))]">No meetings logged yet</p></Card>
      ) : (
        <div className="space-y-4">
          {sortedMeetings.map((meeting) => (
            <Card key={meeting.id} className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant="secondary">{meeting.medium.replace('_', ' ')}</Badge>
                  <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">{formatDateTime(meeting.meetingDate)}</p>
                  {meeting.notes && <p className="mt-2">{meeting.notes}</p>}
                </div>
                <Link to={`/contacts/${meeting.contactId}`} className="text-sm text-[hsl(var(--primary))] hover:underline">View Contact</Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
