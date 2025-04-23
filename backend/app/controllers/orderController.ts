import { NextFunction, Request, Response } from "express";
import { orderSchema, orderUpdateSchema } from "../utils/shemasJoi";
import { AppError } from "../middlewares/errorHandler";
import { catchAsync } from "../utils/catchAsync";
import BaseMapper from "../mappers/baseMapper";
// import { userLogged } from "../utils/userLogged";

const orderMapper = new BaseMapper("order");

const orderController = {
  orders: catchAsync(async (req: Request, res: Response) => {
    const orders = await orderMapper.findAll();
    console.log("orders", orders);
    if (orders.length === 0) {
      res.status(200).json("ordders not found");
    }
    res.status(200).json(orders);
  }),

  ordersByUserId: catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const id = parseInt(req.params.id, 10);
    if (id === null) {
      return next(new AppError("Invalid user ID", 400));
    }
    const orders = await orderMapper.findByField("user_id", id);
    res.status(200).json(orders);
  }),

  orderById: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
     // Check user id
     const id = parseInt(req.params.id, 10);

    const order = await orderMapper.findById(id);
    if (!order) {
      return next(new AppError(`Order ${id} already exists `, 400));
    }
    res.status(200).json(order);
  }),

  addOrder: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // Validation
    const { error, value } = orderSchema.validate(req.body);
    console.log("error", error);
    console.log("value", value);
    
    if (error) {
      return next(new AppError(`Invalid data`, 400));
    }
    // Order exist
    const existingOrder = await orderMapper.findById(value.id);
    if (existingOrder) {
      return next(new AppError(`Order ${value.id} already exists`, 400));
    }
    // Create new order
    const newOrder = await orderMapper.create(value);
    res.status(201).json(newOrder);
  }),

  updateOrder: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id, 10);
    
    const { error, value } = orderUpdateSchema.validate(req.body);

    if (error) {
      return next(new AppError(`Invalid data`, 400));
    }

    const existingOrder = await orderMapper.findById(id);
    if (!existingOrder) {
      return next(new AppError(`Order ${id} not found`, 404));
    }

    const updatedOrder = await orderMapper.update(id, value);
    res.status(200).json(updatedOrder);
  }),
};
export default orderController;
