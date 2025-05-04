import express from "express";

import treeController from "../controllers/treeController";
import orderController from "../controllers/orderController";
import forestController from "../controllers/forestController";
import userController from "../controllers/userController";
import authController from "../controllers/authController";
import { requireAuth } from "../middleware/requireAuth";
import upload from "../../config/multer-config";

const routes = express.Router();

// ROUTES PUBLIQUES
routes.get("/login", authController.loginView);
routes.post("/login", authController.loginPost);
routes.get("/logout", authController.logout);

// ROUTES PROTEGEES
routes.use(requireAuth);

// ACCUEIL
routes.get("/", (req, res) => {
  res.render("index");
});

// TREES
routes.get("/trees", treeController.getAllTrees);
routes.get("/trees/news", treeController.createTreeView);
routes.post("/trees/news", upload.single('image'), treeController.createTreePost);
routes.get("/trees/:id", treeController.getTree); // KO
routes.get("/trees/:id/edit", treeController.editTreeView); // KO
routes.patch("/trees/:id", upload.single('image'), treeController.updateTree);
routes.delete("/trees/:id", treeController.deleteTree);

//FORESTS
routes.get("/forests", forestController.getAllForests);
routes.get("/forests/news", forestController.createForestView);
routes.post("/forests/news", upload.single('image'), forestController.createForestPost);
routes.get("/forests/:id", forestController.getForest);
routes.get("/forests/:id/edit", forestController.editForestView);
routes.patch("/forests/:id", upload.single('image'), forestController.updateForest);
routes.delete("/forests/:id", forestController.deleteForest);

//ORDERS
routes.get("/orders", orderController.getAllOrders)
routes.get("/orders/:id", orderController.getOrder);
routes.get("/orders/:id/edit", orderController.editOrderView);
routes.patch("/orders/:id", orderController.updateOrder);

//USERS
routes.get("/users", userController.getAllUsers);
routes.get("/users/news", userController.createUserView);
routes.post("/users/news", userController.createUserPost);
routes.get("/users/:id", userController.getUser);
routes.get("/users/:id/edit", userController.editUserView);
routes.patch("/users/:id", userController.updateUser);

export default routes;
