import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar, Gift, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Avatar, Badge } from '../components/ui';
import { dashboardApi } from '../services/api';
import { formatRelative, formatBirthday, getDaysUntil } from '../utils/dates';
import type { Contact, Meeting } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';

interface DashboardStats {
  totalContacts: number;
  meetingsThisMonth: number;
  upcomingBirthdays: Contact[];
  upcomingAnniversaries: Contact[];
  pendingFollowups: Meeting[];
  recentlyContacted: Contact[];
  needsAttention: Contact[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [meetingsChart, setMeetingsChart] = useState<{ week: string; count: number }[]>([]);
  const [mediumBreakdown, setMediumBreakdown] = useState<{ medium: string; count: number }[]>([]);
  const [contactsOverTime, setContactsOverTime] = useState<{ month: string; count: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, chartData, breakdownData, contactsData] = await Promise.all([
          dashboardApi.getStats(),
          dashboardApi.getMeetingsChart(),
          dashboardApi.getMediumBreakdown(),
          dashboardApi.getContactsOverTime(),
        ]);
        setStats(statsData);
        setMeetingsChart(chartData);
        setMediumBreakdown(breakdownData);
        setContactsOverTime(contactsData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[hsl(var(--primary))] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats?.totalContacts || 0}</p>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">Total Contacts</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
              <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats?.meetingsThisMonth || 0}</p>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">Meetings This Month</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-pink-100 dark:bg-pink-900">
              <Gift className="h-6 w-6 text-pink-600 dark:text-pink-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats?.upcomingBirthdays?.length || 0}</p>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">Upcoming Birthdays</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900">
              <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats?.pendingFollowups?.length || 0}</p>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">Pending Follow-ups</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contacts Growth Chart - Full Width on Mobile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Contacts Added Over Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={contactsOverTime}>
                <XAxis dataKey="month" fontSize={10} tick={{ fontSize: 10 }} interval={window.innerWidth < 640 ? 2 : 0} />
                <YAxis fontSize={10} tick={{ fontSize: 10 }} width={30} />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#10b981" fill="#10b98133" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Charts - Stack on Mobile */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Meetings per Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={meetingsChart}>
                  <XAxis dataKey="week" fontSize={10} tick={{ fontSize: 10 }} />
                  <YAxis fontSize={10} tick={{ fontSize: 10 }} width={30} />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Communication Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={mediumBreakdown} dataKey="count" nameKey="medium" cx="50%" cy="50%" outerRadius={60} label={({ name }) => name}>
                    {mediumBreakdown.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lists - Stack on Mobile */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/* Upcoming Birthdays */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-pink-500" />
              Upcoming Birthdays
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.upcomingBirthdays?.slice(0, 5).map((contact) => (
                <Link key={contact.id} to={`/contacts/${contact.id}`} className="flex items-center gap-3 rounded-lg p-2 hover:bg-[hsl(var(--accent))]">
                  <Avatar src={contact.profilePicture} name={contact.name} size="sm" />
                  <div className="flex-1">
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">{contact.birthday && formatBirthday(contact.birthday)}</p>
                  </div>
                  <Badge variant="secondary">{contact.birthday && `${getDaysUntil(contact.birthday)}d`}</Badge>
                </Link>
              )) || <p className="text-sm text-[hsl(var(--muted-foreground))]">No upcoming birthdays</p>}
            </div>
          </CardContent>
        </Card>

        {/* Pending Follow-ups */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              Pending Follow-ups
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.pendingFollowups?.slice(0, 5).map((meeting) => (
                <div key={meeting.id} className="flex items-center gap-3 rounded-lg p-2 hover:bg-[hsl(var(--accent))]">
                  <div className="flex-1">
                    <p className="font-medium">{meeting.notes?.slice(0, 30) || 'Follow-up'}</p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">{meeting.followupDate && formatRelative(meeting.followupDate)}</p>
                  </div>
                </div>
              )) || <p className="text-sm text-[hsl(var(--muted-foreground))]">No pending follow-ups</p>}
            </div>
          </CardContent>
        </Card>

        {/* Needs Attention */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Needs Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.needsAttention?.slice(0, 5).map((contact) => (
                <Link key={contact.id} to={`/contacts/${contact.id}`} className="flex items-center gap-3 rounded-lg p-2 hover:bg-[hsl(var(--accent))]">
                  <Avatar src={contact.profilePicture} name={contact.name} size="sm" />
                  <div className="flex-1">
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">
                      {contact.lastContactedAt ? `Last: ${formatRelative(contact.lastContactedAt)}` : 'Never contacted'}
                    </p>
                  </div>
                </Link>
              )) || <p className="text-sm text-[hsl(var(--muted-foreground))]">All contacts up to date</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
