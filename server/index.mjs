import connectToMongoDB from "./src/db/connection.mjs";
import app from "./app.mjs";
import { notificaProposteTerminate } from "./src/utils/cronSchedules.mjs";
import mongoose from "mongoose";
import cron from "node-cron";
import dotenv from "dotenv";
dotenv.config();

// Connessione al database MongoDB
connectToMongoDB()
  .then(() => {
    
    // Avvia il server
    const server = app.listen(process.env.PORT, () => {
      console.log(`Il server è in esecuzione sulla porta: ${process.env.PORT}`);
    });

    // Pianifica il cron job
    //cron.schedule('0 * * * *', notificaProposteTerminate); // Ogni ora
    cron.schedule('*/10 * * * * *', notificaProposteTerminate); // Ogni minuto

    // Chiudi la connessione a MongoDB quando il processo viene arrestato
    process.on('SIGINT', async () => {
      try {
        await mongoose.disconnect();
        console.log('Connessione a MongoDB chiusa');
      } catch (error) {
        console.error('Errore durante la chiusura della connessione a MongoDB:', error);
      } finally {
        server.close(() => {
          console.log('Server fermato');
          process.exit(0);
        });
      }
    });
  })
  .catch((error) => {
    console.error('Errore durante la connessione a MongoDB:', error);
    process.exit(1); // Esce dal processo con un codice di errore
  });
