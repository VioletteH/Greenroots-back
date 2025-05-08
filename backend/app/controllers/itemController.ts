import e, { NextFunction, Request, Response } from "express";
import { orderSchema } from "../utils/shemasJoi";
import { AppError } from "../middlewares/errorHandler";
import { catchAsync } from "../utils/catchAsync";
import BaseMapper from "../mappers/baseMapper";
import { updateStock } from "../utils/updateStock";
import { sanitizeInput } from '../utils/sanitizeInput';


const orderItemMapper = new BaseMapper("order_item");

const itemController = {

  items: catchAsync(async (req: Request, res: Response) => {
      const items = await orderItemMapper.findAll();
      if (items.length === 0) {
        res.status(200).json("items not found");
      }
      res.status(200).json(items);
    }),

  itemsByOrderId: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = (req.params.id as unknown) as number;
    if (id === null) {
      return next(new AppError("Invalid user ID", 400));
    }
    const items = await orderItemMapper.findByField("order_id", id);
    res.status(200).json(items);
  }),

  addOrderItem: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      const data = req.body;
      const addOrderItemResult = await orderItemMapper.create(data);

      if (!addOrderItemResult) {
        return next(new AppError(`Order item not created`, 400));
      }
    
      await updateStock(Number(data.tree_id), Number(data.forest_id), Number(data.quantity));
      res.status(201).json(addOrderItemResult)
    }
  ),
  }

export default itemController;
