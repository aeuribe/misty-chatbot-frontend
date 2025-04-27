import React from 'react';
import { TextField } from '@mui/material';

const SearchComponent = ({ searchTerm, setSearchTerm }) => {
  return (
    <TextField
      variant="outlined"
      size="small"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
      sx={{
        width: "250px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        "& .MuiOutlinedInput-root": {
          "& fieldset": { borderColor: "#ccc" },
          "&:hover fieldset": { borderColor: "#888" },
          "&.Mui-focused fieldset": {
            borderColor: "#1976d2",
            boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)",
          },
        },
        "& input": {
          color: "#333",
          padding: "8px 12px",
        },
        transition: "all 0.3s ease",
      }}
      InputLabelProps={{ shrink: true }}
    />
  );
};

export default SearchComponent;
