const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { interessiEnum } = require('./enums.js');
const { ObjectId } = require("mongodb");


const schemaUtente=new mongoose.Schema(
{
    username: 
    {
        type: String,
        required: true,
        unique: true,
        minLength: 2,
        maxLength: 30
    },
    tipoUtene:
    {
		type: String,
		enum: [nonAutenticato, autenticato, grandeOrganizzatore],
		default: "nonAutenticato"
	},
    nome: 
    {
        type: String,
        minLength: 2,
        maxLength: 30
    },
    cognome: 
    {
        type: String,
        minLength: 2,
        maxLength: 30
    },
    email: 
    {
        type: String,
        required: true,
        unique: true,
        minLength: 5,
        maxLength: 50,
        validate: 
        {
			validator: function (v) 
			{
                return /\S+@\S+\.\S+/.test(v);
           	},
            message: props => `${props.value} email non valida`
        }
    },
    password: 
    {
        type: String,
        required: true,
        validate: 
        {
            validator: function (v)
            {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@!%-_.*?&])[A-Za-z\d$@!%-_.*?&]{8,}$/.test(v);
            },
            message: props => `${props.value}: invalid password`
        }
    },
    karma: 
    {
        type: Integer,
		default: 0
    },
    interessi: 
    {
        type: String,
        enum: interessiEnum,
        default: "Other"
    },
    followers: 
    {
        type: [ObjectId],
        default: [],
        ref: "utente"
    }
});

// Pre-save hook to hash the password before saving
schemaUtente.pre('save', async function (next) 
{
    // Only hash the password if it's new or modified
    if (!this.isModified('password'))
    {
        return next();
    }

    try 
    {
        // Generate a salt with a cost factor of 10
        const salt=await bcrypt.genSalt(10);

        // Hash the password using the generated salt
        const hashedPassword=await bcrypt.hash(this.password, salt);

        // Replace the plain-text password with the hashed password
        this.password = hashedPassword;

        // Call next to continue saving the user
        next();
    }
    catch (error) 
    {
        next(error);
    }
});

// Method to compare provided password with stored hashed password
schemaUtente.methods.isValidPassword = async function (password) 
{
	try 
	{
		// Use bcrypt to compare the provided password with the hashed password stored in the database
		return await bcrypt.compare(password, this.password);
	}
	catch (error) 
	{
		throw new Error(error);
	}
};

// Create your UserModel
const utente=mongoose.model("utente", schemaUtente);
module.exports=utente;