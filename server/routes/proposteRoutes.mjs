import express from "express";
import db from "../db/connection.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

// Ottieni ogni proposta nel database
router.get("/", async (req, res) => {
  let collection = await db.collection("Proposte");
  let results = await collection.find({})
    .limit(50)
    .toArray();
  res.send(results).status(200);
});

export default router;