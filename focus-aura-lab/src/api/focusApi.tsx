import axios from "axios";

const BASE_URL = "http://localhost:8080/api/focus";

export const getAllBlocks = async () => {
  const res = await axios.get(`${BASE_URL}/blocks`);
  return res.data;
};

export const addBlock = async (block: { url?: string; name?: string; fileName?: string; path?: string }) => {
  // Map frontend params to backend BlockItem structure
  const body = {
    name: block.name,
    type: block.url ? "website" : "app",
    url: block.url,
    path: block.path || block.fileName // Use path for apps, fallback to fileName
  };
  const res = await axios.post(`${BASE_URL}/add`, body);
  return res.data;
};

export const removeBlock = async (id: number) => {
  await axios.delete(`${BASE_URL}/remove/${id}`);
};

export const startFocus = async () => {
  const res = await fetch(`${BASE_URL}/start`, { // Spring Boot URL
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  return res.json();
};

export const stopFocus = async () => {
  const res = await fetch(`${BASE_URL}/stop`, { // Spring Boot URL
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  return res.json();
};
