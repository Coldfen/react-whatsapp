import React, {Dispatch, FC, useEffect, useRef, useState} from "react";
import "./AudioPlayer.css"
import {CircularProgress} from "@mui/material";
import {PauseRounded, PlayArrowRounded} from "@mui/icons-material";

interface AudioPlayerProps {
  sender: boolean
  roomId: string
  id: string
  audioUrl: string
  audioId: string
  setAudioId: Dispatch<string>
}

const AudioPlayer: FC<AudioPlayerProps> = ({
                                             sender,
                                             roomId,
                                             id,
                                             audioUrl,
                                             audioId,
                                             setAudioId
}) => {
  const [ isPlaying, setPlaying ] = useState<boolean>(false)
  const [ isMediaLoaded, setMediaLoaded ] = useState<boolean>(false)
  const [ isLoaded, setLoaded ] = useState<boolean>(false)
  const [ isMetadataLoaded, setMetadataLoaded ] = useState<boolean>(false)
  const [ sliderValue, setSliderValue ] = useState<number>(0)
  const [ duration, setDuration ] = useState<string>("")

  const totalDuration = useRef<string>('')
  const audio = useRef<HTMLAudioElement>(new Audio(audioUrl))
  const interval = useRef<any>()
  const isUploading = useRef<boolean>(audioUrl === 'uploading')

  useEffect(() => {
    if (isUploading.current && audioUrl !== "uploading") {
      audio.current = new Audio(audioUrl)
      audio.current.load()
      setLoaded(true)
    } else if (isUploading.current === false) {
      setLoaded(true)
    }
  }, [audioUrl])

  function getAudioDuration(media) {
    return new Promise(resolve => {
      media.onloadedmetadata = () => {
        media.currentTime = Number.MAX_SAFE_INTEGER

        media.ontimeupdate = () => {
          media.ontimeupdate = () => {}
          media.currentTime = 0.1
          resolve(media.duration)
        }
      }
    })
  }

  useEffect(() => {
    if (isLoaded) {
      getAudioDuration(audio.current).then(() => {
        setMetadataLoaded(true)
      })
    }
  }, [isLoaded])

  useEffect(() => {
    if(isMetadataLoaded) {
      audio.current.addEventListener('canplaythrough', () => {
        if (!totalDuration.current) {
          setMediaLoaded(true)
          const time = formatTime(audio.current.duration)
          totalDuration.current = time
          setDuration(totalDuration.current)
        }
      })

      audio.current.addEventListener('ended', () => {
        clearInterval(interval.current)
        setDuration(totalDuration.current)
        setSliderValue(0)
        setPlaying(false)
      } )
    }
  }, [isMetadataLoaded])

  function  formatTime(time) {
    let minutes: string | number = Math.floor(time / 60)
    let seconds: string | number  = Math.floor(time - minutes * 60)

    if (minutes < 10) {
      minutes = `0${minutes}`
    }
    if (seconds < 10) {
      seconds = `0${seconds}`
    }

    return `${minutes}:${seconds}`
  }

  function playAudio() {
    setPlaying(true)
    audio.current.play()
    if (audioId !== id) {
      setAudioId(id)
    }
    interval.current = setInterval(updateSlider, 100)

  }

  function updateSlider() {
    let sliderPosition = 0
    const { currentTime, duration } = audio.current
    if(typeof duration === 'number') {
      sliderPosition = currentTime * (100 / duration)
      setSliderValue(sliderPosition)
      const time = formatTime(currentTime)
      setDuration(time)
    }
  }

  function stopAudio() {
    audio.current.pause()
    clearInterval(interval.current)
    setPlaying(false)
    setDuration(totalDuration.current)
  }

  function scrubAudio(event) {
    const value = event.target.value
    const { duration } = audio.current

    if (isMediaLoaded) {
      const seekTo = duration * (value / 100)
      audio.current.currentTime = seekTo
      setSliderValue(value)
    }
  }

  useEffect(() => {
    if(audioId !== id) {
      audio.current.pause()
      setPlaying(false)
    }
  }, [audioId, id])

  return <>
    <div
        className={`audioplayer ${sender ? "" : 
      "audioplayer__alt"
    }`}>
      {!isMediaLoaded ? (
          <CircularProgress />
      ) : isPlaying ? (
        <PauseRounded
            onClick={stopAudio}
            className="pause" />
      ) : !isPlaying ? (
          <PlayArrowRounded
            onClick={playAudio}
          />
      ) : null}
    <div>
    <span style={{width: `${sliderValue}%`}}
      className="audioplayer__slider--played"
    />
    <input
      type="range"
      min="1"
      max="100"
      value={sliderValue}
      onChange={scrubAudio}
      className="audioplayer__slider"
    />
    </div>
    </div>
    <span className="chat__timestamp audioplayer__time" >
      {duration}
    </span>
  </>;
}

export default AudioPlayer
