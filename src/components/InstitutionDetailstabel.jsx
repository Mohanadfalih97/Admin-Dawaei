import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import defaultProfileImage from "../asset/Imge/profiledefautimg.png";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";




const InstitutionDetailstabel = () => {
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


 const fetchInstitutions = async (page = 1) => {
  try {
    setLoading(true);
    const token = localStorage.getItem("token");

    const response = await fetch(`${process.env.REACT_APP_API_URL}institution?pageNumber=${page}&pageSize=10`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Accept-Language": "en",
      },
    });

    const result = await response.json();

    if (response.ok && result.data?.items) {
      setInstitutions(result.data.items);
      setTotalPages(result.data.totalPages || 1);
      setCurrentPage(result.data.pageNumber || 1);
    } else {
      toast.error(" فشل جلب البيانات");
    }
  } catch (error) {
    toast.error(" خطأ أثناء الجلب");
  } finally {
    setLoading(false);
  }
};


useEffect(() => {
  fetchInstitutions(currentPage);
}, [currentPage]);

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages && page !== currentPage) {
    fetchInstitutions(page);
  }
};


const navigate = useNavigate();

const handleEditCompany = (company) => {
  navigate(`/Editinstitution/${company.id}`, { state: { company } });
};

const handleDeleteCompany = async (id) => {

  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${process.env.REACT_APP_API_URL}institution/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Accept-Language": "en",
      },
    });

    if (response.ok) {
      toast.success(" تم حذف المؤسسة بنجاح");

      // تحديث القائمة بعد الحذف
      setInstitutions((prev) => prev.filter((item) => item.id !== id));
    } else {
      const result = await response.json();
      throw new Error(result.msg || "فشل الحذف");
    }
  } catch (error) {
    toast.error(error.message);
  }
};


  return (
    <div className="container mx-auto mt-5 p-5 border rounded-lg shadow-md" dir="rtl">
      {/* رأس الصفحة */}
      <div className="flex flex-col-reverse md:flex-row md:items-center justify-between gap-4 mb-4" style={{ direction: "ltr" }}>
        <Link
          to="/Add-institution"
          className="bg-primary text-center py-2 px-4 text-white rounded-md hover:bg-primary-dark transition duration-300 w-full md:w-auto"
        >
          إنشاء فورم
        </Link>
        <h1 className="text-2xl md:text-3xl text-primary font-semibold text-center md:text-right">
          تفاصيل المؤسسة
        </h1>
      </div>

      {/* جدول تفاصيل المؤسسات */}
      {loading ? (
        <p className="text-center text-gray-600">جاري تحميل البيانات...</p>
      ) : institutions.length === 0 ? (
        <p className="text-center text-red-600">لا توجد مؤسسات</p>
      ) : (
        <table className="w-full table-auto border-collapse text-center mb-8">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 border">اسم المؤسسة</th>
              <th className="px-4 py-2 border">الصورة</th>
              <th className="px-4 py-2 border">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {institutions.map((company) => (
              <tr key={company.id}>
                <td className="px-4 py-2 border">{company.institutionName}</td>
                <td className="px-4 py-2 border">
                  <img
                    src={company.imgUrl || defaultProfileImage}
                    alt="صورة المؤسسة"
                    className="w-16 h-16 object-cover mx-auto rounded"
                    onError={(e) => { e.target.onerror = null; e.target.src = defaultProfileImage; }}
                    
                  />
                </td>
                <td className="px-4 py-2 border space-x-2">
                  <button className="text-blue-600 hover:text-blue-800 mx-2" onClick={() => handleEditCompany(company)}>
                    <Pencil />
                  </button>
                  <button className="text-red-600 hover:text-red-800 mx-2" onClick={() => handleDeleteCompany(company.id)}>
                    <Trash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {totalPages > 1 && (
  <div className="flex justify-center items-center gap-2 mt-4">
    <button
      onClick={() => goToPage(currentPage - 1)}
      disabled={currentPage === 1}
      className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
    >
      السابق
    </button>

    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
      <button
        key={page}
        onClick={() => goToPage(page)}
        className={`px-3 py-1 border rounded ${
          page === currentPage ? "bg-primary text-white" : "bg-gray-100 hover:bg-gray-200"
        }`}
      >
        {page}
      </button>
    ))}

    <button
      onClick={() => goToPage(currentPage + 1)}
      disabled={currentPage === totalPages}
      className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
    >
      التالي
    </button>
  </div>
)}

    </div>
  );
};

export default InstitutionDetailstabel;
