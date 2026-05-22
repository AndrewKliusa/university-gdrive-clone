import { Router } from "express";

export const photoRoutes = Router();

photoRoutes.get("/", (req, res) => {
  res.send("All photos");
});

photoRoutes.post("/", (req, res) => {
  res.send("Create photo");
});