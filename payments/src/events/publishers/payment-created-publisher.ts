import { Subjects, Publisher, PaymentCreatedEvent } from "@eyaltickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreate;
}
