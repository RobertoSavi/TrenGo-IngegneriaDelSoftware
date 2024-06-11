import Proposta from "../models/propostaModel.mjs";
import Notifica from "../models/notificaModel.mjs";
import { tipoNotificaEnum } from "../models/enums.mjs";
import { getProposteTerminate } from "./dbQueries.mjs";
import dotenv from 'dotenv';

dotenv.config();
// const URL_FRONTEND = process.env.URL_FRONTEND;
const HOST_PROPOSTE = 'proposte/';


// Funzione che cerca le proposte terminate da almeno un giorno e per la quale non sono ancora stati notificati i partecipanti,
// Invia una notifica a tutti i partecipanti e al creatore della proposta per informarli che la proposta è 
// terminata e che possono valutare i partecipanti, inoltre setta valutabile a true in modo che non venga inviata più di una notifica
async function notificaProposteTerminate(){
    try {
      console.log('Controllo proposte terminate e non notificate...');
      const proposteTerminate = await getProposteTerminate();
      proposteTerminate.forEach(async proposta => {
        const partecipanti = proposta.partecipanti.concat(proposta.usernameCreatore);
        const propostaUrl = `${HOST_PROPOSTE}${proposta._id}`;
        console.log(`Invio notifica per la proposta ${proposta.titolo} ai partecipanti: ${partecipanti}`);
        for (const partecipante of partecipanti) {
          await Notifica.create({
            sorgente: 'System',
            username: partecipante,
            messaggio: `E' passato un giorno dalla fine della proposta ${proposta.titolo} ora puoi valutare i partecipanti.`,
            link: propostaUrl,
            tipo: tipoNotificaEnum.PROPOSTA
          });
        }
        await Proposta.findByIdAndUpdate(proposta._id, { valutabile: true });
      });
    } catch (error) {
      console.error('Errore nel controllo delle proposte:', error);
    }
}

export {
    notificaProposteTerminate
}