import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import "./loadEnvironment.mjs";
import "express-async-errors";
import utenteRouter from "./routes/utentiRoutes.mjs";
import proposta from "./routes/proposteRoutes.mjs";
import swaggerui from "swagger-ui-express";
import YAML from "yamljs";
import connectToMongoDB  from "./db/connection.mjs"; 

const swaggerFile = YAML.load('./swagger.yml');


const PORT = process.env.PORT || 5050;
const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  "/api-docs", 
  swaggerui.serve, 
  swaggerui.setup(swaggerFile)
);
connectToMongoDB()
  .then(() => {
    // Use routes
    app.use("/utenti", utenteRouter);
    app.use("/proposte", proposta);
    app.use((err, _req, res, next) => {
      res.status(500).send("Uh oh! An unexpected error occured.")
    })
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
    //close MongoDB connection on process exit
    process.on('SIGINT', async () => {
      try {
        await mongoose.disconnect();
        console.log('MongoDB connection closed');
      } catch (error) {
        console.error('Error closing MongoDB connection:', error);
      } finally {
        server.close(() => {
          console.log('Server stopped');
          process.exit(0);
        });
      }
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit the process with an error code
  });
/*
app.use("/utenti", utenteRouter);
app.use("/proposte", proposta);
*/
// Global error handling
/*
app.use((err, _req, res, next) => {
  res.status(500).send("Uh oh! An unexpected error occured.")
})*/



// start the Express server
/*app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});*/
