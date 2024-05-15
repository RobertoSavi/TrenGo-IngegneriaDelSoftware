import connectToMongoDB  from "./db/connection.mjs"; 
import utentiRouter from "./routes/utentiRoutes.mjs";
import proposteRouter from "./routes/proposteRoutes.mjs";
import richiesteRouter from "./routes/richiesteRoutes.mjs";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import swaggerui from "swagger-ui-express";
import YAML from "yamljs";
import dotenv from "dotenv";

dotenv.config();

const swaggerFile = YAML.load('./swagger.yml');

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true}));
app.use(cors({
  origin: "*", // Permette l'accesso da qualsiasi indirizzo
}))
app.use(
  "/api-docs", 
  swaggerui.serve, 
  swaggerui.setup(swaggerFile)
);

// Connessione al database MongoDB
connectToMongoDB()
  .then(() => {
    // Utilizza le route
    app.use("/utenti", utentiRouter); // Route per gli utenti
    app.use("/proposte", proposteRouter); // Route per le proposte
    app.use("/proposte", richiesteRouter); // Route per le proposte

    // Gestione status 404
    app.use((req, res) => {
      res.status(404);
      res.json({error: "Not found"});
    });
    
    // Gestione status 500
    app.use((req, res) => {
      res.status(500);
      res.json({error: "Internal Server Error"});
    });
    

    // Avvia il server
    const server = app.listen(process.env.PORT, () => {
      console.log(`Il server è in esecuzione sulla porta: ${process.env.PORT}`);
    });

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
