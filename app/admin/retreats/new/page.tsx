import RetreatForm from "../../components/RetreatForm";
import Link from "next/link";

export default function NewRetreatPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            href="/admin"
            className="text-slate-600 hover:text-slate-800 inline-flex items-center font-medium"
          >
            &larr; Back to Dashboard
          </Link>
        </div>
        
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Create New Retreat</h1>
        
        <RetreatForm />
      </div>
    </div>
  );
}
