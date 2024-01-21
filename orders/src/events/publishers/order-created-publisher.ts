import { OrderCreatedEvent, Publisher, Subjects } from "@eyaltickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
