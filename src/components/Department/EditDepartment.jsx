import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../Ui/table";

const EditDepartment = () => {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}department/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Accept-Language": "en",
              Accept: "application/json",
            },
          }
        );

        const data = response.data.data;
        setName(data.departmentName || "");
      } catch (error) {
        toast.error("فشل تحميل بيانات القطاع");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartment();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("يرجى إدخال اسم القطاع");
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}department/${id}`,
        {
          departmentName: name.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Accept-Language": "en",
            Accept: "application/json",
          },
        }
      );

      toast.success("تم تحديث القطاع بنجاح");
      navigate("/Department");
    } catch (error) {
      toast.error("حدث خطأ أثناء التحديث");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 border p-6 rounded-lg shadow-md space-y-6" style={{ direction: "rtl" }}>
      <h2 className="text-2xl font-semibold text-center text-primary">تعديل بيانات القطاع</h2>

      {loading ? (
        <p className="text-center text-gray-600">جاري تحميل البيانات...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">الخاصية</TableHead>
                <TableHead className="text-center">القيمة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>اسم القطاع</TableCell>
                <TableCell>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border px-4 py-2 rounded w-full text-center"
                    disabled={isSubmitting}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2} className="text-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`bg-blue-600 w-full text-white px-6 py-2 mt-4 rounded hover:bg-blue-700 transition ${
                      isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSubmitting ? "جارٍ التحديث..." : "تحديث"}
                  </button>
               
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </form>
      )}
    </div>
  );
};

export default EditDepartment;
