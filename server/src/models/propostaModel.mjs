import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import { interessiEnum } from './enums.mjs';

// Definizione dello schema per le proposte di attività
const schemaProposta = new mongoose.Schema({
    // Username del creatore della proposta
    usernameCreatore: {
        type: String,
        required: true,
        ref: "Utente" // Riferimento al modello utente
    },
    // Titolo della proposta
    titolo: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 30
    },
    // Categorie dell'attività proposta
    categorie: {
        type: [String],
        enum: interessiEnum,
        required: true,
        default: "Altro"
    },
    // Nome del luogo dell'attività proposta
    nomeLuogo: {
        type: String,
        required: true
    },
    // Coordinate del luogo dell'attività proposta
    coordinate: {
        type: [Number],
        required: true
    },
    // Descrizione dell'attività proposta
    descrizione: {
        type: String,
        maxLength: 200
    },
    // Numero desiderato di partecipanti all'attività proposta
    numeroPartecipantiDesiderato: {
        type: Number,
        required: true,
        default: 5
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
                return date >= new Date();
            },
            message: _props => `Data non valida`
        }
    },
    // ID della chat associata all'attività proposta
    idChat: {
        type: ObjectId,
        ref: "Chat" // Riferimento al modello chats
    },
    // Elenco degli utenti che partecipano all'attività proposta
    partecipanti: {
        type: [String],
        default: [],
        ref: "Utente" // Riferimento al modello utente
    },
    // Stato dell'attività proposta
    stato: {
        type: Boolean,
        default: true
    },
    // Stato della proposta, se è terminata e sono state inviate notifiche ai partecipanti
    // invitandoli a valutare gli altri partecipanti
    valutabile: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});



// Creazione del modello Proposta
const Proposta = mongoose.model("Proposta", schemaProposta, "Proposte");
export default Proposta;