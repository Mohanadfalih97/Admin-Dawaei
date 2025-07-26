import React, { useEffect, useState, useCallback } from "react";
import { useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import defaultProfileImage from "../../asset/Imge/profiledefautimg.png";
import { Camera } from "lucide-react";

const EditInstitution = () => {
  const { id } = useParams();
  const locationData = useLocation();

  const [institutionName, setInstitutionName] = useState("");
  const [location, setLocation] = useState("");
  const [phoneNumber, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchInstitution = useCallback(async () => {
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
        setInstitutionName(institution.institutionName || "");
        setImagePreview(institution.imgUrl || "");
        setLocation(institution.location || "");
        setPhone(institution.phoneNumber || "");
        setEmail(institution.email || "");
      } else {
        toast.error("لم يتم العثور على المؤسسة");
      }
    } catch (err) {
      toast.error("خطأ أثناء تحميل البيانات");
    }
  }, [id]);

  useEffect(() => {
    const company = locationData.state?.company;
    if (id) {
      if (company) {
        setInstitutionName(company.institutionName || "");
        setImagePreview(company.imgUrl || "");
        setLocation(company.location || "");
        setPhone(company.phoneNumber || "");
        setEmail(company.email || "");
      } else {
        fetchInstitution();
      }
    }
  }, [id, locationData.state, fetchInstitution]);

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
      toast.error("يرجى إدخال اسم المؤسسة");
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
        location,
        phoneNumber,
        email,
      };

      const method = id ? "PUT" : "POST";
      const url = id
        ? `${process.env.REACT_APP_API_URL}institution/${id}`
        : `${process.env.REACT_APP_API_URL}institution`;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": "en",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

let result = null;
const text = await response.text();
if (text) {
  result = JSON.parse(text);
}

      if (!response.ok) {
        throw new Error(result.msg || "فشل العملية");
      }

      toast.success(id ? "تم تحديث المؤسسة بنجاح" : "تم إنشاء المؤسسة بنجاح");

      // الرجوع بعد النجاح
      // navigate("/institutions");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center mt-3" style={{ direction: "rtl" }}>
      <form
        onSubmit={handleSubmit}
        className="w-96 space-y-4 flex flex-col items-center"
      >
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

        <div className="w-full">
          <label htmlFor="institutionName" className="block mb-1 font-semibold text-gray-700">
            اسم المؤسسة
          </label>
          <input
            id="institutionName"
            type="text"
            placeholder="اسم المؤسسة"
            className="w-full border rounded px-4 py-2 text-center"
            value={institutionName}
            onChange={(e) => setInstitutionName(e.target.value)}
          />
        </div>

        <div className="w-full">
          <label htmlFor="location" className="block mb-1 font-semibold text-gray-700">
            الموقع
          </label>
          <input
            id="location"
            type="text"
            placeholder="الموقع"
            className="w-full border rounded px-4 py-2 text-center"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div className="w-full">
          <label htmlFor="phoneNumber" className="block mb-1 font-semibold text-gray-700">
            رقم الهاتف
          </label>
          <input
            id="phoneNumber"
            type="number"
            placeholder="رقم الهاتف"
            className="w-full border rounded px-4 py-2 text-center"
            value={phoneNumber}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="w-full">
          <label htmlFor="email" className="block mb-1 font-semibold text-gray-700">
            البريد الإلكتروني
          </label>
          <input
            id="email"
            type="email"
            placeholder="البريد الإلكتروني"
            className="w-full border rounded px-4 py-2 text-center"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full text-white rounded py-2 transition ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-primary hover:bg-primary-dark"
          }`}
        >
          {loading
            ? id
              ? "جاري التعديل..."
              : "جاري الإنشاء..."
            : id
            ? "تحديث"
            : "إنشاء"}
        </button>
      </form>
    </div>
  );
};

export default EditInstitution;
