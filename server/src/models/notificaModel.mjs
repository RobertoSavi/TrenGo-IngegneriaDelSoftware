import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import { statoNotificaEnum, tipoNotificaEnum } from './enums.mjs';
import Utente from "./utenteModel.mjs";

const schemaNotifica = new mongoose.Schema({
    // L'username del creatore della notifica, può essere un utente o il sistema
    sorgente: {
        type: String,
        required: true,
        validate: {
            validator: async function (v) {
                if (v === 'System') return true;
                const user = await Utente.findOne({ username: v });
                return user != null;
            },
            message: props => `${props.value} is not a valid username or "System"!`
        }
    },
    username: {
        type: String,
        required: true,
        validate: {
            validator: async function (v) {
                const user = await Utente.findOne({ username: v });
                return user != null;
            },
            message: props => `${props.value} is not a valid username!`
        }
    },
    messaggio: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 500
    },
    // Link associato alla notifica, per accedere alla proposta o alla chat
    link: {
        type: String,
        required: false
    },
    stato: {
        type: String,
        enum: Object.values(statoNotificaEnum),
        default: statoNotificaEnum.NOT_SEEN
    },
    tipo: {
        type: String,
        enum: Object.values(tipoNotificaEnum),
        required: true
    }
}, {
    timestamps: true
});

// Creazione del modello Notifica
const Notifica = mongoose.model("Notifica", schemaNotifica, "Notifiche");
export default Notifica;


