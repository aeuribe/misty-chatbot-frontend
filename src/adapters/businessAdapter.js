const businessAdapter = (setBusiness, data) => {
    setBusiness({
        id: data.business_id,
        name: data.business_name,
      });
}

export default businessAdapter;