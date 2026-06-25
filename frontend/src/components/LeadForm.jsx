import { useState } from 'react';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import { createLead } from '../api/client.js';

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  company: '',
  requirement: '',
};

const getErrorMessage = (error) => {
  const validationErrors = error.response?.data?.errors;
  if (Array.isArray(validationErrors) && validationErrors.length) {
    return validationErrors.map((item) => item.message).join(' ');
  }
  return error.response?.data?.message || 'Unable to submit lead.';
};

function LeadForm({ onLeadCreated }) {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const lead = await createLead(form);
      setSuccess('Thanks. Your request has been submitted successfully.');
      setForm(initialForm);
      await onLeadCreated?.(lead);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-line bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-ink">Capture Lead</h2>
        <p className="mt-1 text-sm text-slate-600">Gemini analysis and email automation run after submission.</p>
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Full Name</span>
          <input
            className="focus-ring mt-1 w-full rounded-md border border-line px-3 py-2.5"
            name="fullName"
            value={form.fullName}
            onChange={updateField}
            placeholder="Aarav Sharma"
            required
            minLength={2}
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Email</span>
          <input
            className="focus-ring mt-1 w-full rounded-md border border-line px-3 py-2.5"
            type="email"
            name="email"
            value={form.email}
            onChange={updateField}
            placeholder="aarav@example.com"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Phone</span>
          <input
            className="focus-ring mt-1 w-full rounded-md border border-line px-3 py-2.5"
            name="phone"
            value={form.phone}
            onChange={updateField}
            placeholder="+91 98765 43210"
            required
            minLength={7}
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Company</span>
          <input
            className="focus-ring mt-1 w-full rounded-md border border-line px-3 py-2.5"
            name="company"
            value={form.company}
            onChange={updateField}
            placeholder="Optional"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Requirement / Message</span>
          <textarea
            className="focus-ring mt-1 min-h-32 w-full resize-y rounded-md border border-line px-3 py-2.5"
            name="requirement"
            value={form.requirement}
            onChange={updateField}
            placeholder="Tell us what you need help with..."
            required
            minLength={10}
          />
        </label>
      </div>

      {error && <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
      {success && (
        <div className="mt-4 flex items-center gap-2 rounded-md border border-teal-200 bg-teal-50 px-3 py-2 text-sm text-teal-800">
          <CheckCircle2 size={18} />
          <span>{success}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="focus-ring mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-teal-700 px-4 py-3 font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
        {submitting ? 'Analyzing and sending...' : 'Submit Lead'}
      </button>
    </form>
  );
}

export default LeadForm;
