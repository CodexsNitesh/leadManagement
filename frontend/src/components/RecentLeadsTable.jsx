const priorityClass = {
  High: 'bg-red-50 text-red-700 border-red-200',
  Medium: 'bg-amber-50 text-amber-700 border-amber-200',
  Low: 'bg-teal-50 text-teal-700 border-teal-200',
};

const emailStatusClass = {
  sent: 'bg-teal-50 text-teal-700 border-teal-200',
  pending: 'bg-slate-50 text-slate-600 border-slate-200',
  skipped: 'bg-amber-50 text-amber-700 border-amber-200',
  failed: 'bg-red-50 text-red-700 border-red-200',
};

function RecentLeadsTable({ leads }) {
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-white shadow-sm">
      <div className="border-b border-line px-4 py-3">
        <h3 className="font-semibold text-ink">Recent Leads</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Lead</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Sent</th>
              <th className="px-4 py-3">Opened</th>
              <th className="px-4 py-3">Clicks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {leads.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-center text-slate-500" colSpan={6}>
                  No leads captured yet.
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead._id} className="align-top">
                  <td className="px-4 py-3">
                    <div className="font-medium text-ink">{lead.fullName}</div>
                    <div className="text-xs text-slate-500">{lead.email}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{lead.aiAnalysis?.category || 'General Inquiry'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full border px-2 py-1 text-xs font-semibold ${priorityClass[lead.aiAnalysis?.priority] || priorityClass.Medium}`}>
                      {lead.aiAnalysis?.priority || 'Medium'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full border px-2 py-1 text-xs font-semibold ${
                        emailStatusClass[lead.emailTracking?.status] || emailStatusClass[lead.emailTracking?.sent ? 'sent' : 'pending']
                      }`}
                      title={lead.emailTracking?.error || ''}
                    >
                      {lead.emailTracking?.status || (lead.emailTracking?.sent ? 'sent' : 'pending')}
                    </span>
                  </td>
                  <td className="px-4 py-3">{lead.hasOpened ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-3">{lead.clickCount || 0}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentLeadsTable;
