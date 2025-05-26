import React from "react";

const CompanyInfo = ({ editableBusiness, onInputChange, onSave }) => {
  return (
    <section className="mb-8 bg-white rounded-xl p-6 shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-[#343C6A]">
        Company Information
      </h2>
      <div className="space-y-4 max-w-md">
        <div>
          <label
            htmlFor="businessName"
            className="block font-medium text-gray-700 mb-1"
          >
            Business Name
          </label>
          <input
            id="businessName"
            name="business_name"
            type="text"
            value={editableBusiness.business_name}
            onChange={onInputChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label
            htmlFor="address"
            className="block font-medium text-gray-700 mb-1"
          >
            Address
          </label>
          <input
            id="address"
            name="address"
            type="text"
            value={editableBusiness.address}
            onChange={onInputChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block font-medium text-gray-700 mb-1"
          >
            Email (read-only)
          </label>
          <input
            id="email"
            type="email"
            value={editableBusiness.email}
            readOnly
            className="w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 cursor-not-allowed"
          />
        </div>
        <div>
          <label
            htmlFor="number"
            className="block font-medium text-gray-700 mb-1"
          >
            Phone Number (read-only)
          </label>
          <input
            id="number"
            type="text"
            value={editableBusiness.number}
            readOnly
            className="w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 cursor-not-allowed"
          />
        </div>
        <button
          onClick={onSave}
          className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition"
        >
          Save Changes
        </button>
      </div>
    </section>
  );
};

export default CompanyInfo;
