const { MongoClient } = require("mongodb");

 const AtlasUrl = 'mongodb+srv://mongo:mongo@cluster0.uvl2x.mongodb.net/usersystem?retryWrites=true&w=majority'

 const client = new MongoClient(AtlasUrl);



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
 };


 module.exports = mongo;