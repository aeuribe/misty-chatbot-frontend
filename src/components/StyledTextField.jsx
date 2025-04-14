// components/StyledTextField.jsx
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';

const StyledTextField = styled(TextField)({
  width: "100%",
  marginBottom: "15px",
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#B0B0B0",
    },
    "&:hover fieldset": {
      borderColor: "#3A57E8",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#4D4DFF",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#B0B0B0",
    transition: "color 0.3s ease",
    "&.Mui-focused": {
      color: "#4D4DFF",
    },
    "&.MuiInputLabel-shrink": {
      color: "#B0B0B0",
    },
  },
  "& .MuiInputBase-input": {
    color: "#000",
    backgroundColor: "#FFF",
    "-webkit-text-fill-color": "#000 !important",
    transition: "background-color 0s ease-in-out",
  },
  "& .Mui-disabled": {
    color: "#000 !important",
    borderColor: "#B0B0B0 !important",
    "-webkit-text-fill-color": "#000 !important",
    backgroundColor: "#FFF !important",
    "& fieldset": {
      borderColor: "#B0B0B0 !important",
    },
    "&:hover fieldset": {
      borderColor: "#3A57E8 !important",
    },
  },
  "& .Mui-disabled + .MuiInputLabel-root": {
    color: "#B0B0B0 !important",
  },
  "& input:-webkit-autofill": {
    "-webkit-box-shadow": "0 0 0 100px #fff inset !important",
    backgroundColor: "transparent !important",
    "-webkit-text-fill-color": "#000 !important",
  },
});

export default StyledTextField;
