import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api",
});

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

// 📌 Fetch anonymized data
export const getAnonymized = (k, l) =>
  API.get(`/patients/anonymized?k=${k}&l=${l}`);
