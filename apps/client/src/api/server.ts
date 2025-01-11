import { appConfig } from "@/lib/config";
import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import {
  TSignupSchema,
  TSigninSchema,
  TWatchListItemSchema,
} from "@screen-guide/types";

interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    _id: string;
    email: string;
  };
}

type Watchlist = {
  name: string;
  imageUrl: string;
  rating: number;
  releaseDate: string;
  _id: string;
  type: "movie" | "tv";
  duration?: string;
  mediaId: number;
}[];

interface WatchListResponse {
  success: boolean;
  data: {
    items: Watchlist;
  };
}

interface WatchListActionResponse {
  success: boolean;
  message: string;
  data: Watchlist;
}

export const handleApiError = (
  error: unknown,
  defaultMessage: string
): never => {
  if (error instanceof AxiosError) {
    const errorMessage = error.response?.data?.message || error.message;
    throw errorMessage;
  }
  throw error instanceof Error ? error : defaultMessage;
};

const apiClient: AxiosInstance = axios.create({
  baseURL: appConfig.expressServerBaseUrl || "http://localhost:8080",
  headers: {
    Accept: "application/json",
  },
});

export const signIn = async (body: TSigninSchema): Promise<AuthResponse> => {
  try {
    const response: AxiosResponse<AuthResponse> = await apiClient.post(
      `/auth/signin`,
      body
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, "An unknown error occurred");
  }
};

export const signUp = async (body: TSignupSchema): Promise<AuthResponse> => {
  try {
    const response: AxiosResponse<AuthResponse> = await apiClient.post(
      "/auth/signup",
      body
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, "An unknown error occurred");
  }
};

export const addToWatchList = async (
  body: TWatchListItemSchema,
  token: string
): Promise<WatchListActionResponse> => {
  try {
    const response: AxiosResponse<WatchListActionResponse> =
      await apiClient.post("/user/addToWatchList", body, {
        headers: { Authorization: `Bearer ${token}` },
      });
    return response.data;
  } catch (error) {
    return handleApiError(error, "Failed to add to watchlist");
  }
};

export const removeFromWatchList = async (
  id: string,
  token: string
): Promise<WatchListActionResponse> => {
  try {
    const response: AxiosResponse<WatchListActionResponse> =
      await apiClient.patch(
        `/user/removeFromWatchList/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    return response.data;
  } catch (error) {
    console.log(error);
    return handleApiError(error, "Failed to remove from watchlist");
  }
};

export const getWatchList = async (
  token: string
): Promise<WatchListResponse> => {
  try {
    const response: AxiosResponse<WatchListResponse> = await apiClient.get(
      "/user/getWatchList",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, "Failed to fetch watchlist");
  }
};
