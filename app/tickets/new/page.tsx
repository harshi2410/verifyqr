import { ProtectedShell } from "@/components/Navbar";

export default function NewTicketPage() {
  return (
    <ProtectedShell>
      <div className="topbar">
        <div>
          <h1 className="page-title">New Ticket</h1>
          <p className="muted">Ticket creation is ready for your next step.</p>
        </div>
      </div>
      <section className="panel">Add ticket fields here when you want QR ticket generation.</section>
    </ProtectedShell>
  );
}
