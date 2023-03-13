const express = require("express");
const cors = require("cors");
const uuid = require("uuid");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const upload = multer({ dest: "uploads" });

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, "uploads")));

const documents = [];
app.get("/ping", (req, res) => {
  res.status(200).json({ status: "true" });
});

app.post("/documents", upload.single("image"), (req, res) => {
  const data = JSON.parse(req.body.document);

  let filename;
  if (req.file) {
    filename = req.file.filename;
  } else {
    filename = uuid.v4();

    let path = "./uploads/" + filename;
    fs.writeFileSync(path, req.body.base64, { encoding: "base64" });
  }

  const document = {
    id: data.id,
    timestamp: new Date().toISOString(),
    report: data.report === "true" ? true : false,
    description: data.description,
    image_url: filename,
    uploaded: true,
  };

  documents.push(document);
  res.status(201).json(document);
});

// Load all documents
app.get("/documents", (req, res) => {
  res.status(200).json(documents);
});

// Update an existing document
app.put("/documents/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const documentIndex = documents.findIndex((d) => d.id === id);

  const original = documents[documentIndex];
  if (documentIndex !== -1) {
    if (req.body.report) {
      original.report = req.body.report;
    }
    if (req.body.description) {
      original.description = req.body.description;
    }

    documents[documentIndex] = original;
    res.status(200).json(document);
  } else {
    res.status(404).json({ message: "Document not found" });
  }
});

app.get("/documents/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const document = documents.find((d) => d.id === id);
  if (document) {
    res.status(200).json(document);
  } else {
    res.status(404).json({ message: "Document not found" });
  }
});

let host = "127.0.0.1";
app.listen(port, host, () => {
  console.log(`Server listening at http://${host}:${port}`);
});
