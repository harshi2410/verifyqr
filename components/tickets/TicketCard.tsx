import type { Ticket } from "@/types/ticket";

export function TicketCard({ ticket }: { ticket: Ticket }) {
  return <section className="panel">{ticket.label}</section>;
}
