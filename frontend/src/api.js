import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api",
});

export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);



// 📌 Upload dataset (CSV file)
export const uploadDataset = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await API.post("/datasets/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res; // { datasetId, name, columns, counts, data }
};

// 📌 Run anonymization
export const runAnonymization = async (datasetId, config) => {
  const res = await API.post(`/datasets/${datasetId}/run`, config);
  return res.data; // { message, counts, metrics, config }
};

// 📌 Get anonymization results
export const getResults = async (datasetId) => {
  const res = await API.get(`/datasets/${datasetId}/results`);
  return res; // { datasetId, name, counts, data, config }
};



// Export anonymized results (CSV)
export const exportResults = (datasetId) =>
  API.get(`/datasets/${datasetId}/export`, {
    responseType: "blob", // <-- Important!
  });
