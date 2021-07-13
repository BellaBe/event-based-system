import mongoose from "mongoose";
import { updateIfCurrentPlugin} from "mongoose-update-if-current"
import { Order, OrderStatus } from "./order";


interface TicketAttr {
    id: string;
    title: string;
    price: number;
}

export interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    version: number;
    isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttr): TicketDoc;
    findByEvent(event: {id: string, version: number}): Promise<TicketDoc | null>
}

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    toJSON: {
        transform(doc, ret){
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

// // Use the hook if updateIfCurrent is not used, different 
// // counting is used(adjust number 1 to the type of numbering)
// ticketSchema.pre("save", function(done) {
//     this.$where = {
//         version: this.get("version") - 1
//     }
//     done();
// });


ticketSchema.statics.build = (attrs: TicketAttr) => {
    return new Ticket({
        _id: attrs.id,
        title: attrs.title,
        price: attrs.price
    })
};

ticketSchema.statics.findByEvent = (event: {id: string, version: number}) => {
    return Ticket.findOne({
        _id: event.id,
        version: event.version - 1
    });
}

ticketSchema.methods.isReserved = async function () {
    // this === the ticket document that we just called isReserved on
     // Run query to look at all orders. FInd order where the ticket is
    // the ticket we just found *and* the order status is *not* cancelled
    // If we find the order from that means the ticket *is* reserved

    const existingOrder = await Order.findOne({
        ticket: this as any,
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Complete
            ]
        }
    });
    return !!existingOrder;
}

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };