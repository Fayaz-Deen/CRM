import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Bell, User, Lock } from 'lucide-react';
import { Button, Input, Card, CardHeader, CardTitle, CardContent, Select } from '../components/ui';
import { useAuthStore } from '../store/authStore';
import { authApi } from '../services/api';

export function Settings() {
  const { user, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const { register: regProfile, handleSubmit: handleProfile } = useForm({ defaultValues: { name: user?.name || '', timezone: user?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone } });
  const { register: regPassword, handleSubmit: handlePassword, reset: resetPassword } = useForm();
  const { register: regSettings, handleSubmit: handleSettings } = useForm({ defaultValues: { birthdayReminderDays: user?.settings.birthdayReminderDays || 2, anniversaryReminderDays: user?.settings.anniversaryReminderDays || 2, defaultFollowupDays: user?.settings.defaultFollowupDays || 7, theme: user?.settings.theme || 'system' } });

  const onProfileSubmit = async (data: any) => { setIsLoading(true); try { const updated = await authApi.updateProfile(data); updateUser(updated); setMessage('Profile updated'); } catch { setMessage('Failed to update'); } finally { setIsLoading(false); } };
  const onPasswordSubmit = async (data: any) => { setIsLoading(true); try { await authApi.changePassword(data.currentPassword, data.newPassword); setMessage('Password changed'); resetPassword(); } catch { setMessage('Failed to change password'); } finally { setIsLoading(false); } };
  const onSettingsSubmit = async (data: any) => { setIsLoading(true); try { const updated = await authApi.updateProfile({ settings: data }); updateUser(updated); if (data.theme === 'dark') document.documentElement.classList.add('dark'); else if (data.theme === 'light') document.documentElement.classList.remove('dark'); setMessage('Settings saved'); } catch { setMessage('Failed to save'); } finally { setIsLoading(false); } };

  const tabs = [{ id: 'profile', label: 'Profile', icon: User }, { id: 'password', label: 'Password', icon: Lock }, { id: 'preferences', label: 'Preferences', icon: Bell }];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <div className="flex gap-2 border-b border-[hsl(var(--border))] pb-2">
        {tabs.map((tab) => (<button key={tab.id} onClick={() => { setActiveTab(tab.id); setMessage(''); }} className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : 'hover:bg-[hsl(var(--accent))]'}`}><tab.icon className="h-4 w-4" />{tab.label}</button>))}
      </div>
      {message && <div className="rounded-lg bg-green-100 p-3 text-sm text-green-800 dark:bg-green-900 dark:text-green-200">{message}</div>}
      {activeTab === 'profile' && (<Card><CardHeader><CardTitle>Profile Information</CardTitle></CardHeader><CardContent><form onSubmit={handleProfile(onProfileSubmit)} className="space-y-4"><Input label="Name" {...regProfile('name')} /><Input label="Timezone" {...regProfile('timezone')} /><Button type="submit" isLoading={isLoading}>Save Profile</Button></form></CardContent></Card>)}
      {activeTab === 'password' && (<Card><CardHeader><CardTitle>Change Password</CardTitle></CardHeader><CardContent><form onSubmit={handlePassword(onPasswordSubmit)} className="space-y-4"><Input label="Current Password" type="password" {...regPassword('currentPassword')} /><Input label="New Password" type="password" {...regPassword('newPassword')} /><Input label="Confirm Password" type="password" {...regPassword('confirmPassword')} /><Button type="submit" isLoading={isLoading}>Change Password</Button></form></CardContent></Card>)}
      {activeTab === 'preferences' && (<Card><CardHeader><CardTitle>Preferences</CardTitle></CardHeader><CardContent><form onSubmit={handleSettings(onSettingsSubmit)} className="space-y-4"><Select label="Theme" options={[{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }, { value: 'system', label: 'System' }]} {...regSettings('theme')} /><Input label="Birthday Reminder (days before)" type="number" {...regSettings('birthdayReminderDays')} /><Input label="Anniversary Reminder (days before)" type="number" {...regSettings('anniversaryReminderDays')} /><Input label="Default Follow-up (days)" type="number" {...regSettings('defaultFollowupDays')} /><Button type="submit" isLoading={isLoading}>Save Preferences</Button></form></CardContent></Card>)}
    </div>
  );
}
