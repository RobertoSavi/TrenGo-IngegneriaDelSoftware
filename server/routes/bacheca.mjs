import express from "express";
import db from "../db/conn.mjs";

const app=express();
const router = express.Router();

app.use(express.json());

// Ottieni ogni proposta nel database
router.get("/ricerca", async (req, res) =>
{
	let collection=db.collection("Proposte");
	let results=await collection.find({}).limit(50).toArray();
	res.send(results).status(200);
});

export default router;