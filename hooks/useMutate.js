"use client";

import { useAuthStore } from "@/store/authStote";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const getToken = () => {
  const { token } = useAuthStore.getState();
  return token;
};

const getFullUrl = (path) => {
  try {
    new URL(path);
    return path;
  } catch (e) {
    return `${BASE_URL}${path}`;
  }
};

export function useMutate(endpoint, queryKey, options = {}) {
  const queryClient = useQueryClient();

  const {
    method = "POST",
    headers: customHeaders = {},
    requireAuth = false,
    ...mutationOptions
  } = options;

  const mutationFn = async (body) => {
    const token = getToken();

    console.log("🔍 Mutation details:", {
      endpoint,
      method,
      requireAuth,
      hasToken: !!token,
      token: token ? `${token.substring(0, 20)}...` : "NO TOKEN",
      isFormData: body instanceof FormData,
    });

    // ✅ Only set Content-Type if NOT FormData
    const headers = { ...customHeaders };

    if (!(body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    // Add auth header if required
    if (requireAuth) {
      if (!token) {
        throw new Error("Authentication required but no token found. Please login again.");
      }
      headers["Authorization"] = `Bearer ${token}`;
    }

    console.log("📤 Request headers:", headers);

    const res = await fetch(getFullUrl(endpoint), {
      method,
      headers,
      // ✅ Send body as-is if it's FormData, stringify only if JSON
      body: body
        ? body instanceof FormData
          ? body
          : JSON.stringify(body)
        : undefined,
    });

    if (!res.ok) {
      let errorMessage = "Mutation failed";
      try {
        const errorData = await res.json();
        console.log("❌ Error response:", errorData);
        errorMessage = errorData?.message || errorData?.error || `Server error: ${res.status}`;
      } catch (e) {
        errorMessage = `Server error: ${res.status} ${res.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data = await res.json();
    console.log("✅ Success response:", data);
    return data;
  };

  const mutation = useMutation({
    mutationFn,
    onSuccess: () => {
      if (queryKey) queryClient.invalidateQueries({ queryKey });
    },
    ...mutationOptions,
  });

  return {
    ...mutation,
    execute: mutation.mutate,
    executeAsync: mutation.mutateAsync,
  };
}