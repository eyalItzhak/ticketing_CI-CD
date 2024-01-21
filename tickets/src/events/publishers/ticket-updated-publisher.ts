import { Publisher, Subjects, TicketUpdatedEvent } from "@eyaltickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
