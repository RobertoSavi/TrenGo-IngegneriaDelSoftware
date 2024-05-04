import express from "express";
import cors from "cors";
import "./loadEnvironment.mjs";
import "express-async-errors";
import utente from "./routes/utente.mjs";
import proposta from "./routes/proposta.mjs";
import swaggerjsdoc from "swagger-jsdoc";
import swaggerui from "swagger-ui-express";
import YAML from "yamljs";
const swaggerFile = YAML.load('./swagger.yml');


const PORT = process.env.PORT || 5050;
const app = express();
app.use(
  "/api-docs", 
  swaggerui.serve, 
  swaggerui.setup(swaggerFile)
);


app.use(cors());
app.use(express.json());

// Defininig routes
app.use("/utente", utente);
app.use("/proposta", proposta);

// Global error handling
app.use((err, _req, res, next) => {
  res.status(500).send("Uh oh! An unexpected error occured.")
})

// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
