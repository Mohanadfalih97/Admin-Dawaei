import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import defaultProfileImage from "../asset/Imge/profiledefautimg.png";
import { Camera } from "lucide-react";

const Editinstitution = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // ✅

  const [institutionName, setInstitutionName] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ تحميل البيانات من state أو من API كـ fallback
  useEffect(() => {
    const company = location.state?.company;
    if (company) {
      setInstitutionName(company.institutionName);
      setImagePreview(company.imgUrl);
    } else {
      fetchInstitution(); // fallback عند تحديث الصفحة مباشرة
    }
  }, [location.state]);

  const fetchInstitution = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.REACT_APP_API_URL}institution?id=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": "en",
        },
      });

      const result = await response.json();
      const institution = result.data?.items?.[0];
      if (response.ok && institution) {
        setInstitutionName(institution.institutionName);
        setImagePreview(institution.imgUrl);
      } else {
        toast.error("❌ لم يتم العثور على المؤسسة");
      }
    } catch (err) {
      toast.error("❌ خطأ أثناء تحميل البيانات");
    }
  };

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
    let uploadedImgUrl = imagePreview;

    try {
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);

        const uploadResponse = await fetch(`${process.env.REACT_APP_API_URL}attachments`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Accept-Language": "en",
          },
          body: formData,
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

      const payload = {
        institutionName,
        imgUrl: uploadedImgUrl,
      };

      const updateResponse = await fetch(`${process.env.REACT_APP_API_URL}institution/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": "en",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (updateResponse.ok) {
        toast.success("✅ تم تحديث المؤسسة بنجاح");
        navigate("/InstitutionDetails");
      } else {
        const error = await updateResponse.json();
        throw new Error(error.msg || "فشل التحديث");
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
        {loading ? "جاري التعديل..." : "تحديث"}
      </button>
    </form>
  );
};

export default Editinstitution;
