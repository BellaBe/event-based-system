import { Publisher, Subjects, TicketCreatedEvent } from "@ticketing_test/common";

export class TickerCreatedPublisher extends Publisher<TicketCreatedEvent>{
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}