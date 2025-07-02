import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="flex items-center justify-between">
      <Link
        to="/votes/create"
        className="bg-primary p-2.5 text-white rounded-md hover:bg-blue-600 transition duration-300"
      >
        إنشاء تصويت جديد
      </Link>
      <h1 className="text-3xl text-primary font-semibold">لوحة التحكم</h1>
    </div>
  );
};

export default Navbar;

