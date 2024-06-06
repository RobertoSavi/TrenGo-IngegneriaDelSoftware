import Proposta from "../models/propostaModel.mjs";
import Notifica from "../models/notificaModel.mjs";
import { tipoNotificaEnum } from "../models/enums.mjs";
import { getProposteTerminate } from "./dbQueries.mjs";
import dotenv from 'dotenv';

dotenv.config();
// const URL_FRONTEND = process.env.URL_FRONTEND;
const HOST_PROPOSTE = 'proposte/';

async function notificaProposteTerminate(){
    try {
      console.log('eseguendo cron');
      const proposteTerminate = await getProposteTerminate();
      proposteTerminate.forEach(async proposta => {
        const partecipanti = proposta.partecipanti.concat(proposta.usernameCreatore);
        const propostaUrl = `${HOST_PROPOSTA}${proposta._id}`;
        console.log(propostaUrl);
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