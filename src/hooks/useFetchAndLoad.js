import { useEffect, useState } from "react";

const useFetchAndLoad = () => {
  const [loading, setLoading] = useState(false);
  let controller = "";

  const callEndpoint = async (axiosCall) => {
    if (axiosCall.controller) controller = axiosCall.controller;
    setLoading(true);
    let result = "";
    try {
      result = await axiosCall.call;
      console.log("result desde useFetchAndLoad:", result)
    } catch (error) {}
    setLoading(false);
    return result;
  };

  const cancelEndpoint = () => {
    setLoading(false);
    controller && controller.abort();
  }

  useEffect(()=>{
    return () => {
        cancelEndpoint();
    }
  },[]);

  return { loading, callEndpoint };
};

export default useFetchAndLoad;
