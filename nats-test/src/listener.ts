import nats from "node-nats-streaming";
import { randomBytes } from "crypto";
import { TicketCreateListener } from "./events/ticket-created-listenr";

console.clear();
const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  //we use kubectl port-forward nats-depl-75b9dff744-m4kr8 4222:4222
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("listener connect to NATS");

  stan.on("close", () => {
    console.log("NATS connection closed!");
    process.exit();
  });

  new TicketCreateListener(stan).listen();
});

process.on("SIGINT", () => {
  stan.close();
});
process.on("SIGTERM", () => {
  // not working on windows
  stan.close();
});

//need run skaffold
//we use kubectl port-forward nats-depl-75b9dff744-m4kr8 4222:4222
//http://localhost:8222/streaming/channelsz?subs=1
