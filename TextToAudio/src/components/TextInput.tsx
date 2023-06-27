import { useState, useRef, useEffect } from "react";
import "../styles/TextInput.css";
import PlayCircleOutlineSharpIcon from "@mui/icons-material/PlayCircleOutlineSharp";

const TextInput = () => {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [showPlayIcon, setShowPlayIcon] = useState(false);

  const audioURL = "/server/audio.mp3";
  const audioRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setTranslatedText("");
      const response = await fetch("http://127.0.0.1:8000/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: inputText }),
      });

      if (response.ok) {
        const text = await response.json();
        // console.log("Translated text:", text);
        setTranslatedText(text.translatedText);
        setShowPlayIcon(true);
      } else {
        console.error("Error:", response.status);

        setShowPlayIcon(false);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handlePlay = () => {
    audioRef.current.pause(); //* Pause the previous audio
    audioRef.current.currentTime = 0; //* Reset audio playback to the beginning
    audioRef.current.src = audioURL; //* Set the audio source to the local path
    audioRef.current.play(); //* Play the audio
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} method="POST">
      <div className="flex items-center justify-center h-screen flex-col">
        <label
          htmlFor="helper-text"
          className="mb-4 md:w-1/3 w-4/5 text-left text-xl md:text-md font-medium text-white dark:text-white"
        >
          Enter your text here
        </label>
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          id="helper-text"
          aria-describedby="helper-text-explanation"
          className="bg-gray-800 border md:w-1/3 w-4/5 border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Your text goes here....."
        />
        <button
          type="submit"
          className="text-white md:w-1/3 w-4/5 my-8 bg-gray-600 hover:bg-gray-500 focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm  px-5 py-2.5 text-center"
        >
          Translate To Hindi
        </button>

        {translatedText && (
          <textarea
            id="message"
            rows="4"
            className="p-2.5 mb-4 md:w-1/3 w-4/5 text-sm text-white bg-gray-700 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Translated Text To Hindi..."
          >
            {translatedText}
          </textarea>
        )}
        {showPlayIcon && (
          <div className="flex md:w-1/3 w-4/5 justify-evenly items-center">
            <div onClick={handlePlay}>
              <PlayCircleOutlineSharpIcon />
            </div>
            <audio ref={audioRef} controls>
              <source src={audioURL} type="audio/mp3" />
            </audio>
          </div>
        )}
      </div>
    </form>
  );
};

export default TextInput;
