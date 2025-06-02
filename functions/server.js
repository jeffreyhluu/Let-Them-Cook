const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("Cloud Run API"));

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Cloud Run server listening on port ${port}`);
});
