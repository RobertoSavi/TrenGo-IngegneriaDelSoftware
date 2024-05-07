import mongoose  from "mongoose";
//import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";

const schemaProposta=new mongoose.Schema(
{
	creatore: 
	{
		type: ObjectId,
        required: true,
        ref: "utente"
    },
    categorie:
    {
		type: [String],
		enum: interessiEnum,
		default: "Other"
	},
    nomeLuogo: 
    {
        type: String,
    },
    coordinate: 
    {
        type: [Float],
        required: true
    },
    descrizione: 
    {
        type: String,
        required: true,
        minLength: 5
    },
    numeroPartecipantiDesiderato: 
    {
		type: Integer,
		required: true,
		default: 10
    },
    numeroPartecipanti: 
    {
		type: Integer,
		default: 0
    },
    data: 
    {
        type: Data,
		required: true,
		validate:
		{
			validator: function (date) 
			{
				return date<=new Date();
            },
            message: props => `data non valida`
        }
    },
    idChat: 
    {
        type: ObjectId,
        required: true,
        ref: "chats"
    },
    partecipanti: 
    {
        type: [ObjectID],
        default: [],
        ref: "utente"
    },
    stato:
    {
		type: Boolean
	}
});

const proposta=mongoose.model("Proposta", schemaProposta);
module.exports=Proposta;