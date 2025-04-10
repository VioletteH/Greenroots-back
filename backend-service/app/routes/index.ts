import express from "express";
import authController from "../controllers/authController";

const routes = express.Router();
routes.get("/login", authController.login);
routes.get("/register", authController.register);

export default routes;