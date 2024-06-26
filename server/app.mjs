import routes from "./src/routes/routes.mjs";
import Router from "express";
import session from 'express-session';
import passport from 'passport';
import bodyParser from "body-parser";
import cors from "cors";
import swaggerui from "swagger-ui-express";
import YAML from "yamljs";

const swaggerFile = YAML.load('./swagger.yaml');
const swaggerFilev2 = YAML.load('./swaggerv2.yaml');

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
router.use(
  "/apiv2-docs",
  swaggerui.serve,
  swaggerui.setup(swaggerFilev2)
);
router.use('/apiv2', routes);

export default router;