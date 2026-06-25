import { useEffect, useState } from 'react';
import { BarChart3, MailCheck, MousePointerClick, RefreshCw, TrendingUp, Users } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import KpiCard from '../components/KpiCard.jsx';
import RecentLeadsTable from '../components/RecentLeadsTable.jsx';
import { getAnalytics } from '../api/client.js';

const colors = ['#0f766e', '#2563eb', '#9333ea', '#d97706', '#475569'];

const emptyAnalytics = {
  totals: {
    totalLeads: 0,
    emailsSent: 0,
    emailsOpened: 0,
    openRate: 0,
    linkClicks: 0,
    clickRate: 0,
  },
  charts: {
    bar: [],
    categories: [],
    priorities: [],
  },
  recentLeads: [],
};

function Dashboard() {
  const [analytics, setAnalytics] = useState(emptyAnalytics);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAnalytics = async () => {
    try {
      setError('');
      const data = await getAnalytics();
      setAnalytics(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const { totals, charts, recentLeads } = analytics;

  if (loading) {
    return (
      <section className="mx-auto mt-8 grid min-h-[420px] w-full max-w-7xl place-items-center rounded-lg border border-line bg-white">
        <div className="flex items-center gap-3 text-slate-600">
          <RefreshCw className="animate-spin" size={18} />
          Loading analytics...
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-7xl space-y-5 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-ink">Analytics Dashboard</h2>
          <p className="text-sm text-slate-600">Email delivery, opens, clicks, and AI lead qualification.</p>
        </div>
        <button
          type="button"
          onClick={loadAnalytics}
          className="focus-ring inline-flex items-center justify-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {error && <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard icon={Users} label="Total Leads" value={totals.totalLeads} tone="teal" />
        <KpiCard icon={MailCheck} label="Emails Sent" value={totals.emailsSent} tone="blue" />
        <KpiCard icon={TrendingUp} label="Emails Opened" value={totals.emailsOpened} tone="violet" />
        <KpiCard icon={BarChart3} label="Open Rate" value={`${totals.openRate}%`} tone="amber" />
        <KpiCard icon={MousePointerClick} label="Link Clicks" value={totals.linkClicks} tone="teal" />
        <KpiCard icon={TrendingUp} label="Click Rate" value={`${totals.clickRate}%`} tone="blue" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
        <div className="rounded-lg border border-line bg-white p-4 shadow-sm">
          <h3 className="mb-4 font-semibold text-ink">Engagement Overview</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.bar}>
                <CartesianGrid strokeDasharray="3 3" stroke="#dbe4ea" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis allowDecimals={false} stroke="#64748b" />
                <Tooltip />
                <Bar dataKey="value" fill="#0f766e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border border-line bg-white p-4 shadow-sm">
          <h3 className="mb-4 font-semibold text-ink">Priority Mix</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={charts.priorities} dataKey="value" nameKey="name" outerRadius={96} label>
                  {charts.priorities.map((entry, index) => (
                    <Cell key={entry.name} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <RecentLeadsTable leads={recentLeads} />
    </section>
  );
}

export default Dashboard;
