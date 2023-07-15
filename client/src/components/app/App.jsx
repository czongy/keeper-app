import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);

  useEffect(() => { 
    fetch("http://localhost:8000/app", {credentials: 'include'})
    .then((response) => {
      if (!response.ok) {
        throw new Error("Request failed with status " + response.status);
      }
      return response.json();
    })
    .then((json) => {
      if (!json.success) {
        return navigate("/");
      }
      return json.savedNote;
    })
    .then((note) => {
      setNotes(note);
    })
    .catch((err) => console.log("Fetch error", err));
  },[navigate]);

  function addNote(newNote) {
    setNotes(prevNotes => {
      const addedNotes = [...prevNotes, newNote];
      fetch("https://keeperappczy-api.onrender.com/app/updatenotes", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        credentials: "include",
        body: JSON.stringify(addedNotes)
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Request failed with status " + response.status);
        }
      })
      .catch((err) => console.log("Fetch error", err))

      return addedNotes;
    });
  }

  function deleteNote(id) {
    setNotes(prevNotes => {
      const deletedNotes = prevNotes.filter((noteItem, index) => {
        return index !== id;
      });
      fetch("https://keeperappczy-api.onrender.com/app/updatenotes", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        credentials: "include",
        body: JSON.stringify(deletedNotes)
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Request failed with status " + response.status);
        }
      })
      .catch((err) => console.log("Fetch error", err))

      return deletedNotes;
    });
  }

  return (
    <div>
      <Header />
      <CreateArea onAdd={addNote} />
      {notes.map((noteItem, index) => {
        return <Note key={index} id={index} title={noteItem.title} content={noteItem.content} toDelete={deleteNote} />;
      })}
      <Footer />
    </div>
  );
}

export default App;
