import express from "express";
import authController from "../controllers/authController";
import treeController from "../controllers/treeController";
import forestController from "../controllers/forestController";
const routes = express.Router();

// AUTHENTICATION
routes.get("/login", authController.login);
routes.get("/register", authController.register);


// TREES 
routes.get("/trees", treeController.trees);
routes.get("/trees/:id", treeController.treeById);
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
// GET /users
// GET /users/:id
// PATCH /users/:id
// DELETE /users/:id
// POST /users (BACKOFFICE)


//ORDERS (
    // GET /orders
    // GET /orders/:id
    // POST /orders
    // PATCH /orders
    
export default routes;