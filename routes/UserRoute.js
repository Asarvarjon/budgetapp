const router = require("express").Router()
const { ObjectId } = require("mongodb")
const { createCrypt, compareCrypt }  = require("../modules/bcrypt")
const { createToken, checkToken }  = require("../modules/jwt")




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
        password: await createCrypt(password),
        data: [] ,
        expense: [] ,
    }) 
    res.redirect("/")
    return
     
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
 

    if(!(user)) {
        res.render("index", {
            error: "User not found. Please, sign up!"
        }) 
        return;
    }
     

    if(!await compareCrypt(user.password, password)) {
        res.render("index", {
            error: "Password is incorrect"
        }) 

        return
        
    } 

    const token = createToken({
        user_id: user._id, 
    })

    res.cookie("token", token).redirect("/profile");

    return
     

})


 async function AuthUserMiddleware(req, res, next) {
     if(!req.cookies.token) {
         res.redirect("/");
     }

     const isTrue = checkToken(req.cookies.token)
     if(isTrue) {
         req.user = isTrue;
         next()
     } else (
         res.redirect("/")
     )

     return
 }

 router.get("/profile", AuthUserMiddleware, async (req, res) => {
    const { user_id } = req.user 
    let userInfo = await req.db.users.findOne(
        { _id: ObjectId(user_id)}
     )  
    let data = userInfo["data"] 
    let expense = userInfo["expense"] 

     let incomeTotal = 0;  
    for (let item of data) {
        incomeTotal += Number(item["money"]);
    }  

    let outcomeTotal = 0;  
    for (let item of expense) {
        outcomeTotal += Number(item["money"]);
    }  

    let total = incomeTotal - outcomeTotal

    res.render("profile", {
        data,
        expense,
        total,
    })

    return
 })


 router.post("/income", AuthUserMiddleware, async (req, res) => { 
     const { user_id } = req.user  
    await req.db.users.updateOne({
        _id: ObjectId(user_id)
    }, {
        $push: {
            data: {
               $each: [ { money: req.body.money, source: req.body.select },  ],
            }
          }
    })  
     
    res.redirect("/profile")
    return
 })

 router.post("/outcome", AuthUserMiddleware, async (req, res) => {
    const { user_id } = req.user  
    await req.db.users.updateOne({
        _id: ObjectId(user_id)
    }, {
        $push: {
            expense: {
               $each: [ { money: req.body.spendMoney, source: req.body.spendType },  ],
            }
          }
    })  
    res.redirect("/profile")
    return

 } )


 router.get("/logout", AuthUserMiddleware, async (req, res) => {
    const { user_id } = req.user  
    await req.db.users.deleteOne({
        _id: ObjectId(user_id)
    }) 

    res.redirect("/")
 })



module.exports = {
    router,
    path: "/",
}