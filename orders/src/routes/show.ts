import express, {Request, Response} from "express";
import { BadRequestError, NotAutorizedError, NotFoundError, requireAuth } from "@ticketing_test/common";
import { Order } from "../models/order";
import mongoose from "mongoose";

const router = express.Router();

router.get("/api/orders/:orderId", requireAuth, async (req: Request, res: Response) => {
    if(!mongoose.Types.ObjectId.isValid(req.params.orderId)){
        throw new BadRequestError("A valid order id must be provided")
    }
    const order = await Order.findById(req.params.orderId).populate("ticket");

    if(!order){
        throw new NotFoundError();
    }
    if(order.userId !== req.currentUser!.id){
        throw new NotAutorizedError();
    }
    res.send(order);
});

export { router as showOrderRouter };