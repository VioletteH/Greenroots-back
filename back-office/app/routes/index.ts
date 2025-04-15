import express from "express";

import treeController from "../controllers/treeController";
//import forestController from "../controllers/forestController";
const routes = express.Router();

// TREES
routes.get("/tree", treeController.tree)
routes.patch("/tree/:id", treeController.updateTree)
// routes.delete("/trees/:id", treeController.deleteTree)
// routes.post("/trees", treeController.addTree)

// //FORESTS
// routes.get("/forests", forestController.forests);
// routes.get("/forests/:id", forestController.forestById);
// routes.post("/forests", forestController.addForest);
// routes.patch("/forests/:id", forestController.updateForest);
// routes.delete("/forests/:id", forestController.deleteForest);

//USERS

//ORDERS

export default routes;