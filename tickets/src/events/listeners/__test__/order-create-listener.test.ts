import { OrderCreatedEvent, OrderStatus } from "@eyaltickets/common";
import { Ticket } from "../../../models/tickets";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreateListener } from "../order-create-listener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

const setup = async () => {
  //create an instance of the listener
  const listener = new OrderCreateListener(natsWrapper.client);
  //create and save a ticket
  const ticket = Ticket.build({ title: "concert", price: 99, userId: "asdf" });
  await ticket.save();
  //create the fake data event
  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: "asdasd",
    expiresAt: "1111", //not implement now
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg };
};

it("sets the userId of the tickets", async () => {
  const { listener, ticket, data, msg } = await setup();
  await listener.onMessage(data, msg);
  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.orderId).toEqual(data.id);
});

it("acks the message", async () => {
  const { listener, ticket, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});

it("publishes a ticket update event", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
  const ticketUpdateData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );
  expect(data.id).toEqual(ticketUpdateData.orderId);
});
