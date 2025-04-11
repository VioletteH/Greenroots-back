import express from "express";

import treeController from "../controllers/treeController";
const routes = express.Router();

// TREES
routes.get("/trees", treeController.trees)

//FORESTS

//USERS

//ORDERS

export default routes;