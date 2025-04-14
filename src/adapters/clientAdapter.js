export const adaptBackendToClient = (setClient, data) => {
    setClient({
        id: data.client_id,
        name: data.client_name,
        email: data.email,
        phone: data.number
      });
}

export const adaptClientToBackend = (client)=>{
    return {
      business_id: client.businessId,
      client_name: client.name,
      number: client.phone,
      email: client.email
    }
}