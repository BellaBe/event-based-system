import { Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";

interface Event {
    subject: Subjects,
    data: unknown
}

export abstract class Publisher<T extends Event>{
    abstract subject: T["subject"];
    private client: Stan

    constructor(client: Stan){
        this.client = client
    }

    async publish(data: T["data"]):Promise<void>{
        try {
            await this.client.publish(this.subject, JSON.stringify(data));
            console.log(`Event published to subject ${this.subject}`)
        } catch (error) {
            throw error
        }
        
    }
}