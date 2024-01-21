import { OrderCancelledEvent, Publisher, Subjects } from "@eyaltickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
