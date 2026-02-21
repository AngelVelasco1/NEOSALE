import { NextFunction, Request, Response } from "express";
import { searchService } from "../services/search.js";

export const search = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = req.query.q as string;
    const limit = req.query.limit ? Number(req.query.limit) : 5;
    const results = await searchService({ query, limit });
    res.status(200).json({
      success: true,
      results,
    });
  } catch (error) {
    next(error);
  }
};
