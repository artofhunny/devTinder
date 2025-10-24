const express = require("express");

const app = express();

app.get("/user", (req, res) => {
    res.send({firstname: "Hunny", lastname: "Arts"});
});

app.post("/user", (req, res) => {
    // Saving data to DB
    res.send("Data saved successfully");
});

app.delete("/user", (req, res) => {
    res.send("Deleted successfully");
});

app.put("/user", (req, res) => {
    res.send("successfuly updated the user");
});

app.use("/test", (req, res) =>  {
    res.send("Hello from the server");
});


app.listen(3000, () => console.log("Server is successfully listen on the port 3000"));