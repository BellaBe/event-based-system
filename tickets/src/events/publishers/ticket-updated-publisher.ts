import { Publisher, Subjects, TicketUpdatedEvent } from "@ticketing_test/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}