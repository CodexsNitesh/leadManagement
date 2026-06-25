import { BarChart3, FileText } from 'lucide-react';
import LeadFormPage from './pages/LeadFormPage.jsx';
import Dashboard from './pages/Dashboard.jsx';

function App() {
  const path = window.location.pathname;
  const isDashboard = path.startsWith('/dashboard');

  return (
    <main className="min-h-screen">
      <nav className="border-b border-line bg-white">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <a href="/" className="text-base font-bold text-ink">
            Lead Management
          </a>
          <div className="flex items-center gap-2">
            <a
              href="/"
              className={`focus-ring inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold ${
                !isDashboard ? 'bg-teal-700 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <FileText size={16} />
              User Form
            </a>
            <a
              href="/dashboard"
              className={`focus-ring inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold ${
                isDashboard ? 'bg-teal-700 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <BarChart3 size={16} />
              Client Dashboard
            </a>
          </div>
        </div>
      </nav>

      {isDashboard ? <Dashboard /> : <LeadFormPage />}
    </main>
  );
}

export default App;
