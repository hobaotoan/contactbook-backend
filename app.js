const express = require("express");
const cors = require("cors");
const { BadRequestError, ErrorHandler } = require("./app/errors")

const setupContactRoutes = require("./app/routes/contact.routes");
const app = express();



app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({message: "Welcome to contact book application."});
});

setupContactRoutes(app);

app.use((req, res, nest) => {
    next(new BadRequestError(404, "Resource not found"));
});

app.use((err, req, res, next) => {
    ErrorHandler.handleError(error, res);
});


module.exports = app;