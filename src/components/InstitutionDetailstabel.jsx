import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";

const InstitutionDetailstabel = () => {
  const [filteredVotes, setFilteredVotes] = useState([]);


  // بيانات وهمية للمؤسسة
  const company = {
    name: "مؤسسة الأمل للتنمية",
    imageUrl: "/images/company-logo.png", // تأكد من وجود الصورة في public/images أو مسار مناسب
  };

  // بيانات تصويتات وهمية
  useEffect(() => {
    setTimeout(() => {
      setFilteredVotes([
        {
          id: 1,
          voteTitle: "تصويت 1",
          dscrp: "وصف التصويت 1",
          startDate: "2025-07-01",
          finishDate: "2025-07-10",
          docUrl: "",
          voteInfo: "",
          minMumbersVoted: 10,
          votecompletestatus: 0,
          voteActveStatus: 1,
          cycleId: 5,
        },
      ]);
    }, 1000);
  }, []);

  const updateVoteStatus = (vote, field, value) => {
    const updatedVotes = filteredVotes.map((v) =>
      v.id === vote.id ? { ...v, [field]: value } : v
    );
    setFilteredVotes(updatedVotes);
    console.log("Updated", vote.id, field, value);
  };

  const handleEditCompany = () => {
    alert("تعديل المؤسسة");
  };

  const handleDeleteCompany = () => {
    if (window.confirm("هل أنت متأكد من حذف المؤسسة؟")) {
      alert("تم الحذف (وهميًا)");
    }
  };

  return (
    <div className="container mx-auto  mt-5 p-5 border rounded-lg shadow-md" dir="rtl">
      {/* رأس الصفحة */}
      <div className="flex flex-col-reverse md:flex-row md:items-center justify-between gap-4 mb-4" style={{ direction: "ltr" }}>
        <Link
          to="/votes/create"
          className="bg-primary text-center py-2 px-4 text-white rounded-md hover:bg-primary-dark transition duration-300 w-full md:w-auto"
        >
          إنشاء  فورم 
        </Link>
        <h1 className="text-2xl md:text-3xl text-primary font-semibold text-center md:text-right">
          تفاصيل المؤسسة
        </h1>
      </div>

      {/* تفاصيل المؤسسة */}
      <table className="w-full table-auto border-collapse text-center mb-8">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 border">اسم المؤسسة</th>
            <th className="px-4 py-2 border">صورة</th>
            <th className="px-4 py-2 border">إجراءات</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="px-4 py-2 border">{company.name}</td>
            <td className="px-4 py-2 border">
              <img
                src={company.imageUrl}
                alt="صورة المؤسسة"
                className="w-16 h-16 object-cover mx-auto rounded"
              />
            </td>
            <td className="px-4 py-2 border space-x-2">
              <button className="text-blue-600 hover:text-blue-800 mx-2" onClick={handleEditCompany}>
                <Pencil />
              </button>
              <button className="text-red-600 hover:text-red-800 mx-2" onClick={handleDeleteCompany}>
                <Trash2 />
              </button>
            </td>
          </tr>
        </tbody>
      </table>


    </div>
  );
};

export default InstitutionDetailstabel;
