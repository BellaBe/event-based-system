import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { Ticket } from "../../../models/ticket";
import mongoose from "mongoose";
import { OrderCancelledEvent } from "@ticketing_test/common";

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);
    const orderId = mongoose.Types.ObjectId().toHexString();

    // create and save a ticket

    const ticket = Ticket.build({
        title: "abc",
        price: 33,
        userId: "sdglkj"

    })
    ticket.set({ orderId })
    await ticket.save();

    // Creat fake data object

    const data: OrderCancelledEvent["data"] = {
        id: orderId,
        version: 0,
        ticket: {
            id: ticket.id
        }
    }
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, ticket, msg}
}

it("updates the ticket, publishes an event and ack the message", async () => {
    const { listener, data, ticket, msg} = await setup();
    await listener.onMessage(data, msg);
    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket!.orderId).not.toBeDefined();
    expect(msg.ack).toHaveBeenCalled();
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});