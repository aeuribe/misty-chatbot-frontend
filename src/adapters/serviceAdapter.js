const serviceAdapter = (setService, data) => {
    setService({
        id: data.service_id,
        name: data.service_name,
        duration: data.duration_min
      });
}

export default serviceAdapter;