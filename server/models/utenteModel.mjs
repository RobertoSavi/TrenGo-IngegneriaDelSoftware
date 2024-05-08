import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { interessiEnum } from './enums';
import { ObjectId } from "mongodb";

// Definizione dello schema per l'utente
const schemaUtente = new mongoose.Schema({
    // Nome utente dell'utente
    username: {
        type: String,
        required: true,
        unique: true,
        minLength: 2,
        maxLength: 30
    },
    // Tipo di utente: nonAutenticato, autenticato o grandeOrganizzatore
    tipoUtente: {
        type: String,
        enum: ["nonAutenticato", "autenticato", "grandeOrganizzatore"],
        default: "nonAutenticato"
    },
    // Nome dell'utente
    nome: {
        type: String,
        minLength: 2,
        maxLength: 30
    },
    // Cognome dell'utente
    cognome: {
        type: String,
        minLength: 2,
        maxLength: 30
    },
    // Email dell'utente
    email: {
        type: String,
        required: true,
        unique: true,
        minLength: 5,
        maxLength: 50,
        // Validazione dell'email tramite espressione regolare
        validate: {
            validator: function (v) {
                return /\S+@\S+\.\S+/.test(v);
            },
            message: props => `${props.value} email non valida`
        }
    },
    // Password dell'utente
    password: {
        type: String,
        required: true,
        // Validazione della password tramite espressione regolare
        validate: {
            validator: function (v) {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@!%-_.*?&])[A-Za-z\d$@!%-_.*?&]{8,}$/.test(v);
            },
            message: props => `${props.value}: password non valida`
        }
    },
    // Karma dell'utente
    karma: {
        type: Number,
        default: 0
    },
    // Interessi dell'utente
    interessi: {
        type: String,
        enum: interessiEnum,
        default: "Altro"
    },
    // Elenco degli utenti seguiti dall'utente
    followed: {
        type: [ObjectId],
        default: [],
        ref: "Utente" // Riferimento al modello utente
    }
});

// Hook pre-save per hashare la password prima del salvataggio
schemaUtente.pre('save', async function (next) {
    // Hashare la password solo se è nuova o modificata
    if (!this.isModified('password')) {
        return next();
    }

    try {
        // Generare un salt con un costo di 10
        const salt = await bcrypt.genSalt(10);

        // Hashare la password usando il salt generato
        const hashedPassword = await bcrypt.hash(this.password, salt);

        // Sostituire la password in chiaro con quella hashata
        this.password = hashedPassword;

        // Chiamare next per continuare il salvataggio dell'utente
        next();
    }
    catch (error) {
        next(error);
    }
});

// Metodo per confrontare la password fornita con quella hashata memorizzata
schemaUtente.methods.isPasswordCorrect = async function (password) {
    try {
        // Usare bcrypt per confrontare la password fornita con quella hashata memorizzata nel database
        return await bcrypt.compare(password, this.password);
    }
    catch (error) {
        throw new Error(error);
    }
};

// Creazione del modello Utente
const Utente = mongoose.model("Utente", schemaUtente);
export default Utente;