import express from "express";

import authController from "../controllers/authController";
import treeController from "../controllers/treeController";
import forestController from "../controllers/forestController";
import userController from "../controllers/userController";
import orderController from "../controllers/orderController";
import itemController from "../controllers/itemController";
import stripeController from "../controllers/stripeController";
import authorizationController from "../controllers/authorizationController";
import searchController from "../controllers/searchController";

import { isGranted } from "../middlewares/isGranted";

const routes = express.Router();

// AUTHENTICATION

routes.post("/login", authController.login);
routes.post("/register", authController.register);

// TREES 

// all trees
routes.get("/trees", treeController.trees); // QP = limit, offset, sortBy, with-count
routes.get("/trees/forests", treeController.treesWithForests); 

// one tree
routes.get("/trees/:id", treeController.treeById); 
routes.get("/trees/:id/forests-and-stock", treeController.treeWithForestsAndStock); 

// association & filtres
routes.get("/forests/:id/trees", treeController.treesByForest);
routes.get("/trees/country/:slug", treeController.treesByCountry);
routes.get("/trees/category/:slug", treeController.treesByCategory);

// post, patch et delete
routes.post("/trees", authorizationController, isGranted, treeController.addTree);
routes.patch("/trees/:id", authorizationController, isGranted, treeController.updateTree);
routes.delete("/trees/:id", authorizationController, isGranted, treeController.deleteTree);

//FORESTS

// all forests
routes.get("/forests", forestController.forests);

// one forest
routes.get("/forests/:id", forestController.forestById);
routes.get("/forests/:id/trees-and-stock", forestController.forestWithTreesAndStock);

// association
routes.get("/trees/:id/forests", forestController.forestsByTree); 

// post, patch et delete
routes.post("/forests", authorizationController, isGranted, forestController.addForest);
routes.patch("/forests/:id", authorizationController, isGranted, forestController.updateForest);
routes.delete("/forests/:id", authorizationController, isGranted, forestController.deleteForest);

//USERS

// all users
routes.get("/users", authorizationController, isGranted, userController.users);

// one user
routes.get("/users/:id", authorizationController, isGranted, userController.userById);
routes.get("/users/:id/impact" , authorizationController, isGranted, userController.impactByUserId);

// post, patch et delete
routes.post("/users", authorizationController, isGranted, userController.addUser);
// routes.patch("/users/:id/bo", /*authorizationController, isGranted,*/ userController.updateUser) //fusionner les 2 routes?
routes.patch("/users/:id", authorizationController, isGranted, userController.updateUser);
routes.delete("/users/:id", /*authorizationController,*/ userController.deleteUser);

//ORDERS

// all orders
routes.get("/orders", authorizationController, isGranted, orderController.orders);

// one order
routes.get("/orders/:id", authorizationController, orderController.orderById);
routes.get("/user/:id/orders", authorizationController, isGranted, orderController.ordersByUserId); // doublon avec celle du dessus
routes.get("/orders/:id/full", authorizationController, isGranted, orderController.orderByIdWithUser);

// post et patch
routes.post("/orders", authorizationController, isGranted, orderController.addOrder);
routes.patch("/orders/:id", authorizationController, isGranted, orderController.updateOrder);

//ORDER ITEMS

// routes.get("/items", itemController.items);
routes.get("/order/:id/items", itemController.itemsByOrderId);
routes.post("/orders/:id/items", itemController.addOrderItem); 

//SEARCH

routes.get("/search", searchController);

//PAYMENT

routes.post("/create-payment-intent", stripeController.intent);

export default routes;