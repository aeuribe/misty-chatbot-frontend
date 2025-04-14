import { useState } from "react";

export const useApiRequest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = async (asyncFn, successFunction, errorFunction) => {
    setIsLoading(true);
    setError(null);

    console.log("Ejecutando API request...");
    
    try {
      const result = await asyncFn();
      console.log("entre al result", result);
      successFunction && successFunction(result.data);
    } catch (err) {
      console.error("Error en la API:", err);
      setError(err);
      errorFunction && errorFunction(err);
    } finally {
      setIsLoading(false);
    }
  };

  return { execute, isLoading, error };
};
  