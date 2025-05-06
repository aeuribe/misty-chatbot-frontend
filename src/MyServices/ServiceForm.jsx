import React, { useState } from "react";

const ServiceForm = ({ onSubmit, onCancel, loading, initialData }) => {
  const initialForm = {
    service_name: "",
    description: "",
    duration_min: "",
    price: "",
  };

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  // Validación simple
  const validate = () => {
    const newErrors = {};
    if (!form.service_name) newErrors.service_name = "Name is required";
    if (!form.description) newErrors.description = "Description is required";
    if (
      !form.duration_min ||
      isNaN(form.duration_min) ||
      form.duration_min <= 0
    )
      newErrors.duration_min = "Duration must be a positive number";
    if (!form.price || isNaN(form.price) || form.price <= 0)
      newErrors.price = "Price must be a positive number";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  React.useEffect(() => {
    setForm(initialData || initialForm);
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(form);
      setForm(initialForm);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-md w-full max-w-lg p-6 mx-auto"
    >
      <h2 className="text-lg font-semibold mb-4">Register New Service</h2>

      {/* Name */}
      <div className="mb-4">
        <label
          className="block text-sm font-medium mb-1"
          htmlFor="service_name"
        >
          Name
        </label>
        <input
          type="text"
          name="service_name"
          id="service_name"
          value={form.service_name}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none ${
            errors.service_name ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Service name"
        />
        {errors.service_name && (
          <p className="text-xs text-red-500 mt-1">{errors.service_name}</p>
        )}
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1" htmlFor="description">
          Description
        </label>
        <textarea
          name="description"
          id="description"
          value={form.description}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none ${
            errors.description ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Service description"
          rows={3}
        />
        {errors.description && (
          <p className="text-xs text-red-500 mt-1">{errors.description}</p>
        )}
      </div>

      {/* Duration */}
      <div className="mb-4">
        <label
          className="block text-sm font-medium mb-1"
          htmlFor="duration_min"
        >
          Duration (min)
        </label>
        <input
          type="number"
          name="duration_min"
          id="duration_min"
          value={form.duration_min}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none ${
            errors.duration_min ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="60"
          min={1}
        />
        {errors.duration_min && (
          <p className="text-xs text-red-500 mt-1">{errors.duration_min}</p>
        )}
      </div>

      {/* Price */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1" htmlFor="price">
          Price ($)
        </label>
        <input
          type="number"
          name="price"
          id="price"
          value={form.price}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none ${
            errors.price ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="100"
          min={1}
          step={0.01}
        />
        {errors.price && (
          <p className="text-xs text-red-500 mt-1">{errors.price}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 mt-6">
        <button
          type="button"
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
};

export default ServiceForm;
