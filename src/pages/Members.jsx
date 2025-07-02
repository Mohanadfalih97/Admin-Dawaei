import React, { useState } from "react";
import MemberTable from "../components/MemberTable";
import { Link } from "react-router-dom";

const Members = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = () => {
    setSearchTerm(searchInput);
  };

  return (
    <div className="mt-5 p-3 md:p-6 border rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4" style={{ direction: "ltr" }}>
        <div className="order-2 md:order-1">
          <Link to="/AddMember">
            <button className="w-full md:w-44 bg-primary text-white py-2 px-4 rounded-lg transition hover:bg-primary-dark">
              إضافة عضو
            </button>
          </Link>
        </div>

        <div className="flex items-center justify-center gap-2 order-1 md:order-2">
          <p className="text-md md:text-lg text-gray-600">(عضو 26)</p>
          <h1 className="text-xl md:text-3xl text-primary font-semibold">الأعضاء</h1>
        </div>
      </div>

      {/* ✅ حقل البحث وزر البحث */}
      <div className="mt-4 flex gap-2 flex-row " style={{ direction: "rtl" }}>
        <input
          type="text"
          className="w-full py-2 px-4 border rounded-lg text-right"
          placeholder="بحث عن عضو..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 w-40 text-white px-4 rounded hover:bg-blue-700 transition"
        >
          بحث
        </button>
      </div>

      <div className="mt-6 overflow-x-auto">
        <MemberTable searchTerm={searchTerm} />
      </div>
    </div>
  );
};

export default Members;
