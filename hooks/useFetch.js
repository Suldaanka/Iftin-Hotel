"use client";

import { useAuthStore } from "@/store/authStote";
import { useQuery } from "@tanstack/react-query";



// Token utility
const getToken = () => {
  const { token } = useAuthStore.getState();
  return token;
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const getFullUrl = (path) => {
  try {
    new URL(path);
    return path; // path is already a full URL
  } catch (e) {
    return `${BASE_URL}${path}`; // prepend base URL
  }
};

export function useFetch(endpoint, queryKey, id = null, options = {}) {
  const token = getToken();

  const fetchData = async () => {
    const res = await fetch(getFullUrl(endpoint), {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to fetch data");
    }

    return res.json();
  };

  return useQuery({
    queryKey,
    queryFn: fetchData,
    id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
    ...options,
  });
}
