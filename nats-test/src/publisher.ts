import nats from "node-nats-streaming";
import { TicketCreatePublisher } from "./events/ticket-created-publisher";
import { Publisher } from "./events/base-publisher";

console.clear();
const stan = nats.connect("ticketing", "abc", {
  //we use kubectl port-forward nats-depl-75b9dff744-m4kr8 4222:4222
  url: "http://localhost:4222",
});

stan.on("connect", async () => {
  console.log("Publisher connect to NATS");
  const publisher = new TicketCreatePublisher(stan);
  try {
    await publisher.publish({
      id: "123",
      title: "concert",
      price: 20,
    });
  } catch (err) {
    console.log(err);
  }
});
