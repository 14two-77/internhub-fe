import type { DataResponse } from "../types/internship";

export const getOpenings = async (): Promise<DataResponse> => {
  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/openings`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return await response.json();
};
