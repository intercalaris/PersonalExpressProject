const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 8000;

const uri = "mongodb+srv://ymaviv:sisma@cluster0.hlyzd.mongodb.net/personal-express-app?retryWrites=true&w=majority";
const dbName = "personal-express-app";

// Create MongoClient with static API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function startServer() {
    try {
        console.log("Attempting to connect to MongoDB...");
        await client.connect();
        
        // Confirm connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        const db = client.db(dbName);
        // Start server after successful connection
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
                res.render('index.ejs', { contacts: contactsResult }); // left contacts is how EJS file will refer to right contacts, the array const found in the collection
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

        app.delete('/contacts', async (req, res) => {
            try {
                await db.collection('contacts').findOneAndDelete({ name: req.body.name, number: req.body.number });
                res.send('Contact deleted!');
            } catch (err) {
                res.status(500).send(err);
            }
        });

    } catch (error) {
        console.error("Failed to connect to the database:", error);
    }
}

// Start server and handle any errors outside the function
startServer().catch(console.dir);
