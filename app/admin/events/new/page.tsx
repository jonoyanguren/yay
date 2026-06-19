import Link from "next/link";
import EventForm from "../../components/EventForm";

export default function NewEventPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/admin/events" className="text-slate-600 hover:text-slate-800 text-sm">
          &larr; Eventos
        </Link>
        <h1 className="text-3xl font-bold text-slate-800 mt-4 mb-8">Nuevo evento</h1>
        <EventForm />
      </div>
    </div>
  );
}
