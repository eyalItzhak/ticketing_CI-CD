import { Publisher, Subjects, TicketCreatedEvent } from "@eyaltickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
