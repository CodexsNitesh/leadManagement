import LeadForm from '../components/LeadForm.jsx';

function LeadFormPage() {
  return (
    <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_420px] lg:px-8">
      <section className="flex flex-col justify-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Tell us what you need</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold text-ink sm:text-5xl">Request a consultation</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
          Share your requirement and contact details. Our team will receive your request, review the AI-assisted summary, and follow up shortly.
        </p>
      </section>

      <LeadForm />
    </div>
  );
}

export default LeadFormPage;
