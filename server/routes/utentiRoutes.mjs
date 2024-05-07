import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

// Permette la registrazione di un utente
router.post("/signup",utentiSignup);

// Permette il login di un utente
router.post("/signup",utentiLogin);



// Get a single post
router.get("/:id", async (req, res) => {
  let collection = await db.collection("posts");
  let query = {_id: ObjectId(req.params.id)};
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// Aggiungi un nuovo utente alla collection utenti
router.post("/", async (req, res) => {
  let collection = await db.collection("Utenti");
  let newDocument = req.body;
  newDocument.date = new Date();
  let result = await collection.insertOne(newDocument);
  res.send(result).status(204);
});

// Update the post with a new comment
router.patch("/comment/:id", async (req, res) => {
  const query = { _id: ObjectId(req.params.id) };
  const updates = {
    $push: { comments: req.body }
  };

  let collection = await db.collection("posts");
  let result = await collection.updateOne(query, updates);

  res.send(result).status(200);
});

export default router;
