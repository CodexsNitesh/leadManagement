import { useEffect, useState } from 'react';
import LeadForm from './components/LeadForm.jsx';
import Dashboard from './pages/Dashboard.jsx';
import { getAnalytics } from './api/client.js';

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

function App() {
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

  return (
    <main className="min-h-screen">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-2 border-b border-line pb-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Automated Lead Management</p>
            <h1 className="mt-1 text-3xl font-bold text-ink sm:text-4xl">Lead Capture & Email Tracking</h1>
          </div>
          <p className="max-w-xl text-sm text-slate-600">
            Capture inquiries, analyze intent with Gemini, send tracked emails, and watch engagement metrics update from one workspace.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-[420px_minmax(0,1fr)]">
          <LeadForm onLeadCreated={loadAnalytics} />
          <Dashboard analytics={analytics} loading={loading} error={error} onRefresh={loadAnalytics} />
        </section>
      </div>
    </main>
  );
}

export default App;
