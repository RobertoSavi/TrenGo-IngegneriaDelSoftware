import Proposta from "../models/propostaModel.mjs";
import Notifica from "../models/notificaModel.mjs";
import { getProposteTerminate } from "./dbQueries.mjs";

async function notificaProposteTerminate(){
    try {
      const proposteTerminate = await getProposteTerminate();
      proposteTerminate.forEach(async proposta => {
        const partecipanti = proposta.partecipanti.concat(proposta.usernameCreatore);
        for (const partecipante of partecipanti) {
          await Notifica.create({
            sorgente: 'System',
            username: partecipante,
            messaggio: `E' passato un giorno dalla fine della proposta ${proposta.titolo} ora puoi valutare i partecipanti.`
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