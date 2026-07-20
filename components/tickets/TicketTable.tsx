import type { Ticket } from "@/types/ticket";

export function TicketTable({ tickets }: { tickets: Ticket[] }) {
  return <div>{tickets.length} tickets</div>;
}
