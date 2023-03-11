const express = require("express");
const multer = require("multer");

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const timestamp = new Date().getTime();
    const extension = file.originalname.split(".").pop();
    cb(null, `document-${timestamp}.${extension}`);
  },
});

const upload = multer({ storage: storage });

const documents = [];

// Create a new document
app.post("/documents", upload.single("image"), (req, res) => {
  const document = {
    id: documents.length + 1,
    timestamp: new Date().toISOString(),
    report: req.body.report === "true",
    description: req.body.description,
    image: req.file.path,
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
  if (documentIndex !== -1) {
    const document = {
      id: id,
      timestamp: new Date().toISOString(),
      report: req.body.report === "true",
      description: req.body.description,
      image: documents[documentIndex].image,
    };
    documents[documentIndex] = document;
    res.status(200).json(document);
  } else {
    res.status(404).json({ message: "Document not found" });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
