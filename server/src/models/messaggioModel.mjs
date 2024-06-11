import mongoose from "mongoose";
import { ObjectId } from "mongodb";

const schemaMessaggio = new mongoose.Schema({
	// Contenuto del messaggio
	contenuto: {
		type: String,
		required: true,
		minLenght: 1
	},
	// Username dell'untente che manda il messaggio
	senderUsername: {
		type: String,
		required: true,
		ref: "Utente" // Riferimento al modello utente
	},
	// Id della chat che contiene il messaggio
	idChat: {
		type: ObjectId,
		required: true,
		ref: "Chat"
	},
	// Data e ora dell'invio del messaggio
	data: {
		type: String,
		required: true
	},
},
{
	timestamps: true
});

// Creazione del modello Messaggio
const Messaggio = mongoose.model("Messaggi", schemaMessaggio, "Messaggi");
export default Messaggio;