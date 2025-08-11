import React, { useState } from "react";
import MemberTable from "../components/Members/MemberTable";
import { Link } from "react-router-dom";

const Members = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = () => {
    setSearchTerm(searchInput);
  };

  return (
 

      <div className="mt-6 overflow-x-auto">
        <MemberTable searchTerm={searchTerm} />
      </div>
  );
};

export default Members;
