import nats, { Stan } from "node-nats-streaming";

class NatsWrapper {
  //singleton class
  private _client?: Stan;

  get client() {
    if (!this._client) {
      throw new Error("Cannot access NATS client before connection");
    }
    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });
    return new Promise<void>((resolve, reject) => {
      this.client.on("connect", () => {
        console.log("Connected to NATS");
        resolve();
      });

      this.client.on("error", (err) => {
        reject(err);
      });
    });
  }
}
export const natsWrapper = new NatsWrapper(); //in this file create the class and sent the same object between files
