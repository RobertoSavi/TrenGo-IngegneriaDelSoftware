import mongoose from "mongoose";

// Definizione dello schema per le valutazioni
const schemaValutazione = new mongoose.Schema({
    // ID della proposta a cui è associata la valutazione
    idProposta: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Proposta" // Riferimento al modello Proposta
    },
    // Username dell'utente valutato
    usernameValutato: {
        type: String,
        required: true,
        ref: "Utente" // Riferimento al modello utente
    },
    // Username dell'utente che ha effettuato la valutazione
    usernameValutatore: {
        type: String,
        required: true,
        ref: "Utente" // Riferimento al modello utente
    },
    // Valutazione dell'utente valutato (upvote/downvote)
    valutazione: {
        type: Number,
        required: true,
        enum: [1, -1] // +1 for upvote, -1 for downvote
    },
});

// Creare un indice unico combinato per garantire che ogni utente possa valutare un altro utente solo una volta per attività
schemaValutazione.index({ idProposta: 1, usernameValutato: 1, usernameValutatore: 1 }, { unique: true });

const Valutazione = mongoose.model('Valutazione', schemaValutazione, 'Valutazioni');

export default Valutazione;