import express from "express";
import authController from "../controllers/authController";
import treeController from "../controllers/treeController";
import forestController from "../controllers/forestController";
import userController from "../controllers/userController";
import orderController from "../controllers/orderController";
import authorizationController from "../controllers/authorizationController";
import { isGranted } from "../middlewares/isGranted";
const routes = express.Router();

// AUTHENTICATION
routes.post("/login", authController.login);
routes.post("/register", authController.register);

// TREES 
routes.get("/trees", treeController.trees);
routes.get("/trees/:id", treeController.treeById);
routes.get("/trees/:id/forests", forestController.forestsByTree);
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
routes.post("/users", userController.addUser);
routes.patch("/users/:id/backoffice", authorizationController, isGranted, userController.updateUserBackOffice) //(BACKOFFICE)
routes.patch("/users/:id", authorizationController, isGranted, userController.updateUser);
routes.delete("/users/:id", /*authorizationController,*/ userController.deleteUser);

//ORDERS (
<<<<<<< HEAD
routes.get("/orders", authorizationController, isGranted, orderController.orders);
routes.get("/orders/:id", authorizationController, isGranted, orderController.orderById);
routes.post("/orders", authorizationController, isGranted, orderController.addOrder);
routes.patch("/orders/:id", authorizationController, isGranted, orderController.updateOrder);
=======
routes.get("/orders", authorizationController(['user', 'admin']), orderController.orders);
routes.get("/orders/user/:id", authorizationController(['user', 'admin']), orderController.ordersByUserId);
routes.get("/orders/:id", authorizationController(['user', 'admin']), orderController.orderById);
routes.post("/orders", authorizationController(['user', 'admin']), orderController.addOrder);
routes.patch("/orders/:id", authorizationController(['admin']), orderController.updateOrder);
>>>>>>> 3ddee17e6f8e3542dad0f94e4f002c8ba19cc7b7
    
export default routes;