import routes from "./src/routes/routes.mjs";
import Router from "express";
import session from 'express-session';
import passport from 'passport';
import bodyParser from "body-parser";
import cors from "cors";
import swaggerui from "swagger-ui-express";
import YAML from "yamljs";

const swaggerFile = YAML.load('./swagger.yml');

const router = Router();

// Inizializzazione di sessione e passport
router.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
router.use(passport.initialize());
router.use(passport.session());

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }));
router.use(cors({
  origin: "*", // Permette l'accesso da qualsiasi indirizzo
}));
router.use(
  "/api-docs",
  swaggerui.serve,
  swaggerui.setup(swaggerFile)
);
router.use('/api', routes);

export default router;