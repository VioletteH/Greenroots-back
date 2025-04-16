import express from "express";
import authController from "../controllers/authController";
import treeController from "../controllers/treeController";
import forestController from "../controllers/forestController";
import userController from "../controllers/userController";
import orderController from "../controllers/orderController";
import authorizationController from "../controllers/authorizationController";
const routes = express.Router();

// AUTHENTICATION
routes.post("/login", authController.login);
routes.post("/register", authController.register);

// TREES 
routes.get("/trees", treeController.trees);
routes.get("/trees/:id", treeController.treeById);
routes.get("/trees/:id/forests", forestController.forestsByTree);
routes.post("/trees", authorizationController(['admin']), treeController.addTree);
routes.patch("/trees/:id", authorizationController(['admin']), treeController.updateTree);
routes.delete("/trees/:id", authorizationController(['admin']), treeController.deleteTree);

//FORESTS
routes.get("/forests", forestController.forests);
routes.get("/forests/:id", forestController.forestById);
routes.post("/forests", authorizationController(['admin']), forestController.addForest);
routes.patch("/forests/:id", authorizationController(['admin']), forestController.updateForest);
routes.delete("/forests/:id", authorizationController(['admin']), forestController.deleteForest);

//USERS (utilisateurs)
routes.get("/users", authorizationController(['admin']), userController.users);
routes.get("/users/:id", authorizationController(['user', 'admin']), userController.userById);
routes.post("/users", userController.addUser);
routes.patch("/users/:id/backoffice", userController.updateUserBackOffice) //(BACKOFFICE)
routes.patch("/users/:id", authorizationController(['user', 'admin']), userController.updateUser);
routes.delete("/users/:id", authorizationController(['user', 'admin']), userController.deleteUser);

//ORDERS (
routes.get("/orders", authorizationController(['user', 'admin']), orderController.orders);
routes.get("/orders/:id", authorizationController(['user', 'admin']), orderController.orderById);
routes.post("/orders", authorizationController(['user', 'admin']), orderController.addOrder);
routes.patch("/orders/:id", authorizationController(['user', 'admin']), orderController.updateOrder);
    
export default routes;