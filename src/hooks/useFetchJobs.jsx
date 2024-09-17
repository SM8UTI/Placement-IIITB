import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { API_URL } from "../utils/constant";

const useFetchJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJobs = useCallback(async () => {
    setLoading(true); // Set loading to true for refetching
    try {
      const response = await axios.get(`${API_URL}/get-jobs`, {
        headers: {
          accept: "application/json",
        },
      });

      setJobs(response.data);
      setError(null); // Reset error on successful fetch
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []); // Using useCallback to avoid re-creating the function unnecessarily

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Return jobs, loading, error, and the refetch function
  return { jobs, loading, error, refetch: fetchJobs };
};

export default useFetchJobs;
