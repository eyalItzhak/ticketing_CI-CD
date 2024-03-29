import {
  Listener,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from "@eyaltickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { expirationQueue } from "../../queues/expration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log("waiting this many milliseconds to process the job :", delay);
    await expirationQueue.add({ orderId: data.id }, { delay });
    msg.ack();
  }
}
