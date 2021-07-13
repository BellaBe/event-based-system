import { OrderCreatedEvent, OrderStatus } from "@ticketing_test/common";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCreatedListener } from "../order-created-listener"
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client);

    // create and save a ticket

    const ticket = Ticket.build({
        title: "abc",
        price: 33,
        userId: "sdglkj"
    })
    await ticket.save();

    // Creat fake data object

    const data: OrderCreatedEvent["data"] = {
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: "adfljk",
        expiresAt: "sdglkj",
        ticket: {
            id: ticket.id,
            price: ticket.price,
        }
    }
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, ticket, msg}
}

it("sets the orderId of the ticket", async () => {
    const { listener, data, ticket, msg} = await setup();
    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.orderId).toEqual(data.id)
});

it("acks a message", async () => {
    const { listener, data, msg} = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
});

it("publishes ticket updated event", async () => {
    const { listener, data, msg} = await setup();
    await listener.onMessage(data, msg);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
    
    const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);

    expect(ticketUpdatedData.orderId).toEqual(data.id);
})

