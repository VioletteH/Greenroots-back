import express from "express";

import treeController from "../controllers/treeController";
import orderController from "../controllers/orderController";
import forestController from "../controllers/forestController";

const routes = express.Router();

// TREES
routes.get("/trees", treeController.getAllTrees);
routes.get("/trees/news", treeController.createTreeView);
routes.post("/trees/news", treeController.createTreePost);
routes.get("/trees/:id", treeController.getTree);
routes.get("/trees/:id/edit", treeController.editTreeView);
routes.patch("/trees/:id", treeController.updateTree);
routes.delete("/trees/:id", treeController.deleteTree);

//FORESTS
routes.get("/forests", forestController.getAllForests);
routes.get("/forests/news", forestController.createForestView);
routes.post("/forests/news", forestController.createForestPost);
routes.get("/forests/:id", forestController.getForest);
routes.get("/forests/:id/edit", forestController.editForestView);
routes.patch("/forests/:id", forestController.updateForest);
routes.delete("/forests/:id", forestController.deleteForest);

//USERS

//ORDERS
routes.get("/orders", orderController.getAllOrders)
routes.get("/orders/:id", orderController.getOrder);
routes.get("/orders/:id/edit", orderController.editOrderView);
routes.patch("/orders/:id", orderController.updateOrder);

routes.get("/", (req, res) => {
  res.render("index");
});

export default routes;

