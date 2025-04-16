import express from "express";

import treeController from "../controllers/treeController";
//import orderController from "../controllers/orderController";
import forestController from "../controllers/forestController";

const routes = express.Router();

// TREES
routes.get("/trees", treeController.getAllTrees);
routes.get("/trees/news", treeController.createTreeView);
// routes.post("/trees/news", treeController.createTreePost);
routes.get("/trees/:id", treeController.getTree);
// routes.get("/trees/:id/edit", treeController.editTreeView);
// routes.patch("/trees/:id", treeController.updateTree);
routes.delete("/trees/:id", treeController.deleteTree);

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

//ORDERS
//routes.get("orders", orderController.order)
//routes.patch("/orders/", orderController.updateOrder);
export default routes;

