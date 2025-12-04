import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar, Gift, Clock, AlertCircle, TrendingUp, ArrowUpRight, Sparkles, ChevronDown } from 'lucide-react';
import { Card, CardContent, Avatar, Badge } from '../components/ui';
import { dashboardApi } from '../services/api';
import { formatRelative, formatBirthday, getDaysUntil } from '../utils/dates';
import type { Contact, Meeting } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import { useAuthStore } from '../store/authStore';

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

// Collapsible section component for mobile-friendly analytics
const CollapsibleSection = ({
  title,
  icon: Icon,
  iconColor,
  badge,
  count,
  children,
  defaultOpen = true
}: {
  title: string;
  icon?: typeof TrendingUp;
  iconColor?: string;
  badge?: string;
  count?: number;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card variant="elevated" className="overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 p-4 sm:p-6 hover:bg-[hsl(var(--accent))]/50 transition-colors text-left"
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {Icon && <Icon className={`h-5 w-5 shrink-0 ${iconColor || 'text-[hsl(var(--primary))]'}`} />}
          <span className="font-semibold truncate">{title}</span>
          {badge && <Badge variant="secondary" className="shrink-0 hidden sm:inline-flex">{badge}</Badge>}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {/* Show count badge when collapsed */}
          {!isOpen && count !== undefined && count > 0 && (
            <span className="inline-flex items-center justify-center h-6 min-w-[24px] px-2 rounded-full bg-[hsl(var(--primary))] text-white text-xs font-medium">
              {count}
            </span>
          )}
          <ChevronDown
            className={`h-5 w-5 text-[hsl(var(--muted-foreground))] transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pb-4 sm:px-6 sm:pb-6">
          {children}
        </div>
      </div>
    </Card>
  );
};

const StatCard = ({ icon: Icon, label, value, color, trend }: {
  icon: typeof Users;
  label: string;
  value: number;
  color: string;
  trend?: number;
}) => (
  <Card className="hover-lift group cursor-default">
    <CardContent className="flex items-center gap-4 p-6">
      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${color} transition-transform group-hover:scale-110`}>
        <Icon className="h-7 w-7" />
      </div>
      <div className="flex-1">
        <p className="text-3xl font-bold">{value}</p>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">{label}</p>
      </div>
      {trend !== undefined && (
        <div className={`flex items-center gap-1 text-sm font-medium ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          <ArrowUpRight className={`h-4 w-4 ${trend < 0 ? 'rotate-90' : ''}`} />
          {Math.abs(trend)}%
        </div>
      )}
    </CardContent>
  </Card>
);

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [meetingsChart, setMeetingsChart] = useState<{ week: string; count: number }[]>([]);
  const [mediumBreakdown, setMediumBreakdown] = useState<{ medium: string; count: number }[]>([]);
  const [contactsOverTime, setContactsOverTime] = useState<{ month: string; count: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();

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
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[hsl(var(--primary))] border-t-transparent" />
          <p className="text-sm text-[hsl(var(--muted-foreground))]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[hsl(var(--primary))]" />
          <span className="text-sm font-medium text-[hsl(var(--primary))]">Dashboard</span>
        </div>
        <h1 className="text-3xl font-bold">
          {greeting()}, {user?.name?.split(' ')[0] || 'there'}
        </h1>
        <p className="text-[hsl(var(--muted-foreground))]">
          Here's what's happening with your network today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 stagger-children">
        <StatCard
          icon={Users}
          label="Total Contacts"
          value={stats?.totalContacts || 0}
          color="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"
        />
        <StatCard
          icon={Calendar}
          label="Meetings This Month"
          value={stats?.meetingsThisMonth || 0}
          color="bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400"
        />
        <StatCard
          icon={Gift}
          label="Upcoming Birthdays"
          value={stats?.upcomingBirthdays?.length || 0}
          color="bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-400"
        />
        <StatCard
          icon={Clock}
          label="Pending Follow-ups"
          value={stats?.pendingFollowups?.length || 0}
          color="bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400"
        />
      </div>

      {/* Contacts Growth Chart - Full Width - Collapsible */}
      <CollapsibleSection
        title="Contacts Added Over Time"
        icon={TrendingUp}
        iconColor="text-green-500"
        badge="Last 6 months"
      >
        <div className="h-56 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={contactsOverTime}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis
                dataKey="month"
                fontSize={12}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                fontSize={12}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                width={40}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px -2px rgba(0,0,0,0.1)'
                }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#10b981"
                fill="url(#colorCount)"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CollapsibleSection>

      {/* Charts - Stack on Mobile - Collapsible */}
      <div className="grid gap-6 lg:grid-cols-2">
        <CollapsibleSection
          title="Meetings per Week"
          icon={Calendar}
          iconColor="text-blue-500"
        >
          <div className="h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={meetingsChart}>
                <XAxis
                  dataKey="week"
                  fontSize={12}
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  fontSize={12}
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  width={30}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px'
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="hsl(var(--primary))"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          title="Communication Breakdown"
          icon={Users}
          iconColor="text-purple-500"
        >
          <div className="h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mediumBreakdown}
                  dataKey="count"
                  nameKey="medium"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={50}
                  paddingAngle={3}
                  label={({ name }) => name}
                >
                  {mediumBreakdown.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CollapsibleSection>
      </div>

      {/* Lists - Stack on Mobile - Collapsible */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Upcoming Birthdays */}
        <CollapsibleSection
          title="Upcoming Birthdays"
          icon={Gift}
          iconColor="text-pink-500"
          count={stats?.upcomingBirthdays?.length}
          defaultOpen={false}
        >
          <div className="space-y-2">
            {stats?.upcomingBirthdays?.slice(0, 5).map((contact) => (
              <Link
                key={contact.id}
                to={`/contacts/${contact.id}`}
                className="flex items-center gap-3 rounded-xl p-3 transition-all hover:bg-[hsl(var(--accent))] hover:shadow-sm group"
              >
                <Avatar src={contact.profilePicture} name={contact.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate group-hover:text-[hsl(var(--primary))] transition-colors">{contact.name}</p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">{contact.birthday && formatBirthday(contact.birthday)}</p>
                </div>
                <Badge variant="secondary" className="shrink-0">{contact.birthday && `${getDaysUntil(contact.birthday)}d`}</Badge>
              </Link>
            )) || <p className="text-sm text-[hsl(var(--muted-foreground))] text-center py-4">No upcoming birthdays</p>}
          </div>
        </CollapsibleSection>

        {/* Pending Follow-ups */}
        <CollapsibleSection
          title="Pending Follow-ups"
          icon={Clock}
          iconColor="text-orange-500"
          count={stats?.pendingFollowups?.length}
          defaultOpen={false}
        >
          <div className="space-y-2">
            {stats?.pendingFollowups?.slice(0, 5).map((meeting) => (
              <div
                key={meeting.id}
                className="flex items-center gap-3 rounded-xl p-3 transition-all hover:bg-[hsl(var(--accent))] hover:shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/50">
                  <Clock className="h-5 w-5 text-orange-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{meeting.notes?.slice(0, 30) || 'Follow-up'}</p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">{meeting.followupDate && formatRelative(meeting.followupDate)}</p>
                </div>
              </div>
            )) || <p className="text-sm text-[hsl(var(--muted-foreground))] text-center py-4">No pending follow-ups</p>}
          </div>
        </CollapsibleSection>

        {/* Needs Attention */}
        <CollapsibleSection
          title="Needs Attention"
          icon={AlertCircle}
          iconColor="text-red-500"
          count={stats?.needsAttention?.length}
          defaultOpen={false}
        >
          <div className="space-y-2">
            {stats?.needsAttention?.slice(0, 5).map((contact) => (
              <Link
                key={contact.id}
                to={`/contacts/${contact.id}`}
                className="flex items-center gap-3 rounded-xl p-3 transition-all hover:bg-[hsl(var(--accent))] hover:shadow-sm group"
              >
                <Avatar src={contact.profilePicture} name={contact.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate group-hover:text-[hsl(var(--primary))] transition-colors">{contact.name}</p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">
                    {contact.lastContactedAt ? `Last: ${formatRelative(contact.lastContactedAt)}` : 'Never contacted'}
                  </p>
                </div>
              </Link>
            )) || <p className="text-sm text-[hsl(var(--muted-foreground))] text-center py-4">All contacts up to date</p>}
          </div>
        </CollapsibleSection>
      </div>
    </div>
  );
}
