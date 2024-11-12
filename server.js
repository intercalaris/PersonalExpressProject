const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { ObjectId, ServerApiVersion, MongoClient } = require('mongodb');

const port = process.env.PORT || 8000;
const uri = "mongodb+srv://ymaviv:sisma@cluster0.hlyzd.mongodb.net/personal-express-app?retryWrites=true&w=majority";
const dbName = "personal-express-app";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
// https://stackoverflow.com/questions/12901593/remove-record-by-id 
async function startServer() {
    try {
        console.log("Attempting to connect to MongoDB...");
        await client.connect();
        
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        const db = client.db(dbName);

        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });

        app.set('view engine', 'ejs');
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());
        app.use(express.static('public'));

        app.get('/', async (req, res) => {
            try {
                const contactsResult = await db.collection('contacts').find().toArray();
                res.render('index.ejs', { contacts: contactsResult }); // left is how ejs references the array, right is constant established above 
            } catch (err) {
                console.error(err);
            }
        });

        app.post('/contacts', async (req, res) => {
            try {
                await db.collection('contacts').insertOne({
                    name: req.body.name,
                    number: req.body.number,
                    email: req.body.email,
                });
                console.log('Contact saved to database');
                res.redirect('/');
            } catch (err) {
                console.error(err);
            }
        });

        app.delete('/contacts/:id', async (req, res) => {
            try {
                const contactId = req.params.id;
                await db.collection('contacts').deleteOne({ "_\id": new ObjectId(contactId) });
                res.send('Contact deleted!');
            } catch (err) {
                res.status(500).send(err);
            }
        });

    } catch (error) {
        console.error("Failed to connect to the database:", error);
    }
}

startServer().catch(console.dir);
