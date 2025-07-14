import React, { useState } from "react";
import defaultProfileImage from "../asset/Imge/profiledefautimg.png";
import { Camera } from "lucide-react";
import { toast } from "react-toastify";
import {useNavigate} from "react-router-dom"

const CreateInstitution = () => {
  const [institutionName, setInstitutionName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!institutionName.trim()) {
      toast.error("❌ يرجى إدخال اسم المؤسسة");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("token");
    let uploadedImgUrl = "";

    try {
      // 1. رفع الصورة أولًا إن وجدت
      if (imageFile) {
        const imageForm = new FormData();
        imageForm.append("file", imageFile);

        const uploadResponse = await fetch(`${process.env.REACT_APP_API_URL}attachments`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Accept-Language": "en",
          },
          body: imageForm,
        });

        const uploadResult = await uploadResponse.json();

        if (!uploadResponse.ok || !uploadResult.data) {
          throw new Error(uploadResult.msg || "فشل رفع الصورة");
        }

        const baseUrl = process.env.REACT_APP_API_URL.replace(/\/api\/?$/, "");
        uploadedImgUrl = uploadResult.data.startsWith("http")
          ? uploadResult.data
          : `${baseUrl}/uploads/${uploadResult.data}`;
      }

      // 2. إرسال بيانات المؤسسة
      const payload = {
        institutionName,
        imgUrl: uploadedImgUrl,
      };

      const response = await fetch(`${process.env.REACT_APP_API_URL}institution`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": "en",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("✅ تم إنشاء المؤسسة بنجاح");
        setInstitutionName("");
        setImageFile(null);
        setImagePreview(null);
        navigate("/InstitutionDetails");

      } else {
        throw new Error(result.msg || "فشل إنشاء المؤسسة");
      }
    } catch (err) {
      toast.error("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-6 space-y-4">
      <div className="flex flex-col items-center gap-2">
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-300 shadow-md group">
          <img
            src={imagePreview || defaultProfileImage}
            alt="صورة المؤسسة"
            className="w-full h-full object-cover"
          />
          <input
            type="file"
            accept="image/*"
            id="imageUpload"
            onChange={handleImageChange}
            className="hidden"
          />
          <label
            htmlFor="imageUpload"
            className="absolute inset-0 bg-black bg-opacity-40 flex justify-center items-center text-white text-2xl cursor-pointer opacity-0 group-hover:opacity-100 transition"
          >
            <Camera className="w-6 h-6" />
          </label>
        </div>
        <small className="text-gray-500">اضغط على الصورة لتغييرها</small>
      </div>

      <input
        type="text"
        placeholder="اسم المؤسسة"
        className="w-full border rounded px-4 py-2 text-center"
        value={institutionName}
        onChange={(e) => setInstitutionName(e.target.value)}
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-white rounded py-2 hover:bg-primary-dark transition"
      >
        {loading ? "جاري الإرسال..." :"حفظ"}
      </button>
    </form>
  );
};

export default CreateInstitution;
