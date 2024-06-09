import mongoose from "mongoose";

// Definizione dello schema per il token usato per recuperare la password
const schemaToken = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    ref: "Utente" // Riferimento al modello utente
  },
  token: {
    type: String,
    required: true,
    lenght: 20
  },
  expirationDate: {
    type: Date,
    default: function () {
      // Imposto la data di scadenza a 24 ore dopo la creazione del token.
      return Date.now() + (24 * 60 * 60 * 1000);
    }
  }
}, {
  timestamps: true
});

// Creazione del modello Token
const Token = mongoose.model("Token", schemaToken, "Token");

export default Token;