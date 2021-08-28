const router = require("express").Router()
const { createCrypt, compareCrypt }  = require("../modules/bcrypt")


router.get("/", (req, res) => {
    res.render("index")
})

router.get("/signup",  (req, res) => {
    res.render("sign")
})

router.post("/signup", async (req, res) => {
    const { email, password} = req.body;

    if(!(email,password)) {
        res.render("index", {
            error: "Email or password not found!"
        })
        return;
    }

    let user = await req.db.users.findOne({
        email: email.toLowerCase(), 
    })

    if(user) {
        res.render("index", {
            error: "Email already exists"
        }) 
        return;
    }

    user = await req.db.users.insertOne({
        email: email.toLowerCase(),
        password: await createCrypt(password)
    })

    res.redirect("/")
})

router.post("/", async(req, res) => {
    const { email, password} = req.body;

    if(!(email,password)) {
        res.render("index", {
            error: "Email or password not found!"
        })
        return;
    }

    let user = await req.db.users.findOne({
        email: email.toLowerCase(), 
    })

    if(!user) {
        res.render("index", {
            error: "User not found!"
        }) 
        return;
    }

    if(! await compareCrypt(user.password, password)) {
        res.render("index", {
            error: "Password is incorrect"
        }) 
        return;
    } 

    
})




module.exports = {
    router,
    path: "/",
}