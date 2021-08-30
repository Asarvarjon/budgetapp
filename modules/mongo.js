const { MongoClient } = require("mongodb")

 const mongoAtlasUrl = 'mongodb+srv://mongo:mongo@cluster0.uvl2x.mongodb.net/usersystem?retryWrites=true&w=majority'

 const client = new MongoClient(mongoAtlasUrl);



 async function mongo() {  
     try {
         await client.connect()
        const db = client.db("usersystem")

        const users = await db.collection("users")

        return {
            users
        }

     } catch (error) {
         console.log(error);
     }
 }


 module.exports = mongo;