import express from "express";

import treeController from "../controllers/treeController";
import forestController from "../controllers/forestController";
import userController from "../controllers/userController";
const routes = express.Router();

// TREES
routes.get("/trees", treeController.trees)
// routes.patch("/trees/:id", treeController.updateTree)
// routes.delete("/trees/:id", treeController.deleteTree)
// routes.post("/trees", treeController.addTree)

//FORESTS
routes.get("/forests", forestController.getAllForests);
routes.get("/forests/news", forestController.createForestView);
routes.post("/forests/news", forestController.createForestPost);
routes.get("/forests/:id", forestController.getForest);
routes.get("/forests/:id/edit", forestController.editForestView);
routes.patch("/forests/:id", forestController.updateForest);
routes.delete("/forests/:id", forestController.deleteForest);

routes.get("/", (req, res) => {
  res.render("index");
});

//USERS
routes.get("/users", userController.getAllUsers);
routes.get("/users/news", userController.createUserView);
routes.post("/users/news", userController.createUserPost);
routes.get("/users/:id", userController.getUser);
routes.get("/users/:id/edit", userController.editUserView);
routes.patch("/users/:id", userController.updateUser);
routes.delete("/users/:id", userController.deleteUser);

//ORDERS

export default routes;