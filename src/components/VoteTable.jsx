import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';


const VoteTable = ({ searchTerm, filterStatus }) => {
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const fetchVotes = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}vote`, {
          params: {
            PageNumber: currentPage,
            PageSize: pageSize,
          },
          headers: {
            "Accept-Language": "en",
            Accept: "application/json",
          },
        });

        const data = response.data.data;
        setVotes(data.items || []);
        setTotalPages(data.totalPages || 1);
        setPageSize(data.pageSize || 5);
      } catch (err) {
 toast.error("فشل في تحميل البيانات");      } finally {
        setLoading(false);
      }
    };

    fetchVotes();
  }, [currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  const filteredVotes = votes.filter((vote) => {
    const matchesSearch = vote.dscrp?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus ? vote.votecompletestatus === filterStatus : true;
    return matchesSearch && matchesStatus;
  });

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="mt-5 p-5 border rounded-lg shadow-md" style={{ direction: "rtl" }}>
      <h1 className="text-2xl font-semibold mb-4">قائمة التصويتات</h1>


      <table className="w-full table-auto border-collapse text-center">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 border">العدد</th>
            <th className="px-4 py-2 border">وصف التصويت</th>
            <th className="px-4 py-2 border">نسبة التصويت (%)</th>
            <th className="px-4 py-2 border">حالة النصاب</th>
            <th className="px-4 py-2 border">حالة التصويت</th>
            <th className="px-4 py-2 border">إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan="6" className="py-4">جاري التحميل...</td></tr>
          ) : filteredVotes.length === 0 ? (
            <tr><td colSpan="6" className="py-4 text-red-600">لا توجد نتائج مطابقة</td></tr>
          ) : (
            filteredVotes.map((vote) => (
              <tr key={vote.id} className="hover:bg-gray-100">
                <td className="px-4 py-2 border">{vote.id}</td>
                <td className="px-4 py-2 border">{vote.dscrp || "بدون وصف"}</td>
                <td className="px-4 py-2 border">--</td>
                <td className="px-4 py-2 border">
                  <span className="inline-block w-4 h-4 rounded-full bg-gray-300" title="غير معروف"></span>
                </td>
                <td className="px-4 py-2 border">--</td>
                <td className="px-4 py-2 border">
               <Link to={`/EditVote/${vote.id}`} state={{
  voteTitle: vote.voteTitle,
  dscrp: vote.dscrp,
  startDate: vote.startDate,
  finishDate: vote.finishDate,
  docUrl: vote.docUrl,
  voteInfo: vote.voteInfo,
  minMumbersVoted:vote.minMumbersVoted,
  votecompletestatus: vote.votecompletestatus,               // ✅ مضاف حديثًا
  voteActveStatus: vote.voteActveStatus,     // ✅ مضاف حديثًا
}}>

                    <button className="bg-blue-500 text-white text-xs font-bold p-3 rounded-full">تعديل</button>
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

   {totalPages > 1 && (
  <div className="flex justify-center items-center mt-6 gap-2 flex-wrap">
    <button
      onClick={() => goToPage(currentPage - 1)}
      disabled={currentPage === 1}
      className="px-3 py-1 border rounded disabled:opacity-50"
    >
      السابق
    </button>

    {(() => {
      const visiblePages = 5;
      const currentGroup = Math.floor((currentPage - 1) / visiblePages);
      const startPage = currentGroup * visiblePages + 1;
      const endPage = Math.min(startPage + visiblePages - 1, totalPages);

      return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((pageNum) => (
        <button
          key={pageNum}
          onClick={() => goToPage(pageNum)}
          className={`px-3 py-1 border rounded ${pageNum === currentPage ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'}`}
        >
          {pageNum}
        </button>
      ));
    })()}

    <button
      onClick={() => goToPage(currentPage + 1)}
      disabled={currentPage === totalPages}
      className="px-3 py-1 border rounded disabled:opacity-50"
    >
      التالي
    </button>
  </div>
)}

    </div>
  );
};

export default VoteTable;
