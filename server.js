const app = require("./app");
const config = require("./app/config");
const mongoose = require("mongoose");



// start server
const PORT = config.app.port;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
})