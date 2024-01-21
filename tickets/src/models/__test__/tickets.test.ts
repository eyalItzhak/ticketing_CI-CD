import { Ticket } from "../tickets";

it("implements optimistic concurrency control", async () => {
  //create an instance of tickets
  const ticket = Ticket.build({ title: "concert", price: 20, userId: "123" });
  // save the tickets to the database
  await ticket.save();
  //fetch the tickets twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);
  //make two separate changes to the tickets we fetched
  firstInstance!.set({ price: 20 });
  secondInstance!.set({ price: 15 });
  //save the first fetched tickets
  await firstInstance!.save();
  //save the second fetched  tickets and expect an error

  try {
    await secondInstance!.save();
  } catch (err) {
    return;
  }

  throw new Error("Should not reach this point");
});

it("increments the version number on multiple saves", async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
    userId: "123",
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
