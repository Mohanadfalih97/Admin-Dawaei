import React, { useState } from "react";
import { Link } from "react-router-dom";
import VoteTable from "../components/Vote/VoteTable";

const VoteMainPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
const [filterStatus] = useState("");

  const handleSearch = () => {
    setSearchTerm(searchInput);
  };

  return (
    <div className="mt-5 p-3 md:p-6 border rounded-lg shadow-md" style={{ direction: "rtl" }}>
      <div className="flex flex-col-reverse md:flex-row md:items-center justify-between gap-4 mb-4" style={{ direction: "ltr" }}>
        <Link
          to="/votes/create"
          className="bg-primary text-center py-2 px-4 text-white rounded-md hover:bg-primary-dark transition duration-300 w-full md:w-auto"
        >
          إنشاء تصويت جديد
        </Link>
        <h1 className="text-2xl md:text-3xl text-primary font-semibold text-center md:text-right">
          التصويتات
        </h1>
      </div>

      {/* ✅ حقل البحث وزر البحث */}
      <div className="flex flex-col md:flex-row sm:flex-col   items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="ابحث عن وصف التصويت..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="border rounded px-4 py-2 w-full md:flex-1"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white w-40 px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          بحث
        </button>
      </div>

      <div className="overflow-x-auto">
        <VoteTable searchTerm={searchTerm} filterStatus={filterStatus} />
      </div>
    </div>
  );
};

export default VoteMainPage;
