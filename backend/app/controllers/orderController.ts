import { NextFunction, Request, Response } from "express";
import BaseMapper from "../mappers/baseMapper";
import { Order } from "../types/index";
import { orderSchema } from "../utils/shemasJoi";
import { AppError } from "../middlewares/errorHandler";
import { catchAsync } from "../utils/catchAsync";
import { userLogged } from "../utils/userLogged";

const orderMapper = new BaseMapper<Order>("order");

const orderController = {
  orders: catchAsync(async (req: Request, res: Response) => {
    const orders = await orderMapper.findAll();
    console.log("orders", orders);
    if (orders.length === 0) {
      res.status(200).json("ordders not found");
    }
    res.status(200).json(orders);
  }),
  orderById: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
     // Check user id
    const id = userLogged(req);

    if (id === null) {
      return next(new AppError("Invalid user ID", 400));
    }

    const order = await orderMapper.findById(id);
    if (!order) {
      return next(new AppError(`Order ${id} already exists `, 400));
    }
    res.status(200).json(order);
  }),
  addOrder: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // Validation
    const { error, value } = orderSchema.validate(req.body);
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
    // Validation
    const { error, value } = orderSchema.validate(req.body);
    if (error) {
      next(new AppError(`Invalid data`, 400));
      return res.status(400).json({ message: "Invalid data" });
    }
    // Order exist
    const existingOrder = await orderMapper.findById(id);
    if (!existingOrder) {
      return next(new AppError(`Order ${id} not found`, 404));
    }
    // Update order
    // TODO - check if the order is already paid
    const updatedOrder = await orderMapper.update(id, value);
    res.status(200).json(updatedOrder);
  }),
  deleteOrder: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id, 10);
    // Order exist
    const existingOrder = await orderMapper.findById(id);
    if (!existingOrder) {
      return next(new AppError(`Order ${id} not found`, 404));
    }
    // TODO - check if the order is already paid
    const deletedOrder = await orderMapper.delete(id);
    res.status(200).json(deletedOrder);
  }),
};
export default orderController;
