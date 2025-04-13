import express from "express";
import authController from "../controllers/authController";
import treeController from "../controllers/treeController";
import forestController from "../controllers/forestController";
import userController from "../controllers/userController";
import orderController from "../controllers/orderController";
const routes = express.Router();

// AUTHENTICATION
routes.post("/login", authController.login);
routes.get("/register", authController.register);


// TREES 
routes.get("/trees", treeController.trees);
routes.get("/trees/:id", treeController.treesById);
routes.post("/trees", treeController.addTree);
routes.patch("/trees/:id", treeController.updateTree);
routes.delete("/trees/:id", treeController.deleteTree);

//FORESTS
routes.get("/forests", forestController.forests);
routes.get("/forests/:id", forestController.forestById);
routes.post("/forests", forestController.addForest);
routes.patch("/forests/:id", forestController.updateForest);
routes.delete("/forests/:id", forestController.deleteForest);


//USERS (utilisateurs)
routes.get("/users", userController.users);
routes.get("/users/:id", userController.userById);
routes.post("/users", userController.addUser); //(BACKOFFICE)
routes.patch("/users/:id", userController.updateUser);
routes.delete("/users/:id", userController.deleteUser);


//ORDERS (
routes.get("/orders", orderController.orders);
routes.get("/orders/:id", orderController.orderById);
routes.post("/orders", orderController.addOrder);
routes.patch("/orders/:id", orderController.updateOrder);
    
export default routes;