import mongoose from "mongoose";
import { ObjectId } from "mongodb";

const schemaChat = new mongoose.Schema({
	// L'username del creatore della notifica, può essere un utente o il sistema
	tipoChat: {
		type: String,
		enum: ["chat", "forum"],
		required: true,
		dafault: "chat"
	},
	// Elenco degli utenti che partecipano alla chat
	partecipanti: {
		type: [String],
		default: [],
		required: true,
		ref: "Utente" // Riferimento al modello utente
	},
	// Elenco degli Id dei messaggi
	messaggi: {
		type: [ObjectId],
		default: [],
		ref: "Messaggio" // Riferimento al modello messaggio
	},
	// Id della proposta a cui è collegata la chat
	idProposta: {
		type: ObjectId,
		required: true,
		ref: "Proposta" // Riferimento al modello Proposta
	}
}, 
{
	timestamps: true
});

// Creazione del modello Chat
const Chat = mongoose.model("Chats", schemaChat, "Chats");
export default Chat;