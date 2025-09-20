import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import {
  getPatients,
  addPatient,
  updatePatient,
  deletePatient,
} from "../../api";
import { PatientForm } from "../../components/modals/patientForm.modal";
import {FileText, SquarePen, Trash} from "lucide-react";
import { CustomDataTable } from "../../components/data-table";
import { PatientDetailsModal } from "../../components/modals/patientDetails.modal";

export const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null); // for edit mode
  const [detailsPatient, setDetailsPatient] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Fetch all patients from backend
  const fetchPatients = async () => {
    try {
      setLoading(true);
      const { data } = await getPatients();
      setPatients(data);
    } catch (err) {
      console.error("Error fetching patients", err);
    } finally {
      setLoading(false);
    }
  };

  // Add or Update Patient
  const handleSubmitPatient = async (formData) => {
    try {
      if (editingPatient) {
        // update
        await updatePatient(editingPatient._id, formData);
      } else {
        // add new
        await addPatient(formData);
      }
      await fetchPatients();
      setIsModalOpen(false);
      setEditingPatient(null);
    } catch (err) {
      console.error("Error saving patient", err.response?.data || err.message);
    }
  };

  // Delete Patient
  const handleDeletePatient = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient?")) return;

    try {
      await deletePatient(id);
      await fetchPatients();
    } catch (err) {
      console.error("Error deleting patient", err.response?.data || err.message);
    }
  };

  // Columns for react-data-table
  const columns = [
    { name: "Patient ID", selector: (row) => row.patient_id, sortable: true },
    { name: "Admission", selector: (row) => row.admission_date?.slice(0, 10) },
    { name: "Discharge", selector: (row) => row.discharge_date?.slice(0, 10) },
    { name: "Age", selector: (row) => row.age, sortable: true },
    { name: "Sex", selector: (row) => row.sex },
    { name: "Ward", selector: (row) => row.ward },
    { name: "Procedure", selector: (row) => row.procedure_category },
    { name: "Outcome", selector: (row) => row.outcome },
    { name: "Cost", selector: (row) => row.treatment_cost_aud},
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          <button
          onClick={() => {
            setDetailsPatient(row);
            setIsDetailsOpen(true);
            console.log(detailsPatient)
          }}
          className="p-1 bg-blue-500 text-white rounded"
        >
          <FileText size={15} />
        </button>
          <button
            onClick={() => handleDeletePatient(row._id)}
            className="p-1 bg-red-600 text-white rounded"
          >
            <Trash size={15} />
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetchPatients();
  }, []);

  const customStyles = {
  tableWrapper: {
    style: {
      minHeight: "500px", // minimum height
      maxHeight: "600px", // optional max height
      overflowX: "auto",  // scroll if content overflows
    },
  },
};

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Patients</h1>
        <button
          onClick={() => {
            setEditingPatient(null);
            setIsModalOpen(true);
          }}
          className="bg-[#3742fa] text-white px-4 py-2 rounded font-semibold"
        >
          Add Patient
        </button>
      </div>

      <CustomDataTable
      columns={columns}
      data={patients}
      loading={loading}
      />


      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editingPatient ? "Edit Patient" : "Add Patient"}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingPatient(null);
                }}
                className="text-gray-600"
              >
                ✕
              </button>
            </div>
            <PatientForm
              onSubmit={handleSubmitPatient}
              defaultValues={editingPatient}
            />
          </div>
        </div>
      )}


      {isDetailsOpen && detailsPatient && (
        <PatientDetailsModal
          patient={detailsPatient}
          onClose={() => setIsDetailsOpen(false)}
        />
      )}
    </div>
  );
};
