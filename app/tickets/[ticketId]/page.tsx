import { ProtectedShell } from "@/components/Navbar";

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ ticketId: string }>;
}) {
  const { ticketId } = await params;

  return (
    <ProtectedShell>
      <div className="topbar">
        <div>
          <h1 className="page-title">Ticket {ticketId}</h1>
          <p className="muted">Ticket detail view placeholder.</p>
        </div>
      </div>
      <section className="panel">No ticket detail data is connected yet.</section>
    </ProtectedShell>
  );
}
