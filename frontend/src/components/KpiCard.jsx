function KpiCard({ icon: Icon, label, value, tone = 'teal' }) {
  const toneClasses = {
    teal: 'bg-teal-50 text-teal-700',
    blue: 'bg-sky-50 text-sky-700',
    violet: 'bg-violet-50 text-violet-700',
    amber: 'bg-amber-50 text-amber-700',
  };

  return (
    <div className="rounded-lg border border-line bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-ink">{value}</p>
        </div>
        <div className={`grid h-10 w-10 place-items-center rounded-md ${toneClasses[tone]}`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

export default KpiCard;
