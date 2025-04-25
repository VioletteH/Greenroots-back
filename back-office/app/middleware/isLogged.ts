import { Request, Response, NextFunction } from "express";

export function isLogged(req: Request, res: Response, next: NextFunction) {
  const userCookie = req.cookies?.userbo;

  if (userCookie) {
    try {
      const user = JSON.parse(userCookie);
      res.locals.currentUser = user;
      return next();
    } catch (e) {
      // Cookie corrompu
      res.locals.currentUser = null;
    }
  }

  // Pas connecté
  res.locals.currentUser = null;
  return next();
};
