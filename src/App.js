  import React,{useState} from "react";
  import songs from "./songs";

  function App(){
    const [currentIndex ,setCurrentIndex] = useState(0);

    const nextSong = () => {
      setCurrentIndex((prev) => (prev + 1) % songs.length);
    };
    const prevSong = () => {
        setCurrentIndex((prev) => 
        prev === 0 ? songs.length - 1 : prev - 1);
    };
    return (
      <div>
        <h1>Music Player</h1>

        {songs.map((song,index) => (
          <button key = {index} onClick={() => setCurrentIndex(index)}>{song.title}</button>
        ))}
        <audio key={songs[currentIndex].file} controls autoPlay src={songs[currentIndex].file}></audio>
        <div>
          <button onClick={prevSong}>⬅️Prev</button>
          <button onClick={nextSong}>Next➡️ </button>
        </div>
        
      </div>
    );
  }
  export default App;
//COMMIT

