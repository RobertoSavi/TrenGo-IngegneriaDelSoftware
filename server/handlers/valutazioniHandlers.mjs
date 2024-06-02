import Utente from "../models/utenteModel.mjs";
import Proposta from "../models/propostaModel.mjs";

/**
 * Permette all'utente loggato di valutare tutti i partecipanti ad una proposta.
 * @param {object} req - L'oggetto della richiesta.
 * @param {object} res - L'oggetto della risposta.
 */
async function valutaPartecipantiByIdProposta(req,res){
    try{
        const idProposta = req.params.idProposta;
        const proposta = await Proposta.findById(idProposta);
        const loggedUsername = req.utenteLoggato.loggedUsername; // Username dell'utente loggato

        if(!proposta){
            return res.status(404).json({message: "Proposta non trovata"});
        }

        if(loggedUsername!=proposta.usernameCreatore.toString()){
            return res.status(403).json({message: "Non sei autorizzato a valutare i partecipanti di questa proposta"});
        }

        const partecipanti = proposta.partecipanti;

        for(let i=0; i<partecipanti.length; i++){
            const utente = await Utente.findOne({username: partecipanti[i].username});
            utente.valutazioni.push({
                idProposta: idProposta,
                voto: partecipanti[i].voto
            });
            await utente.save();
        }

        return res.status(200).json({message: "Valutazioni effettuate con successo"});
    } catch(error){
        return res.status(500).json({message: "Errore durante la valutazione dei partecipanti", error: error.message});
    }
}

/**
 * Permette all'utente loggato di valutare tutti un partecipante ad una proposta tramite username.
 * @param {object} req - L'oggetto della richiesta.
 * @param {object} res - L'oggetto della risposta.
 */
async function valutaPartecipanteByUsername(req,res){
    try{
        const idProposta = req.params.idProposta;
        const proposta = await Proposta.findById(idProposta);
        const loggedUsername = req.utenteLoggato.loggedUsername; // Username dell'utente loggato

        if(!proposta){
            return res.status(404).json({message: "Proposta non trovata"});
        }

        if(loggedUsername!=proposta.usernameCreatore.toString()){
            return res.status(403).json({message: "Non sei autorizzato a valutare i partecipanti di questa proposta"});
        }

        const partecipanti = proposta.partecipanti;

        for(let i=0; i<partecipanti.length; i++){
            const utente = await Utente.findOne({username: partecipanti[i].username});
            utente.valutazioni.push({
                idProposta: idProposta,
                voto: partecipanti[i].voto
            });
            await utente.save();
        }

        return res.status(200).json({message: "Valutazioni effettuate con successo"});
    } catch(error){
        return res.status(500).json({message: "Errore durante la valutazione dei partecipanti", error: error.message});
    }
}

export{
    valutaPartecipantiByIdProposta,
    valutaPartecipanteByUsername
}