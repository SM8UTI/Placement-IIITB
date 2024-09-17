import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../utils/constant";

const useFetchJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${API_URL}/get-jobs`, {
        headers: {
          accept: "application/json",
        },
      });

      setJobs(response.data);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return { jobs, loading, error };
};

export default useFetchJobs;
