const functions = require("firebase-functions");

const admin = require("firebase-admin");

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const express = require("express");
const cors = require("cors");
const { response } = require("express");
const app = express();

app.use(cors({ origin: true }));
const db = admin.firestore();


app.get("/", (req, res) => {
  return res.status(200).send("Hi there, how are you doing?");
});

// CREATE (ADVERSTISER)

app.post("/api/create", (req, res) => {
  (async () => {
    try {
      await db.collection('advertisers').doc(`/${Date.now()}/`).create({
        id : Date.now(),
        name : req.body.name,
        phone : req.body.phone,
        email : req.body.email,
        cpf : req.body.cpf,
        campaigns : [],
      });
      return res.status(200).send({ status: "Sucess", msg: "Data Saved" });
    } catch(error) {
      console.log(error);
      return res.status(500).send({ status: "Failed", msg: error });
    }
  })();
});

// CREATE CAMPAIGN

app.post("/api/createCampaign", (req, res) => {
  (async () => {
    try {
      await db.collection('campaigns').doc(`/campaign-${Date.now()}/`).create({
        id : `campaign-${Date.now()}`,
          uid: "RESOLVER",
          name: req.body.name,
          city: req.body.city,
          cars: req.body.cars,
          months: req.body.months,
          situation: 'waiting',
          drivers: [],
          company: req.body.company,
          advertiser: req.body.advertiser,
          file: "RESOLVER",
      });
      return res.status(200).send({ status: "Sucess", msg: "Data Saved" });
    } catch(error) {
      console.log(error);
      return res.status(500).send({ status: "Failed", msg: error });
    }
  })();
});

// READ ONE

app.get("/api/get/:id", (req, res) => {
  (async () => {
    try {
      const reqDoc = db.collection('advertisers').doc(req.params.id);
      let userDetail = await reqDoc.get();
      let response = userDetail.data();

      return res.status(200).send({ status: "Sucess", msg: response });
    } catch(error) {
      console.log(error)
      return res.status(500).send({ status: "Failed", msg: error });
    }
  })();
});

// READ ALL

app.get("/api/getAll", (req, res) => {
  (async () => {
    try {
      const query = db.collection('advertisers');
      let response = [];

      await query.get().then((data) => {
        let docs = data.docs;

        docs.map((doc) => {
          const selectedItem = {
            name: doc.data().name,
            phone : doc.data().phone,
            email : doc.data().email,
            cpf : doc.data().cpf,
            campaigns : doc.data().campaigns, 
          };
          response.push(selectedItem);
        });
        return response;
      });

      return res.status(200).send({ status: "Sucess", data: response });
    } catch(error) {
      console.log(error)
      return res.status(500).send({ status: "Failed", msg: error });
    }
  })();
});

// UPDATE 

app.put("/api/update/:id", (req, res) => {
  (async () => {
    try {
      const reqDoc = db.collection('advertisers').doc(req.params.id);
      await reqDoc.update({
        name : req.body.name,
        phone : req.body.phone,
        email : req.body.email,
        cpf : req.body.cpf,     
      });

      return res.status(200).send({ status: "Sucess", msg: "Data Saved" });
    } catch(error) {
      console.log(error);
      return res.status(500).send({ status: "Failed", msg: error });
    }
  })();
});

app.delete("/api/delete/:id", (req, res) => {
  (async () => {
    try {
      const reqDoc = db.collection('advertisers').doc(req.params.id);
      await reqDoc.delete();
      return res.status(200).send({ status: "Success", msg: "Data Removed" });
    } catch (error) {
      console.log(error);
      res.status(500).send({ status: "Failed", msg: error });
    }
  })();
});

exports.app = functions.https.onRequest(app);