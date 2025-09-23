import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api",
});

//
// --------------------- Patients APIs ---------------------
//

// 📌 Fetch all raw patients
export const getPatients = () => API.get("/patients");

// 📌 Add a new patient
export const addPatient = (data) => API.post("/patients", data);

// 📌 Update patient
export const updatePatient = (id, data) =>
  API.put(`/patients/${id}`, data);

// 📌 Delete patient
export const deletePatient = (id) =>
  API.delete(`/patients/${id}`);

// 📌 Fetch anonymized data (legacy patient anonymization)
export const getAnonymized = (k, l) =>
  API.get(`/patients/anonymized?k=${k}&l=${l}`);

//
// --------------------- Datasets APIs ---------------------
//

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

// 📌 Export anonymized dataset as CSV (download)
export const exportResults = (datasetId) => {
  window.open(`${API.defaults.baseURL}/datasets/${datasetId}/export`, "_blank");
};
