import * as React from 'react';
import { Paper, Button, Grid, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { getAllAppointmentsByEmail } from "../services/appointmentService.js";
import { useAsync } from '../hooks/useAsyncClean';
import useFetchAndLoad from "../hooks/useFetchAndLoad.js";

// Datos simulados con los campos relevantes
const data = [
  {
    client_name: 'Jon Snow',
    service: 'Consultoría Técnica',
    date: '2025-04-08',
    start_time: '10:00',
    end_time: '11:00',
    status: 'pending',
  },
  {
    client_name: 'Cersei Lannister',
    service: 'Mantenimiento Preventivo',
    date: '2025-04-08',
    start_time: '11:00',
    end_time: '12:00',
    status: 'completed',
  },
  {
    client_name: 'Jaime Lannister',
    service: 'Instalación de Maquinaria',
    date: '2025-04-08',
    start_time: '13:00',
    end_time: '14:00',
    status: 'pending',
  },
  {
    client_name: 'Arya Stark',
    service: 'Asesoría en Ingeniería',
    date: '2025-04-08',
    start_time: '15:00',
    end_time: '16:00',
    status: 'completed',
  },
  {
    client_name: 'Daenerys Targaryen',
    service: 'Mantenimiento Correctivo',
    date: '2025-04-08',
    start_time: '16:00',
    end_time: '17:00',
    status: 'pending',
  },
];

const statuses = ['all', 'completed', 'pending'];

export default function AppointmentList({ email }) {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { loading, callEndpoint } = useFetchAndLoad();
  const [appointments, setAppointments] = useState([]);

  // Get All Appointments by Email
  const successFunctionGetAppointments = (data) => {
    if (!data) return;
    setAppointments(data);
  };
  const getAppointments = async () => {
    return callEndpoint(getAllAppointmentsByEmail(email));
  }; 
  useAsync(getAppointments, successFunctionGetAppointments, null, null, []);


  // Filtrar las citas basadas en el estado y la búsqueda
  const filteredData = appointments
    .filter(item => {
      if (filter === 'completed') return item.status === 'completed';
      if (filter === 'pending') return item.status === 'pending';
      return true;
    })
    .filter(item => { 
      // Filtro basado en la búsqueda (por nombre, servicio, fecha o hora)
      const searchQuery = searchTerm.toLowerCase();
      return (
        item.client_name.toLowerCase().includes(searchQuery) ||
        item.service_name.toLowerCase().includes(searchQuery) ||
        item.date.toLowerCase().includes(searchQuery) ||
        item.start_time.toLowerCase().includes(searchQuery) ||
        item.end_time.toLowerCase().includes(searchQuery)
      );
    });

  const markAsCompleted = (client_name) => {
    console.log(`Marking appointment for ${client_name} as completed`);
    // Lógica para actualizar el estado de la cita
  };

  const cancelAppointment = (client_name) => {
    console.log(`Canceling appointment for ${client_name}`);
    // Lógica para cancelar la cita
  };

  return (
    <div>
      {/* Contenedor para los filtros y la barra de búsqueda */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        {/* Botones para filtrar por estado */}
        <div>
          {statuses.map(status => (
            <Button
              key={status}
              variant="outlined"
              onClick={() => setFilter(status)}
              style={{
                marginRight: '8px',
                textTransform: 'capitalize',
                borderRadius: '20px',
                color: '#333',  // Color más oscuro para los botones
                borderColor: '#333',  // Color del borde más oscuro
              }}
            >
              {status}
            </Button>
          ))}
        </div>

        {/* Barra de búsqueda */}
        <TextField
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '200px',
            borderRadius: '20px',
            backgroundColor: '#f4f6f8',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
          }}
          InputLabelProps={{
            style: { color: '#aaa' },
          }}
          focused
        />
      </div>

      {/* Lista de citas como tarjetas */}
      <Grid container spacing={2}>
        {filteredData.map(item => (
          <Grid item xs={12} sm={6} md={4} key={item.client_name}>
            <Paper
              sx={{
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                backgroundColor: item.status === 'completed' ? '#f1f8e9' : '#fff', // Fondo suave y verde claro para completados
                color: '#333',  // Texto oscuro
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                },
              }}
            >
              {/* Información del cliente */}
              <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold', color: '#2c3e50' }}>
                {item.client_name}
              </Typography>
              <Typography variant="body1" color="textSecondary" gutterBottom style={{ color: '#7f8c8d' }}>
                <strong>Service:</strong> {item.service}
              </Typography>

              {/* Información de la cita */}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="textSecondary" style={{ color: '#7f8c8d' }}>
                  <strong>Date:</strong> {item.date}
                </Typography>
                <Typography variant="body2" color="textSecondary" style={{ color: '#7f8c8d' }}>
                  <strong>Time:</strong> {item.start_time} - {item.end_time}
                </Typography>
              </div>

              {/* Estado de la cita */}
              <Typography variant="body2" style={{ marginTop: '8px', fontWeight: 'bold', color: item.status === 'completed' ? '#28a745' : '#f39c12' }}>
                <strong>Status:</strong> {item.status}
              </Typography>

              {/* Botones de acción */}
              <div style={{ marginTop: '16px' }}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => markAsCompleted(item.client_name)}
                  style={{ marginRight: '8px' }}
                >
                  ✔ Complete
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => cancelAppointment(item.client_name)}
                >
                  ✖ Cancel
                </Button>
              </div>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
