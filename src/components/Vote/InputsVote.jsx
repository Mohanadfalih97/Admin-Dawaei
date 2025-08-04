import React from "react";

const InputsVote = ({ title, setTitle, dscrp, setDscrp, file, setFile ,minMumbersVoted ,setMinMumbersVoted }) => {
  const handleFileChange = (e) => setFile(e.target.files[0]);

  return (
    <section>
<div className="flex flex-row w-full gap-4" style={{direction:"rtl"}}>
  {/* عنوان التصويت */}
  <div className="flex flex-col w-1/2 items-end py-2 gap-2">
    <label className="text-right w-full">عنوان التصويت</label>
    <input
      type="text"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      className="w-full p-2.5 border rounded-lg text-right"
      placeholder="أدخل عنواناً واضحاً للتصويت"
      required
    />
  </div>

  {/* أقل عدد للتصويت */}
  <div className="flex flex-col w-1/2 items-end py-2 gap-2">
    <label className="text-right w-full">أقل عدد للتصويت</label>
<input
  type="number"
  min={1}
  value={minMumbersVoted}
  onChange={(e) => setMinMumbersVoted(Number(e.target.value))}
  className="w-full p-2.5 border rounded-lg text-right"
  placeholder="ادخل العدد"
  required
/>

  </div>
</div>

      <div className="flex flex-col items-end py-5 gap-2">
        <label>وصف التصويت</label>
        <textarea
          value={dscrp}
          onChange={(e) => setDscrp(e.target.value)}
          className="w-full p-2.5 border rounded-lg text-right"
          placeholder="أدخل وصفاً تفصيلياً للتصويت"
          required
        />
      </div>
          <div className="flex flex-col items-end py-5 gap-2 w-full">
        <label>المرفقات</label>
        <label
          htmlFor="file-upload"
          className="cursor-pointer border p-2.5 rounded-lg text-center w-full"
        >
          اختر ملف
        </label>
        <input
          type="file"
          id="file-upload"
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
        />
        {/* ✅ عرض اسم الملف المختار */}
   {file && (
  <p className="text-sm text-gray-600 text-right mt-1">
    الملف المختار:{" "}
    <span className="font-medium">
      {file.name.length > 30
        ? `${file.name.slice(0, 15)}...${file.name.slice(-10)}`
        : file.name}
    </span>
  </p>
)}

        <p className="text-xs font-normal text-gray-500 text-right">
          يمكنك رفع ملفات PDF، Word، Excel أو صور. الحد الأقصى 5 ميجابايت
        </p>
      </div>
    </section>
  );
};

export default InputsVote;
