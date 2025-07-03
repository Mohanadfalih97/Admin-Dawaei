import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import InputsVote from "../components/InputsVote";
import DateTimeSelector from "../components/DateTimeSelector";
import { toast } from "react-toastify";

const EditVote = () => {
  const { id } = useParams();
  const location = useLocation();
  const voteData = location.state;
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [dscrp, setDscrp] = useState("");
  const [file, setFile] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [finishDate, setFinishDate] = useState("");
  const [votecompletestatus, setVoteStatus] = useState(0);
  const [minMumbersVoted, setMinMumbersVoted] = useState(0);
  const [voteActveStatus, setVoteActveStatus] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false); // New state for update button
  const [voteOptions, setVoteOptions] = useState([]); // State for vote options

  // Fetch vote data and options
  useEffect(() => {
    const loadData = async () => {
      try {
        if (voteData) {
          setTitle(voteData.voteTitle || "");
          setDscrp(voteData.dscrp || "");
          setMinMumbersVoted(Number(voteData.minMumbersVoted) || 0);
          setStartDate(voteData.startDate || "");
          setFinishDate(voteData.finishDate || "");
          setFile(voteData.docUrl ? { name: voteData.docUrl } : null);
          setVoteStatus(voteData.votecompletestatus ?? 0);
          setVoteActveStatus(voteData.voteActveStatus ?? 0);
        } else {
          const res = await axios.get(`${process.env.REACT_APP_API_URL}vote/${id}`);
          const data = res.data.data.items[0];
          setTitle(data.voteTitle || "");
          setDscrp(data.dscrp || "");
          setMinMumbersVoted(Number(voteData.minMumbersVoted) || 0);
          setStartDate(data.startDate || "");
          setFinishDate(data.finishDate || "");
          setFile(data.docUrl ? { name: data.docUrl } : null);
          setVoteStatus(data.votecompletestatus ?? 0);
          setVoteActveStatus(data.voteActveStatus ?? 0);
        }

        // Fetch vote options based on the vote ID
        const optionsResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}vote-options`, {
            params: {
              VoteId: id,
            },
            headers: {
              "Accept-Language": "en",
              Accept: "application/json",
            }
          }
        );
        setVoteOptions(optionsResponse.data.data.items || []);
      } catch (err) {
        toast.error("❌ فشل تحميل بيانات التصويت");
      } 
    };

    loadData();
  }, [voteData, id]);

  // Handle add new option (POST request)
  const handleAddOption = async () => {
    try {
      const newOption = {
        voteId: id,
        voteDscrp: "", // Initial description for the new option
      };

      setSubmitting(true); // Disable buttons

      // Send POST request to create a new option
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}vote-options`,
        newOption,
        {
          headers: {
            "Accept-Language": "en",
            Accept: "application/json",
          },
        }
      );

      // Add the new option to the state
      setVoteOptions([...voteOptions, response.data.data]);

      toast.success("✅ تم إضافة خيار التصويت بنجاح");
    } catch (err) {
      console.error("❌ فشل في إضافة خيار التصويت:", err);
      toast.error("❌ حدث خطأ أثناء إضافة الخيار");
    } finally {
      setSubmitting(false); // Enable buttons
    }
  };

  // Handle change of an option
  const handleOptionChange = (index, value) => {
    const updatedOptions = [...voteOptions];
    updatedOptions[index].voteDscrp = value;
    setVoteOptions(updatedOptions);
  };

  // Handle delete option (DELETE request)
  const handleDeleteOption = async (index, optionId) => {
    const updatedOptions = [...voteOptions];
    updatedOptions.splice(index, 1);
    setVoteOptions(updatedOptions);

    try {
      setDeleting(true); // Disable buttons

      // Send DELETE request to remove the option (soft delete)
      await axios.delete(`${process.env.REACT_APP_API_URL}vote-options/${optionId}`, {
        headers: {
          "Accept-Language": "en",
          Accept: "application/json",
        },
      });

      toast.success("🗑️ تم حذف خيار التصويت بنجاح");
    } catch (err) {
      console.error("❌ فشل في حذف خيار التصويت:", err);
      toast.error("❌ حدث خطأ أثناء حذف الخيار");
    } finally {
      setDeleting(false); // Enable buttons
    }
  };

  // Handle update option (PUT request)
  const handleUpdateOption = async (optionId, updatedDescription) => {
    try {
      setIsUpdating(true); // Disable buttons

      await axios.put(
        `${process.env.REACT_APP_API_URL}vote-options/${optionId}`,
        {
          voteId: id,
          voteDscrp: updatedDescription,
        },
        {
          headers: {
            "Accept-Language": "en",
            Accept: "application/json",
          },
        }
      );
      toast.success("✅ تم تحديث خيار التصويت بنجاح");
    } catch (err) {
      console.error("❌ فشل في تحديث خيار التصويت:", err);
      toast.error("❌ حدث خطأ أثناء التحديث");
    } finally {
      setIsUpdating(false); // Enable buttons
    }
  };

  // Handle submit (edit vote)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true); // Disable buttons

    const formPayload = {
      voteTitle: title,
      dscrp,
      startDate,
      minMumbersVoted,
      finishDate,
      docUrl: file ? file.name : "",
      votecompletestatus,
      voteActveStatus,
      voteInfo: 0,
    };

    try {
      // 1. تعديل التصويت (إرسال الريكوست الأول)
      await axios.put(`${process.env.REACT_APP_API_URL}vote/${id}`, formPayload, {
        headers: {
          "Accept-Language": "en",
          Accept: "application/json",
        },
      });

      toast.success("✅ تم تعديل التصويت بنجاح");

      // 2. بعد تعديل التصويت بنجاح، نرسل طلب الحصول على الخيارات
      const optionsResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}vote-options`,
        {
          params: {
            VoteId: id,  // إرسال VoteId في المعاملات للحصول على الخيارات
          },
          headers: {
            "Accept-Language": "en",
            Accept: "application/json",
          },
        }
      );

      // 5. الانتقال إلى صفحة التصويت الرئيسية بعد التحديث
      navigate("/VotePageMain");

    } catch (err) {
      console.error("❌ فشل في تعديل التصويت:", err);
      toast.error("❌ حدث خطأ أثناء التعديل");
    } finally {
      setSubmitting(false); // Enable buttons
    }
  };

  // Handle delete vote
  const handleDelete = async () => {
    setDeleting(true); // Disable buttons
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}vote/${id}`, {
        headers: {
          "Accept-Language": "en",
          Accept: "application/json",
        },
      });
      toast.success("🗑️ تم حذف التصويت بنجاح");
      navigate("/VotePageMain");
    } catch (err) {
      console.error("❌ فشل في حذف التصويت:", err);
      toast.error("❌ حدث خطأ أثناء الحذف");
    } finally {
      setDeleting(false); // Enable buttons
    }
  };

  return (
    <section className="flex flex-col">
      <div className="flex flex-col items-end justify-end gap-1">
        <h1 className="text-3xl text-priamy font-semibold">تعديل التصويت</h1>
        <p className="text-lg font-normal text-gray-500">
          أدخل تفاصيل التصويت وخيارات المشاركين
        </p>
      </div>

      <form className="mt-5 p-5 box-border border rounded-lg" onSubmit={handleSubmit}>
        <div className="flex flex-col items-end justify-end gap-1 mb-4">
          <h2 className="text-2xl font-semibold">معلومات التصويت</h2>
          <p className="text-lg font-normal text-gray-500">
            أدخل العنوان والوصف وتفاصيل التصويت
          </p>
        </div>

        <InputsVote
          title={title}
          setTitle={setTitle}
          dscrp={dscrp}
          setDscrp={setDscrp}
          file={file}
          setFile={setFile}
          minMumbersVoted={minMumbersVoted}
          setMinMumbersVoted={setMinMumbersVoted}
        />

        <DateTimeSelector
          startDate={startDate}
          setStartDate={setStartDate}
          finishDate={finishDate}
          setFinishDate={setFinishDate}
        />

        <div className="w-full flex flex-col items-end mt-6" style={{ direction: "rtl" }}>
          <div className="w-full flex justify-between items-center">
            <h3 className="text-xl font-semibold">خيارات التصويت</h3>
            <button
              type="button"
              className="p-2.5 box-border border rounded-lg bg-blue-500 text-white"
              onClick={handleAddOption}
              disabled={submitting || deleting || isUpdating} // Disable when any request is in progress
            >
              إضافة خيار
            </button>
          </div>

          {voteOptions.map((option, index) => (
            <div key={index} className="flex gap-2 mt-2 w-full">
              <input
                type="text"
                value={option.voteDscrp}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="p-2 w-full border rounded-lg"
                placeholder={`الخيار ${index + 1}`}
                disabled={submitting || deleting || isUpdating} // Disable when any request is in progress
              />
              <button
                type="button"
                onClick={() => handleDeleteOption(index, option.id)}
                className="p-2.5 border rounded-lg bg-blue-500 text-white w-20"
                disabled={submitting || deleting || isUpdating} // Disable when any request is in progress
              >
                حذف
              </button>
              <button
                type="button"
                onClick={() => handleUpdateOption(option.id, option.voteDscrp)}
                className="p-2.5 border rounded-lg bg-blue-500 text-white w-20"
                disabled={submitting || deleting || isUpdating} // Disable when any request is in progress
              >
                تعديل
              </button>
            </div>
          ))}
        </div>

        <div className="w-full flex items-center justify-between mt-6" style={{ direction: "rtl" }}>
          <button
            type="submit"
            disabled={isUpdating}
            className={`p-2.5 box-border border rounded-lg w-32 transition text-white ${submitting ? "bg-gray-400 cursor-not-allowed" : "bg-priamy hover:bg-blue-800"}`}
          >
            {submitting ? "جاري التعديل..." : "تعديل التصويت"}
          </button>

          <button
            type="button"
            disabled={deleting}
            className={`p-2.5 box-border border rounded-lg w-32 transition text-white ${deleting ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"}`}
            onClick={handleDelete}
          >
            {deleting ? "جارٍ الحذف..." : "حذف التصويت"}
          </button>
        </div>

      </form>
    </section>
  );
};

export default EditVote;
