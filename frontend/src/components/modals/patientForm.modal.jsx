import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

export const PatientForm = ({ onSubmit, defaultValues }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: defaultValues || {},
  });

  // Reset form when defaultValues change (for edit)
  useEffect(() => {
    reset(defaultValues || {});
  }, [defaultValues, reset]);

  const submitHandler = (data) => {
    const parsedData = {
      ...data,
      age: Number(data.age),
      length_of_stay_days: Number(data.length_of_stay_days),
      severity_score_1_10: Number(data.severity_score_1_10),
      comorbidity_count: Number(data.comorbidity_count),
      complications_flag: Number(data.complications_flag),
      days_to_stable: Number(data.days_to_stable),
      treatment_cost_aud: Number(data.treatment_cost_aud),
      readmission_30d: Number(data.readmission_30d),
      mortality_flag: Number(data.mortality_flag),
    };
    onSubmit(parsedData);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      {/* Patient ID */}
      <div className="flex flex-col">
        <label className="font-medium">Patient ID</label>
        <input
          {...register("patient_id", { required: "Patient ID is required" })}
          className="border p-2 rounded"
        />
        {errors.patient_id && <p className="text-red-500">{errors.patient_id.message}</p>}
      </div>

      {/* Admission Date */}
      <div className="flex flex-col">
        <label className="font-medium">Admission Date</label>
        <input
          type="date"
          {...register("admission_date", { required: "Admission date is required" })}
          className="border p-2 rounded"
        />
        {errors.admission_date && <p className="text-red-500">{errors.admission_date.message}</p>}
      </div>

      {/* Discharge Date */}
      <div className="flex flex-col">
        <label className="font-medium">Discharge Date</label>
        <input
          type="date"
          {...register("discharge_date", { required: "Discharge date is required" })}
          className="border p-2 rounded"
        />
        {errors.discharge_date && <p className="text-red-500">{errors.discharge_date.message}</p>}
      </div>

      {/* Length of Stay */}
      <div className="flex flex-col">
        <label className="font-medium">Length of Stay (days)</label>
        <input
          type="number"
          {...register("length_of_stay_days", { required: true })}
          className="border p-2 rounded"
        />
      </div>

      {/* Age */}
      <div className="flex flex-col">
        <label className="font-medium">Age</label>
        <input
          type="number"
          {...register("age", { required: true })}
          className="border p-2 rounded"
        />
      </div>

      {/* Sex */}
      <div className="flex flex-col">
        <label className="font-medium">Sex</label>
        <select {...register("sex", { required: true })} className="border p-2 rounded">
          <option value="">Select Sex</option>
          <option value="Female">Female</option>
          <option value="Male">Male</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Procedure Category */}
      <div className="flex flex-col">
        <label className="font-medium">Procedure Category</label>
        <input
          {...register("procedure_category", { required: true })}
          className="border p-2 rounded"
        />
      </div>

      {/* Ward */}
      <div className="flex flex-col">
        <label className="font-medium">Ward</label>
        <input {...register("ward", { required: true })} className="border p-2 rounded" />
      </div>

      {/* Severity Score */}
      <div className="flex flex-col">
        <label className="font-medium">Severity Score (1–10)</label>
        <input
          type="number"
          {...register("severity_score_1_10", { required: true, min: 1, max: 10 })}
          className="border p-2 rounded"
        />
      </div>

      {/* Comorbidity Count */}
      <div className="flex flex-col">
        <label className="font-medium">Comorbidity Count</label>
        <input
          type="number"
          {...register("comorbidity_count", { required: true })}
          className="border p-2 rounded"
        />
      </div>

      {/* Complications */}
      <div className="flex flex-col">
        <label className="font-medium">Complications?</label>
        <select {...register("complications_flag", { required: true })} className="border p-2 rounded">
          <option value="">Select</option>
          <option value="0">No</option>
          <option value="1">Yes</option>
        </select>
      </div>

      {/* Days to Stable */}
      <div className="flex flex-col">
        <label className="font-medium">Days to Stable</label>
        <input
          type="number"
          {...register("days_to_stable", { required: true })}
          className="border p-2 rounded"
        />
      </div>

      {/* Treatment Cost */}
      <div className="flex flex-col">
        <label className="font-medium">Treatment Cost (AUD)</label>
        <input
          type="number"
          step="0.01"
          {...register("treatment_cost_aud", { required: true })}
          className="border p-2 rounded"
        />
      </div>

      {/* Insurance Type */}
      <div className="flex flex-col">
        <label className="font-medium">Insurance Type</label>
        <select {...register("insurance_type", { required: true })} className="border p-2 rounded">
          <option value="">Select Insurance</option>
          <option value="Public">Public</option>
          <option value="Private">Private</option>
          <option value="Self-pay">Self-pay</option>
        </select>
      </div>

      {/* Outcome */}
      <div className="flex flex-col">
        <label className="font-medium">Outcome</label>
        <input {...register("outcome", { required: true })} className="border p-2 rounded" />
      </div>

      {/* Discharge Disposition */}
      <div className="flex flex-col">
        <label className="font-medium">Discharge Disposition</label>
        <input
          {...register("discharge_disposition", { required: true })}
          className="border p-2 rounded"
        />
      </div>

      {/* Readmission 30 Days */}
      <div className="flex flex-col">
        <label className="font-medium">Readmission in 30 Days?</label>
        <select {...register("readmission_30d", { required: true })} className="border p-2 rounded">
          <option value="">Select</option>
          <option value="0">No</option>
          <option value="1">Yes</option>
        </select>
      </div>

      {/* Mortality */}
      <div className="flex flex-col">
        <label className="font-medium">Mortality</label>
        <select {...register("mortality_flag", { required: true })} className="border p-2 rounded">
          <option value="">Select</option>
          <option value="0">Alive</option>
          <option value="1">Deceased</option>
        </select>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="col-span-1 md:col-span-2 bg-blue-600 text-white py-2 px-4 rounded"
      >
        {defaultValues ? "Update Patient" : "Add Patient"}
      </button>
    </form>
  );
};
