import Proposta from "../models/propostaModel.mjs"; // Adjust the path if necessary

/**
 * Recupera le proposte terminate da un giorno e non valutabili.
 * @returns {Promise<Array>} Un array di proposte.
 */
async function getProposteTerminate() {
    try {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const proposte = await Proposta.find({
        data: { $lte: oneDayAgo },
        valutabile: false
      });
      if(proposte.length === 0)
        return [];
      return proposte;
    } catch (error) {
      console.error('Errore nel recupero delle proposte:', error);
      throw error; // Rilancia l'errore per gestirlo nella funzione chiamante
    }
};

export {
    getProposteTerminate
};