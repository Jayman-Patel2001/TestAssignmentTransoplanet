const express = require("express");
const { Translate } = require("@google-cloud/translate").v2;
const fs = require("fs");
const util = require("util");
const { TextToSpeechClient } = require("@google-cloud/text-to-speech");
const app = express();
const PORT = 8000;
const cors = require("cors");
require("dotenv").config();

app.use(express.json());

//! Implementing cors policy
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

//! Instantiate a translation client
const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);
const translate = new Translate({
  credentials: CREDENTIALS,
  projectId: CREDENTIALS.project_id,
});

//! Instantiate a text-to-speech client
const AUDIOCREDENTIALS = JSON.parse(process.env.AUDIOCREDENTIALS);
const client = new TextToSpeechClient({
  credentials: AUDIOCREDENTIALS,
  projectId: AUDIOCREDENTIALS.project_id,
});

app.post("/api/translate", async (req, res) => {
  const { text } = req.body;
  console.log(text);
  try {
    //TODO: Translating text into hindi
    const translatedText = await translateTextToHindi(text);

    //TODO: Synthesize speech audio in Hindi
    const filePath = await generateSpeechAudio(translatedText);

    //TODO: Sending the response
    res.json({ translatedText });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred during translation." });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

//! English to Hindi Translation
async function translateTextToHindi(text) {
  const [translation] = await translate.translate(text, "hi");
  return translation;
}

//! Generate speech audio using Google Text-to-Speech API
async function generateSpeechAudio(text) {
  const request = {
    input: { text },
    voice: { languageCode: "hi-IN", ssmlGender: "FEMALE" },
    audioConfig: { audioEncoding: "MP3" },
  };

  const [response] = await client.synthesizeSpeech(request);

  const writeFile = util.promisify(fs.writeFile);
  await writeFile("audio.mp3", response.audioContent, "binary");

  console.log("Audio file has been saved!!");
}
