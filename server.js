const cookieParser = require("cookie-parser")
const express = require("express")
const app = express()
const path = require("path")
const UserRoute = require("./routes/UserRoute")
const mongo = require("./modules/mongo")

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})


app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))


app.set("view engine", "ejs")



app.use("/uploads", express.static(path.join(__dirname, "public")))
app.use("/bootstrap", express.static(path.join(__dirname, "node_modules", "bootstrap", "dist")))

app.use(cookieParser());


 (async function() {
     const db = await mongo()  
    await app.use( (req, res, next) => {
        req.db = db;
        next();
    });

   await app.use(UserRoute.path, UserRoute.router);


 })()