const express = require("express");
const cors = require("cors");


const proposalRoutes = require("./routes/proposalRoutes");


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/proposal",proposalRoutes);

module.exports=app;