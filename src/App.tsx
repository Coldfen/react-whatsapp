import React, {FC} from 'react';
import './App.css';
import useWindowSize from "./hooks/useWindowSize";
import AudioPlayer from "./components/AudioPlayer/AudioPlayerComponent";

function App() {
  const page = useWindowSize()

  return (
    <div className="app" style={{ ...page }}>
        <AudioPlayer />
    </div>
  );
}

export default App;
