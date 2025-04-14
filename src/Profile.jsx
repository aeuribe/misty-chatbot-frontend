import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

const Profile = () => {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [token, setToken] = useState(null);
  const [response, setResponse] = useState(null);

  const handleClick = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/private", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setResponse(res.data);
    } catch (error) {
      console.error("Error calling backend:", error);
      const message =
        error.response?.data?.message || "Unexpected error from backend";
      setResponse({ message: "Error: " + message });
    }
  };

  useEffect(() => {
    const getToken = async () => {
      try {
        const accessToken = await getAccessTokenSilently();
        setToken(accessToken);
        console.log("Access Token:", accessToken);
      } catch (error) {
        console.error("Error getting token:", error);
      }
    };

    if (isAuthenticated) {
      getToken();
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  if (isLoading) return <div>Loading...</div>;

  return (
    isAuthenticated && (
      <div>
        <img src={user.picture} alt={user.name} />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        <p>
          <strong>Token:</strong> {token}
        </p>
        <button onClick={handleClick}>Call Backend</button>
        {response && <p>{response.message}</p>}
      </div>
    )
  );
};

export default Profile;
