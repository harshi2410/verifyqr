import { ProtectedShell } from "@/components/Navbar";

export default function TicketsPage() {
  return (
    <ProtectedShell>
      <div className="topbar">
        <div>
          <h1 className="page-title">Tickets</h1>
          <p className="muted">Ticket management can be added here after the verification portal is live.</p>
        </div>
      </div>
      <section className="panel">No ticket records are configured yet.</section>
    </ProtectedShell>
  );
}
