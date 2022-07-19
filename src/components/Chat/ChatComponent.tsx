import React, {ChangeEvent, FC, SyntheticEvent, useState} from "react";
import "./Chat.css"
import firebase from "firebase";
import {WindowSize} from "../../hooks/useWindowSize";
import useRoom from "../../hooks/useRoom";
import {useHistory, useParams} from "react-router-dom";
import {Avatar, CircularProgress, IconButton, Menu, MenuItem} from "@mui/material";
import {AddPhotoAlternate, ArrowBack, MoreVert} from "@mui/icons-material";
import ChatMessages from "./ChatMessages/ChatMessagesComponent";
import MediaPreview from "../MediaPreview/MediaPreviewComponent";
import ChatFooter from "./ChatFooter/ChatFooterComponent";
import { v4 as uuid } from "uuid"
import {audioStorage, createTimestamp, db, storage} from "../../firebase";
import Compressor from "compressorjs";
import useChatMessages from "../../hooks/useChatMessages";

interface ChatProps {
  user: firebase.User
  page: WindowSize
}

const Chat: FC<ChatProps> = ({user, page}) => {
  const [ image, setImage ] = useState<File | Blob>(null)
  const [ input, setInput ] = useState<string>('')
  const [ isDeleting, setDeleting ] = useState<boolean>(false)
  const [ openMenu, setOpenMenu ] = useState<EventTarget & HTMLButtonElement>(null)
  const [ src, setSrc ] = useState<string | ArrayBuffer>("")
  const [ audioId, setAudioId ] = useState<string>('')

  const { roomId } = useParams<any>()
  const room: {id: string, photoURL: string, name?: string} = useRoom(roomId, user.uid)
  const history = useHistory()
  const messages = useChatMessages(roomId)

  function onChange(event) {
    setInput(event.target.value)
  }

  async function sendMessage(event) {
    event.preventDefault()

    if(input.trim() || (input === "" && image)) {
        setInput('')
      if (image) {
        closePreview()
      }
      const imageName = uuid()
      const newMessage = image ? {
        name: user.displayName,
        message: input,
        uid: user.uid,
        timestamp: createTimestamp(),
        time: new Date().toUTCString(),
        imageUrl: "uploading",
        imageName: imageName
      } : {
        name: user.displayName,
        message: input,
        uid: user.uid,
        timestamp: createTimestamp(),
        time: new Date().toUTCString()
      }

      db.collection('users')
          .doc(user.uid)
          .collection('chats')
          .doc(roomId)
          .set({
            name: room.name,
            photoURL: room.photoURL || null,
            timestamp: createTimestamp()
          })

      const doc = await db.collection("rooms").doc(roomId)
          .collection("messages").add(newMessage)

      if (image) {
        new Compressor(image, {
          quality: 0.8,
          maxWidth: 1920,
          async success(result) {
            setSrc('')
            setImage(null)
            await storage.child(imageName).put(result)
            const url = await storage.child(imageName)
                .getDownloadURL()
            db.collection('rooms')
                .doc(roomId)
                .collection('messages')
                .doc(doc.id)
                .update({
                  imageUrl: url
                })
          }
        })
      }
    }
  }

  function showPreview(event) {
    const file = event.target.files[0];

    if(file) {
      setImage(file)
      const reader = new FileReader();
      reader.readAsDataURL(file)
      reader.onload = () => {
        setSrc(reader.result)
      }
    }
  }

  function closePreview() {
    setSrc('')
    setImage(null)
  }

  async function deleteRoom() {
    setOpenMenu(null)
    setDeleting(true)

    try {
      const roomRef = db.collection('rooms').doc(roomId)
      const roomMessages = await roomRef.collection('messages').get()
      const audioFiles = []
      const imageFiles = []
      roomMessages.docs.forEach(doc => {
        if (doc.data().audioName) {
          audioFiles.push(doc.data().audioName)
        } else if (doc.data().imageName) {
          imageFiles.push(doc.data().imageName)
        }
      })

      await Promise.all([
          ...roomMessages.docs.map(doc => doc.ref.delete()),
          ...imageFiles.map(image => storage.child(image).delete()),
          ...audioFiles.map(audio => audioStorage.child(audio).delete()),
          db.collection('user').doc(user.uid).collection('chats')
              .doc(roomId).delete(),
          roomRef.delete()
      ])

    } catch (error) {
      console.error('Error deleting room', error.message)
    } finally {
      setDeleting(false)
      page.isMobile ? history.goBack() : history.replace('/chats')
    }
  }

  return <div className="chat">
    <div
        style={{ height: page.height }}
        className="chat__background"
    />
    <div className="chat__header">
      {page.isMobile && (
          <IconButton onClick={history.goBack}>
            <ArrowBack />
          </IconButton>
      )}
      <div className="avatar__container">
        <Avatar src={room?.photoURL} />
      </div>
      <div className="chat__header--info">
        <h3
            style={{ width: page.isMobile && page.width - 165 }}
        >
          {room?.name}
        </h3>
      </div>
      <div className="chat__header--right">
        <input
          id="image"
          style={{display: "none"}}
          accept="image/*"
          type="file"
          onChange={showPreview}
        />
        <IconButton>
          <label
              style={{cursor: 'pointer', height: 24}}
              htmlFor="image"
          >
            <AddPhotoAlternate />
          </label>
        </IconButton>
        <IconButton
            onClick={(event) => setOpenMenu(event.currentTarget)}
        >
          <MoreVert />
        </IconButton>
        <Menu
            id="menu"
            anchorEl={openMenu}
            open={Boolean(openMenu)}
            onClose={() => setOpenMenu(null)}
            keepMounted
            >
          <MenuItem
            onClick={deleteRoom}
          >Delete Room</MenuItem>
        </Menu>
      </div>
    </div>

    <div className="chat__body--container">
      <div
          className="chat__body"
          style={{ height: page.height - 68}}
      >
        <ChatMessages
          messages={messages}
          user={user}
          roomId={roomId}
          audioId={audioId}
          setAudioId={setAudioId}
        />
      </div>
    </div>

    <MediaPreview closePreview={closePreview} src={src.toString()} />
    <ChatFooter
      input={input}
      onChange={onChange}
      sendMessage={sendMessage}
      image={image}
      user={user}
      room={room}
      roomId={roomId}
      setAudioId={setAudioId}
    />

    {isDeleting && (
        <div className="chat__deleting">
          <CircularProgress />
        </div>
    )}
  </div>;
}


export default Chat