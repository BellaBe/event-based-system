import { ExpirationCompleteEvent, Subjects, Publisher } from "@ticketing_test/common";

export class ExpirationCopletePublisher extends Publisher<ExpirationCompleteEvent>{
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}