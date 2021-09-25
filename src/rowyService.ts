import axios from "axios";
import { generateServiceAccessToken } from "./metadataService";
const getAxiosInstance = async () => {
  const baseURL = "https://rowy.run/";
  const authToken = await generateServiceAccessToken(baseURL);
  return axios.create({
    baseURL: "https://rowy.run/",
    timeout: 1000,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + authToken,
    },
  });
};

const getAxiosRealtimeInstance = async () => {
  return axios.create({
    baseURL:
      "https://fir-demo-2-e272f-default-rtdb.asia-southeast1.firebasedatabase.app/",
    timeout: 1000,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const getExtension = async (
  extensionId: string
): Promise<{ dependencies: { [key: string]: string }; extension: string }> => {
  const axiosInstance =
    extensionId !== "twitterUpdate"
      ? await getAxiosInstance()
      : await getAxiosRealtimeInstance();
  return (
    await axiosInstance.get(
      `extensions/${extensionId}${
        extensionId === "twitterUpdate" ? ".json" : ""
      }`
    )
  ).data;
};
