const express = require('express');
const methodOverride = require('method-override')
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
        app.use(methodOverride('_method'));

        app.use((req, res, next) => {
            console.log(`Received ${req.method} request for ${req.url}`);
            next();
        });

        app.get('/', async (req, res) => {
            try {
                const contactsResult = await db.collection('contacts').find().toArray();
                res.render('index.ejs', { contacts: contactsResult });
            } catch (error) {
                console.error(error);
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
            } catch (error) {
                console.error(error);
            }
        });

        app.put('/contacts/:id', async (req, res) => {
            const contactId = req.params.id; 
            const { name, number, email } = req.body;

            try {
                await db.collection('contacts').updateOne(
                    { _id: new ObjectId(contactId)}, 
                    { $set: { name: name, number: number, email: email } }
                );
                console.log('Contact updated successfully!');
                res.redirect('/');
            } catch (error) {
                res.status(500).send({ message: "Error updating contact" });
            }
        });

        app.delete('/contacts/:id', async (req, res) => {
            try {
                const contactId = req.params.id;
                await db.collection('contacts').deleteOne({ _id: new ObjectId(contactId) });
                res.send('Contact deleted!');
            } catch (error) {
                res.status(500).send(error);
            }
        });

    } catch (error) {
        console.error("Failed to connect to the database:", error);
    }
}

startServer().catch(console.dir);
