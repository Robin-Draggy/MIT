import { X } from "lucide-react";
import React from "react";

export const PatientDetailsModal = ({ patient, onClose }) => {
  if (!patient) return null;

  const formatFlag = (val) => (val === 1 ? "Yes" : val === 0 ? "No" : val);

  const details = [
    { label: "Patient ID", value: patient.patient_id },
    { label: "Admission Date", value: new Date(patient.admission_date).toLocaleDateString() },
    { label: "Discharge Date", value: new Date(patient.discharge_date).toLocaleDateString() },
    { label: "Length of Stay (days)", value: patient.length_of_stay_days },
    { label: "Age", value: patient.age },
    { label: "Sex", value: patient.sex },
    { label: "Procedure Category", value: patient.procedure_category },
    { label: "Ward", value: patient.ward },
    { label: "Severity Score (1–10)", value: patient.severity_score_1_10 },
    { label: "Comorbidity Count", value: patient.comorbidity_count },
    { label: "Complications", value: formatFlag(patient.complications_flag) },
    { label: "Days to Stable", value: patient.days_to_stable },
    { label: "Treatment Cost (AUD)", value: patient.treatment_cost_aud },
    { label: "Insurance Type", value: patient.insurance_type },
    { label: "Outcome", value: patient.outcome },
    { label: "Discharge Disposition", value: patient.discharge_disposition },
    { label: "Readmission in 30 Days", value: formatFlag(patient.readmission_30d) },
    { label: "Mortality", value: formatFlag(patient.mortality_flag) },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl overflow-y-auto max-h-[90vh] p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b pb-2">
          <h2 className="text-2xl font-semibold text-gray-800">Patient Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition cursor-pointer">
            <X size={24} />
          </button>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {details.map((item) => (
            <div
              key={item.label}
              className="flex flex-col border rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition"
            >
              <span className="text-gray-500 text-sm font-medium">{item.label}</span>
              <span className="text-gray-800 font-semibold">{item.value ?? "-"}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
