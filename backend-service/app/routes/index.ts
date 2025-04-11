import express from "express";
import authController from "../controllers/authController";
import treeController from "../controllers/treeController";
import forestController from "../controllers/forestController";
const routes = express.Router();

// AUTHENTICATION
routes.get("/login", authController.login);
routes.get("/register", authController.register);

export default routes;

// TREES 
    routes.get("/trees/:id/forests", treeController.trees);
    routes.get("/trees/:id", treeController.treesById);
    routes.post("/trees", treeController.addTree);
    routes.patch("/trees/:id", treeController.updateTree);
    routes.delete("/trees/:id", treeController.deleteTree);
    // routes.get("/login", treeController.treesById);
//FORESTS
    routes.get("/forests", forestController.forests);
    routes.get("/forests/:id", forestController.forestById);
    routes.post("/forests", forestController.addTree);
    routes.patch("/forests/:id", forestController.updateTree);
    routes.delete("/forests/:id", forestController.deleteTree);
    // GET /forests
    // GET /forests/:id/trees
    // POST /forests
    // PATCH /forests/:id
    // DELETE /forests/:id

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
