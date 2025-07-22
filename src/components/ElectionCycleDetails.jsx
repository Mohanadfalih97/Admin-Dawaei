import React, { useEffect, useState } from "react";
import axios from "axios";

const PAGE_SIZE = 5;

const ElectionCycleDetails = () => {
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
        const token = localStorage.getItem("token"); // ✅ احصل على التوكن


  const fetchDetails = async (pageNumber) => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}election-cycle-details`,
        {
          params: {
            PageNumber: pageNumber,
            PageSize: PAGE_SIZE,
          },
          headers: {
             Authorization: `Bearer ${token}`,
            "Accept-Language": "en",
            Accept: "application/json",
          },
        }
      );

      if (response.status === 200 && response.data?.data?.items) {
        setDetails(response.data.data.items);
        setTotalPages(response.data.data.totalPages || 1);
      } else {
        setError("فشل في تحميل البيانات.");
      }
    } catch (err) {
      console.error(err);
      setError("حدث خطأ أثناء تحميل البيانات.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails(page);
  }, [page]);

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const goToPage = (pageNumber) => {
    if (pageNumber !== page) setPage(pageNumber);
  };

  return (
    <div className="border-2 rounded-lg shadow-sm p-4 bg-white mt-5" style={{ direction: "rtl" }}>
      <h2 className="text-xl font-bold mb-4">تفاصيل الدورات الانتخابية</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">رقم الدورة</th>
              <th className="px-4 py-2">اسم العضو</th>
              <th className="px-4 py-2">تاريخ الإنشاء</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3" className="text-center py-4">جاري التحميل...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="3" className="text-center text-red-600 py-4">{error}</td>
              </tr>
            ) : details.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-4">لا توجد بيانات.</td>
              </tr>
            ) : (
              details.map((item, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">{item.cycleId}</td>
                  <td className="px-4 py-2">{item.memberName}</td>
                  <td className="px-4 py-2">
                    {new Date(item.createdAt).toLocaleString("ar-IQ")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center items-center gap-2 mt-4" >
          <button
            onClick={handlePrev}
            disabled={page === 1}
            className="px-3 py-1 border rounded bg-gray-200 disabled:opacity-50"
          >
            السابق
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => goToPage(pageNum)}
              className={`px-3 py-1 border rounded 
                ${pageNum === page ? "bg-blue-600 text-white" : "bg-white hover:bg-gray-100"}`}
            >
              {pageNum}
            </button>
          ))}

          <button
            onClick={handleNext}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded bg-gray-200 disabled:opacity-50"
          >
            التالي
          </button>
        </div>
      )}
    </div>
  );
};

export default ElectionCycleDetails;
