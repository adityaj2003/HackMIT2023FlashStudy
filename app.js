const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const axios = require('axios');
const { exec } = require('child_process');

const app = express();
app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

app.post('/upload', upload.single('pdf'), (req, res) => {
  if (req.file) {
    const filePath = req.file.path;

    exec(`python your_script.py "${filePath}"`, async (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing Python script: ${error}`);
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (stderr) {
        console.error(`Python script stderr: ${stderr}`);
      }

      try {
        const summaryResponse = await axios.post('http://localhost:3000/generate_summary', {
          transcript: stdout.trim()
        });

        const summary = summaryResponse.data.summary;
        res.json({ pdfPath: path.join('/', filePath), summary });

      } catch (summaryError) {
        console.error(`Error generating summary: ${summaryError}`);
        res.status(500).json({ error: 'Could not generate summary' });
      }
    });
  } else {
    res.status(400).json({ error: 'File upload failed' });
  }
});

var pdfText;

app.post('/generate_summary', async (req, res) => {
  const transcript = req.body.transcript;
    pdfText = transcript;
    res.json({ summary: transcript });
});


app.post("/get-summary", (req, res) => {
    console.log("asking question to gpt");
    const transcript = "This is the pdf text - "+pdfText+". This is the question - "+req.body.transcript;
    console.log(transcript);
    exec(`python summarize.py "${transcript}"`, (error, stdout, stderr) => {
      if (error) {
        console.log(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      
      res.json({ summary: stdout });
    });
  });
// Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000/');
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pdfUpload.html'));
});
