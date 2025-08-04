import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import defaultProfileImage from "../asset/Imge/profiledefautimg.png";
import { useNavigate } from "react-router-dom";

const AssignMembersToElection = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [electionCycles, setElectionCycles] = useState([]);
  const [selectedCycleId, setSelectedCycleId] = useState("");
  const [changes, setChanges] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const response = await axios.get(`${process.env.REACT_APP_API_URL}members`, {
          params: { pageNumber: currentPage, pageSize: 10 },
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Accept-Language": "ar",
          },
        });

        const items = response.data.data.items || [];
        setMembers(items);
        setTotalPages(response.data.data.totalPages);

        const assigned = items
          .filter((member) => member.cycleId && member.cycleId !== 0)
          .map((member) => member.id);

        setSelectedMembers(assigned);
      } catch (error) {
        console.error("حدث خطأ أثناء جلب الأعضاء:", error);
        toast.error("فشل في تحميل قائمة الأعضاء");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [currentPage]);

  useEffect(() => {
    const fetchCycles = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${process.env.REACT_APP_API_URL}elections-cycles`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Accept-Language": "ar",
          },
        });

        const cycles = response.data.data.items || [];
        setElectionCycles(cycles);

        const activeCycle = cycles.find((c) => c.voteActveStatus === 1);
        if (activeCycle) {
          setSelectedCycleId(activeCycle.id.toString());
        }
      } catch (error) {
        console.error("فشل في تحميل الدورات:", error);
        toast.error("حدث خطأ أثناء جلب الدورات الانتخابية");
      }
    };

    fetchCycles();
  }, []);

  useEffect(() => {
    if (!selectedCycleId) {
      setSelectedMembers([]);
      setChanges([]);
      return;
    }

    const membersInCycle = members
      .filter((member) => member.cycleId === parseInt(selectedCycleId))
      .map((member) => member.id);

    setSelectedMembers(membersInCycle);
    setChanges([]);
  }, [selectedCycleId, members]);

  const toggleSelectMember = (memberId) => {
    setChanges((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );

    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const saveChanges = async () => {
    if (!selectedCycleId) {
      toast.warning("يرجى اختيار دورة انتخابية أولاً.");
      return;
    }

    const token = localStorage.getItem("token");
    setSaving(true);

    try {
      for (const memberId of changes) {
        const member = members.find((m) => m.id === memberId);
        if (!member) continue;

        const isSelected = selectedMembers.includes(memberId);
        const updatedMember = {
          ...member,
          cycleId: isSelected ? parseInt(selectedCycleId) : null,
        };

        await axios.put(`${process.env.REACT_APP_API_URL}members/${memberId}`, updatedMember, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Accept-Language": "ar",
          },
        });
      }

      toast.success("تم حفظ التغييرات بنجاح.");
      setChanges([]);
      navigate("/assign-members");
    } catch (error) {
      console.error("خطأ أثناء التحديث:", error);
      toast.error("فشل في تحديث بيانات الأعضاء.");
    } finally {
      setSaving(false);
    }
  };

  const goToPage = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="mt-5 p-3 md:p-6 border rounded-lg shadow-md overflow-x-auto" style={{ direction: "rtl" }}>
      <h1 className="text-2xl md:text-3xl text-primary font-semibold text-center mb-6 text-right">
        إسناد الأعضاء للدورة الانتخابية
      </h1>

      <div className="mb-6 text-right">
        <label htmlFor="cycleSelect" className="block mb-2 font-semibold">
          اختر الدورة الانتخابية:
        </label>
        <select
          id="cycleSelect"
          value={selectedCycleId}
          onChange={(e) => setSelectedCycleId(e.target.value)}
          className="border rounded px-3 py-2 w-full md:w-1/3"
        >
          <option value="">-- اختر الدورة --</option>
          {electionCycles.map((cycle) => (
            <option key={cycle.id} value={cycle.id}>
              {cycle.dscrp}
            </option>
          ))}
        </select>
      </div>

      <table className="min-w-full table-auto border-collapse">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 border text-center">اسم العضو</th>
            <th className="px-4 py-2 border text-center">المنصب</th>
            <th className="px-4 py-2 border text-center">القسم</th>
            <th className="px-4 py-2 border text-center">صورة العضو</th>
            <th className="px-4 py-2 border text-center">إضافة للدورة</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan="5" className="text-center py-4">جاري التحميل...</td></tr>
          ) : members.length === 0 ? (
            <tr><td colSpan="5" className="text-center text-red-500 py-4">لا توجد بيانات.</td></tr>
          ) : (
            members.map((member) => (
              <tr key={member.id} className="hover:bg-gray-100">
                <td className="px-4 py-2 border text-center text-gray-800">{member.fullName}</td>
                <td className="px-4 py-2 border text-center text-gray-800">{member.position}</td>
                <td className="px-4 py-2 border text-center text-gray-800">{member.department}</td>
                <td className="px-4 py-2 border text-center">
                  <img
                    src={member.imgUrl || defaultProfileImage}
                    alt="صورة العضو"
                    className="w-12 h-12 rounded-r object-cover mx-auto"
                    onError={(e) => { e.target.onerror = null; e.target.src = defaultProfileImage; }}
                  />
                </td>
                <td className="px-4 py-2 border text-center">
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(member.id)}
                    onChange={() => toggleSelectMember(member.id)}
                    className="w-5 h-5"
                    disabled={!selectedCycleId}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="text-center mt-6 flex">
        <button
          onClick={saveChanges}
          disabled={loading || saving}
          className={`w-3/12 text-white rounded py-2 transition
            ${loading || saving ? "bg-gray-400 cursor-not-allowed" : "bg-primary hover:bg-primary-dark"}`}
        >
          {saving ? "جارٍ الحفظ..." : "حفظ التغييرات"}
        </button>
      </div>

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

export default AssignMembersToElection;
