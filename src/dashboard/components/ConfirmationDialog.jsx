import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

const ConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  actionType,
  selectedAppointment,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {`¿${actionType === "complete" ? "Completar" : "Cancelar"} cita?`}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          ¿Estás seguro de que quieres{" "}
          {actionType === "complete" ? "completar" : "cancelar"} esta cita?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>No</Button>
        <Button onClick={onConfirm} autoFocus>
          Sí
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
