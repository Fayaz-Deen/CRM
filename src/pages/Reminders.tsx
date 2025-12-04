import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Gift, Heart, Clock, Check } from 'lucide-react';
import { Card, Button, Avatar } from '../components/ui';
import { reminderApi, contactApi } from '../services/api';
import { formatRelative } from '../utils/dates';
import type { Reminder, Contact } from '../types';

export function Reminders() {
  const [reminders, setReminders] = useState<(Reminder & { contact?: Contact })[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reminderData, contacts] = await Promise.all([reminderApi.getPending(), contactApi.getAll()]);
        const contactMap = new Map(contacts.map((c) => [c.id, c]));
        setReminders(reminderData.map((r) => ({ ...r, contact: contactMap.get(r.contactId) })));
      } catch (e) { console.error(e); } finally { setIsLoading(false); }
    };
    fetchData();
  }, []);

  const handleDismiss = async (id: string) => {
    await reminderApi.dismiss(id);
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const icons = { birthday: Gift, anniversary: Heart, followup: Clock, no_contact: Bell };
  const colors = { birthday: 'text-pink-500', anniversary: 'text-red-500', followup: 'text-orange-500', no_contact: 'text-blue-500' };

  if (isLoading) return <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[hsl(var(--primary))] border-t-transparent" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reminders</h1>
      {reminders.length === 0 ? (
        <Card className="p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <Bell className="h-12 w-12 text-[hsl(var(--muted-foreground))] mb-3" />
            <p className="text-[hsl(var(--muted-foreground))]">No pending reminders</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {reminders.map((reminder) => {
            const Icon = icons[reminder.type];
            return (
              <Card key={reminder.id} className="p-4">
                <div className="flex items-center gap-4">
                  <Icon className={`h-6 w-6 ${colors[reminder.type]}`} />
                  {reminder.contact && <Avatar src={reminder.contact.profilePicture} name={reminder.contact.name} size="md" />}
                  <div className="flex-1">
                    <Link to={`/contacts/${reminder.contactId}`} className="font-medium hover:underline">{reminder.contact?.name || 'Unknown'}</Link>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">{reminder.type.replace('_', ' ')} - {formatRelative(reminder.scheduledAt)}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDismiss(reminder.id)}><Check className="h-4 w-4" /></Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
