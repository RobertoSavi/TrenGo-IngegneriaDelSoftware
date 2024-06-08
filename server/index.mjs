import connectToMongoDB from "./db/connection.mjs";
import utentiRouter from "./routes/utentiRoutes.mjs";
import proposteRouter from "./routes/proposteRoutes.mjs";
import richiesteRouter from "./routes/richiesteRoutes.mjs";
import notificheRouter from "./routes/notificheRoutes.mjs";
import followRouter from "./routes/followRoutes.mjs";
import valutazioniRouter from "./routes/valutazioniRoutes.mjs";
import { notificaProposteTerminate } from "./utils/cronSchedules.mjs";
import session from 'express-session';
import passport from 'passport';
import googleAuthRouter from "./routes/googleAuthRoutes.mjs";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import swaggerui from "swagger-ui-express";
import YAML from "yamljs";
import cron from "node-cron";

import dotenv from "dotenv";

dotenv.config();

const swaggerFile = YAML.load('./swagger.yml');

const app = express();

// Inizializzazione di sessione e passport
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
/*app.use(cors({
  origin: "*", // Permette l'accesso da qualsiasi indirizzo
}));*/
app.use(cors({
  origin: 'http://localhost:3000', // Specify the origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Allow cookies and other credentials
}));
app.use(
  "/api-docs",
  swaggerui.serve,
  swaggerui.setup(swaggerFile)
);

// Connessione al database MongoDB
connectToMongoDB()
  .then(() => {
    // Utilizza le route
    app.use("/api/utenti", utentiRouter); // Route per gli utenti
    app.use("/api/proposte", proposteRouter); // Route per le proposte
    app.use("/api/proposte", richiesteRouter); // Route per le richieste
    app.use("/api/notifiche", notificheRouter); // Route per le notifiche
    app.use("/api/segui", followRouter); // Route per i follow
    app.use("/api/valutazioni", valutazioniRouter); // Route per le valutazioni
    app.use("/api/utenti/auth/google", googleAuthRouter); // Route per l'autenticazione con google

    // Gestione status 404
    app.use((req, res) => {
      res.status(404);
      res.json({ error: "Not found" });
    });

    // Gestione status 500
    app.use((req, res) => {
      res.status(500);
      res.json({ error: "Internal Server Error" });
    });


    // Avvia il server
    const server = app.listen(process.env.PORT, () => {
      console.log(`Il server è in esecuzione sulla porta: ${process.env.PORT}`);
    });

    // Pianifica i cron job
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
