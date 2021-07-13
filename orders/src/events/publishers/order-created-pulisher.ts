import { OrderCreatedEvent, Publisher, Subjects } from "@ticketing_test/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}