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
   const navigate = useNavigate();

  // جلب الأعضاء
 useEffect(() => {
  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}members`);
      const items = response.data.data.items || [];
      setMembers(items);

      // استخراج الأعضاء الذين لديهم دورة انتخابية
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
}, []);


  // جلب الدورات الانتخابية
  useEffect(() => {
    const fetchCycles = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}elections-cycles`);
        setElectionCycles(response.data.data.items || []);
      } catch (error) {
        console.error("فشل في تحميل الدورات:", error);
        toast.error("حدث خطأ أثناء جلب الدورات الانتخابية");
      }
    };

    fetchCycles();
  }, []);

  // عند تغيير الدورة المختارة، نحدد الأعضاء المرتبطين بها
  useEffect(() => {
    if (!selectedCycleId) {
      setSelectedMembers([]);
      return;
    }

    const membersInCycle = members
      .filter((member) => member.cycleId === parseInt(selectedCycleId))
      .map((member) => member.id);

    setSelectedMembers(membersInCycle);
    toast.info("تم تحميل الأعضاء المرتبطين بهذه الدورة.");
  }, [selectedCycleId, members]);

  // تحديث عضوية عضو في دورة
  const toggleSelectMember = async (memberId) => {
    const member = members.find((m) => m.id === memberId);
    if (!member) return;

    const isSelected = selectedMembers.includes(memberId);
    const newCycleId = isSelected ? 0 : parseInt(selectedCycleId);

    if (!selectedCycleId && !isSelected) {
      toast.warning("يرجى اختيار دورة انتخابية أولاً.");
      return;
    }

    try {
      const updatedMember = {
        ...member,
        cycleId: newCycleId,
      };

      await axios.put(`${process.env.REACT_APP_API_URL}members/${memberId}`, updatedMember, {
        headers: {
          Accept: "application/json",
          "Accept-Language": "ar",
        },
      });

      // تحديث الواجهة بعد نجاح العملية
      setSelectedMembers((prev) =>
        isSelected ? prev.filter((id) => id !== memberId) : [...prev, memberId]
      );

      toast.success(`تم ${isSelected ? "إزالة" : "إضافة"} العضو من الدورة بنجاح.`);
      navigate("/assign-members");
      window.location.reload()
    } catch (error) {
      console.error("خطأ أثناء التحديث:", error);
      toast.error("فشل في تحديث بيانات العضو.");
    }
  };

  return (
    <div className="mt-5 p-3 md:p-6 border rounded-lg shadow-md overflow-x-auto" style={{ direction: "rtl" }}>
      <h1 className="text-2xl md:text-3xl text-primary font-semibold text-center mb-6 text-right">
        إسناد الأعضاء للدورة الانتخابية
      </h1>

      {/* قائمة الدورات الانتخابية */}
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
    checked={member.cycleId !== 0}
    onChange={() => toggleSelectMember(member.id)}
    className="w-5 h-5"
  />
</td>

              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AssignMembersToElection;
