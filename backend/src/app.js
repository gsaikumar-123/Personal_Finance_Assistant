const express = require('express');
const connectDb = require('./config/database');


const app = express();
app.use((req,res)=>{
    res.send("Hello World");
});

connectDb()
  .then(() => {
    console.log("Database Connected");

    app.listen(process.env.PORT || 1234, () => {
      console.log("Server started on port 1234...");
    });
  })
  .catch((err) => {
    console.log("Database Connection Error:", err.message);
  });