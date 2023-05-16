import React, { useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import Zoom from '@mui/material/Zoom';

function CreateArea(props) {
  const [note, setNote] = useState({
    title: "",
    content: "",
  });
  const [expand, setExpand] = useState(false);

  function handleChange(event) {
    const {name, value} = event.target;
    setNote(prevNote => {
      return {
        ...prevNote,
        [name] : value,
      };
    });
  };

  function handleSubmit(event) {
    props.onAdd(note);
    event.preventDefault();
    setNote({
      title: "",
      content: "",
    });
  }

  function toExpand() {
    setExpand(true);
  }

  return (
    <div>
      <form className="create-note">
        {expand ? (
        <div>
          <input name="title" value={note.title} onChange={handleChange} placeholder="Title" />
          <textarea name="content" value={note.content} onChange={handleChange} placeholder="Take a note..." rows="3" />
          <Zoom in={expand}><Fab onClick={handleSubmit}><AddIcon /></Fab></Zoom>
        </div> 
        ) : (
          <textarea name="content" placeholder="Take a note..." rows="1" onClick={toExpand} />
        )}
      </form>
    </div>
  );
};

export default CreateArea;
