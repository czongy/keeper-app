import React from "react";
import HighlightIcon from '@mui/icons-material/Highlight';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();

  function handleLogout() {
    fetch("http://localhost:8000/logout", {credentials: 'include'})
    .then((response) => {
      if (!response.ok) {
        throw new Error("Request failed with status " + response.status);
      }
      return response.json();
    })
    .then((json) => {
      if (json.success) {
        navigate("/");
      }
    })
    .catch((err) => console.log("Fetch error", err));
  }

  return (
    <header>
      <h1><HighlightIcon />Keeper<LogoutIcon className="logout-icon" onClick={handleLogout} /></h1>
    </header>
  );
}

export default Header;
