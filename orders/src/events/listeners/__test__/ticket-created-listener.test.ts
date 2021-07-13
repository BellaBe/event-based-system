import { TicketCreatedListener } from "../ticket-created-listeners";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedEvent } from "@ticketing_test/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
    // create an instance of the listener

    const listener = new TicketCreatedListener(natsWrapper.client);

    // create a fake data object
    const data: TicketCreatedEvent["data"] = {
        version: 0,
        id: mongoose.Types.ObjectId().toHexString(),
        title: "concert",
        price: 10,
        userId: mongoose.Types.ObjectId().toHexString()
    };

    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, data, msg };

}

it("creates and save a ticket", async () => {
    // call the onMessage function with the data object + msg object
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    const ticket = await Ticket.findById(data.id);

    // write assertion to make sure a ticet was created
    expect(ticket).toBeDefined();
    expect(ticket!.title).toEqual(data.title);
    expect(ticket!.price).toEqual(data.price);

});

it("acks the message", async () => {
    const { listener, data, msg } = await setup();

    // call the onMessage function with the data object + msg object
    await listener.onMessage(data, msg);

    // write assertion to make sure ack function is called
    expect(msg.ack).toHaveBeenCalled();

});