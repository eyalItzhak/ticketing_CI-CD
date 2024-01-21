import {
  Publisher,
  Subjects,
  ExpirationCompleteEvent,
} from "@eyaltickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.expirationComplete;
}
