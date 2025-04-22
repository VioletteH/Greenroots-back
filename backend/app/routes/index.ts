import express from "express";
import authController from "../controllers/authController";
import treeController from "../controllers/treeController";
import forestController from "../controllers/forestController";
import userController from "../controllers/userController";
import orderController from "../controllers/orderController";
import authorizationController from "../controllers/authorizationController";
import { isGranted } from "../middlewares/isGranted";
import orderItemController from "../controllers/itemController";
import itemController from "../controllers/itemController";
const routes = express.Router();

// AUTHENTICATION
routes.post("/login", authController.login);
routes.post("/register", authController.register);

// TREES 
routes.get("/trees", treeController.trees);
routes.get("/trees/:id", treeController.treeById);
routes.get("/trees/:id/forests", forestController.forestsByTree);
routes.get("/trees/country/:slug", treeController.treesByCountry);
routes.get("/trees/category/:slug", treeController.treesByCategory);
routes.post("/trees", authorizationController, isGranted, treeController.addTree);
routes.patch("/trees/:id", authorizationController, isGranted, treeController.updateTree);
routes.delete("/trees/:id", authorizationController, isGranted, treeController.deleteTree);

//FORESTS
routes.get("/forests", forestController.forests);
routes.get("/forests/:id", forestController.forestById);
routes.get("/forests/:id/trees", treeController.treesByForest);
routes.post("/forests", authorizationController, isGranted, forestController.addForest);
routes.patch("/forests/:id", authorizationController, isGranted, forestController.updateForest);
routes.delete("/forests/:id", authorizationController, isGranted, forestController.deleteForest);

//USERS (utilisateurs)
routes.get("/users", /*authorizationController,*/ userController.users);
routes.get("/users/:id", authorizationController, isGranted, userController.userById);
routes.post("/users", authorizationController, isGranted, userController.addUser);
routes.patch("/users/:id/backoffice", authorizationController, isGranted, userController.updateUserBackOffice) //(BACKOFFICE)
routes.patch("/users/:id", authorizationController, isGranted, userController.updateUser);
routes.delete("/users/:id", /*authorizationController,*/ userController.deleteUser);

//ORDERS
routes.get("/orders", authorizationController, isGranted, orderController.orders);
routes.get("/orders/:id", authorizationController, isGranted, orderController.orderById);
routes.get("/orders/user/:id", authorizationController, isGranted, orderController.ordersByUserId);
routes.post("/orders", authorizationController, isGranted, orderController.addOrder);
routes.patch("/orders/:id", authorizationController, isGranted, orderController.updateOrder);

//ORDER ITEMS
routes.get("/items", itemController.items);
routes.get("/items/order/:id", itemController.itemsByOrderId);
routes.post("/orders-items", itemController.addOrderItem);

export default routes;