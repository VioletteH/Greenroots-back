import { Request, Response, NextFunction } from "express";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const userCookie = req.cookies?.user;

  if (!userCookie) {
    return res.redirect("/login");
  }

  try {
    const user = JSON.parse(userCookie);
    if (!user) return res.redirect("/login");

    res.locals.currentUser = user;
    next();
  } catch (error) {
    return res.redirect("/login");
  }
};
