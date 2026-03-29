import React,{useState} from "react";
import songs from "./songs";

function App(){
  const [currentSong ,setCurrentSong] = useState(null);

  return (

     <div>
      <h1>Music Player</h1>

      {songs.map((song,index) => (
        <button key = {index} onClick={() => setCurrentSong(song)}>{song.title}</button>
      ))}

      {currentSong && (
        <audio controls autoPlay src = {currentSong.file}></audio>
      )}
     </div>
  )
}
export default App;

