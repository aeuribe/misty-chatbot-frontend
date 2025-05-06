import React from "react";
import { Button } from "@mui/material";
import PropTypes from "prop-types";
import "./filterBar.css"; // Puedes agregar estilos específicos si quieres

const FilterBar = ({ statuses, currentFilter, onChangeFilter }) => {
  return (
    <div className="statusButtons">
      {statuses.map((status) => (
        <Button
          key={status}
          variant={currentFilter === status ? "contained" : "outlined"}
          onClick={() => onChangeFilter(status)}
          className="statusButton"
        >
          {status}
        </Button>
      ))}
    </div>
  );
};

FilterBar.propTypes = {
  statuses: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentFilter: PropTypes.string.isRequired,
  onChangeFilter: PropTypes.func.isRequired,
};

export default FilterBar;
