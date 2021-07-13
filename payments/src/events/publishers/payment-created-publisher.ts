import { PaymentCreatedEvent, Subjects, Publisher } from "@ticketing_test/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated
}