import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import { interessiEnum } from './enums';

// Definizione dello schema per le proposte di attività
const schemaProposta = new mongoose.Schema({
    // ID dell'utente creatore della proposta
    creatore: {
        type: ObjectId,
        required: true,
        ref: "Utente" // Riferimento al modello utente
    },
    // Categorie dell'attività proposta
    categorie: {
        type: [String],
        enum: interessiEnum,
        default: "Altro"
    },
    // Nome del luogo dell'attività proposta
    nomeLuogo: {
        type: String,
    },
    // Coordinate del luogo dell'attività proposta
    coordinate: {
        type: [Number],
        required: true
    },
    // Descrizione dell'attività proposta
    descrizione: {
        type: String,
        required: true,
        minLength: 5
    },
    // Numero desiderato di partecipanti all'attività proposta
    numeroPartecipantiDesiderato: {
        type: Number,
        required: true,
        default: 10
    },
    // Numero effettivo di partecipanti all'attività proposta
    numeroPartecipanti: {
        type: Number,
        default: 0
    },
    // Data e ora dell'attività proposta
    data: {
        type: Date,
        required: true,
        validate: {
            validator: function (date) {
                return date <= new Date();
            },
            message: _props => `Data non valida`
        }
    },
    // ID della chat associata all'attività proposta
    idChat: {
        type: ObjectId,
        required: true,
        ref: "Chats" // Riferimento al modello chats
    },
    // Elenco degli utenti che partecipano all'attività proposta
    partecipanti: {
        type: [ObjectId],
        default: [],
        ref: "Utente" // Riferimento al modello utente
    },
    // Stato dell'attività proposta
    stato: {
        type: Boolean
    }
});

// Creazione del modello Proposta
const Proposta = mongoose.model("Proposta", schemaProposta, "Proposte");
export default Proposta;