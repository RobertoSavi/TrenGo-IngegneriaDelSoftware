import mongoose from "mongoose";
import  {ObjectId}  from "mongodb";

// Definizione dello schema per le richieste di partecipazione alle proposte di attività
const schemaRichiesta = new mongoose.Schema({
    // ID dell'utente richiedente alla proposta
    idRichiedente: {
        type: ObjectId,
        required: true,
        ref: "Utente" // Riferimento al modello utente
    },
    // Username del richiedente alla proposta
    usernameRichiedente: {
        type: String,
        required: true
    },
    // Id della proposta al quale si richiede la partecipazione
    idProposta: {
        type: ObjectId,
        required: true,
        ref: "Proposta" // Riferimento al modello proposta
    },
    // Titolo della proposta al quale si richiede la partecipazione
    titoloProposta: {
        type: String,
        required: true
    },
    stato: {
        type: [String],
        enum: ["pending", "accettata", "rifiutata"], // Possibili stati per la richiesta
        default: "pending"
    }
});

// Creazione del modello Proposta
const Richiesta = mongoose.model("Richiesta", schemaRichiesta, "Richieste");
export {
    Richiesta,
    schemaRichiesta
};