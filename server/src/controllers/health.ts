import { Request, Response } from "express";
import sequelize from "../model";

export const get_health = async (_: Request, res: Response) => {
  try {
    await sequelize.authenticate();
    res.status(200).json({
      status: "OK",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({
      status: "ERROR",
      db: "disconnected",
      timestamp: new Date().toISOString(),
    });
  }
};
