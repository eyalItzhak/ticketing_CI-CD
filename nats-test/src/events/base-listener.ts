import { Message, Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";

interface Event {
  //generic msg
  subject: Subjects;
  data: any;
}

export abstract class Listener<T extends Event> {
  abstract subject: T["subject"];
  abstract queueGroupName: string;
  abstract onMessage(data: T["data"], msg: Message): void;
  private client: Stan;
  protected ackWait = 5 * 1000;

  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOption() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true) // only when add msg.ack() event bus know that we recived this msg
      .setAckWait(this.ackWait) // time listen have to ack msg
      .setDurableName(this.queueGroupName); // when get back online will get all missing msg and process them
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName, //set the queue group
      this.subscriptionOption()
    );

    subscription.on("message", (msg: Message) => {
      console.log(
        `Message received : ${this.subject} / ${this.queueGroupName}`
      );
      const parseData = this.parseMessage(msg);
      this.onMessage(parseData, msg); //run abstract function that supplied by user
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData();

    return typeof data === "string"
      ? JSON.parse(data)
      : JSON.parse(data.toString("utf8"));
  }
}
