import React, { useEffect, useState } from "react";
import { uploadDocument, listDocuments, downloadDocument } from "../../api/documentApi";
import { useAuthContext } from "../../context/AuthContext";
import useMyCustomerId from "../../hooks/useMyCustomerId";

export default function UploadDocuments() {
  const { authData } = useAuthContext();
  const username = localStorage.getItem("username") || "";
  const { customerId } = useMyCustomerId(username);

  const [docs, setDocs] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [docType, setDocType] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const REQUIRED_DOCS = [
    "PAN_CARD",
    "AADHAR_CARD",
    "SALARY_SLIP",
    "BANK_STATEMENT",
  ];

  // 🔹 Load existing documents
  useEffect(() => {
    if (!customerId) return;
    const fetchDocs = async () => {
      try {
        const res = await listDocuments("CUSTOMER", customerId);
        setDocs(res || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load your documents.");
      }
    };
    fetchDocs();
  }, [customerId]);

  // 🔹 Handle upload
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile || !docType) {
      alert("Please select a document type and file.");
      return;
    }

    try {
      setUploading(true);
      setMessage("");
      await uploadDocument({
        ownerType: "CUSTOMER",
        ownerId: customerId,
        docType,
        file: selectedFile,
      });
      setMessage(`✅ ${docType} uploaded successfully!`);
      setSelectedFile(null);
      setDocType("");
      // Reload list
      const updated = await listDocuments("CUSTOMER", customerId);
      setDocs(updated);
    } catch (err) {
      console.error(err);
      setError("❌ Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 mt-10">
      <h2 className="text-2xl font-bold mb-4 text-blue-800">
        Upload Your Documents
      </h2>
      <p className="text-gray-600 mb-6">
        Welcome, <b>{username}</b>. Please upload the required documents below.
      </p>

      <form onSubmit={handleUpload} className="space-y-4">
        {/* Select Document Type */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Document Type
          </label>
          <select
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
            required
          >
            <option value="">-- Select Document Type --</option>
            {REQUIRED_DOCS.map((type) => (
              <option key={type} value={type}>
                {type.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Select File</label>
          <input
            type="file"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>

        {/* Upload Button */}
        <button
          type="submit"
          disabled={uploading}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition w-full"
        >
          {uploading ? "Uploading..." : "Upload Document"}
        </button>
      </form>

      {/* Messages */}
      {message && <div className="mt-4 text-green-600 font-medium">{message}</div>}
      {error && <div className="mt-4 text-red-600 font-medium">{error}</div>}

      {/* Uploaded Documents Table */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-3 text-gray-800">Uploaded Documents</h3>
        {docs.length === 0 ? (
          <p className="text-gray-500">No documents uploaded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Type</th>
                 
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {docs.map((d) => (
                  <tr key={d.id} className="border-t">
                    <td className="p-2">{d.docType}</td>
                   
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          d.status === "VERIFIED"
                            ? "bg-green-50 text-green-700"
                            : "bg-yellow-50 text-yellow-700"
                        }`}
                      >
                        {d.status || "PENDING"}
                      </span>
                    </td>
                    <td className="p-2 text-center">
                     <button
  onClick={() => downloadDocument(d.id, d.originalName)}
  className="text-blue-600 hover:underline"
>
  Download
</button>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
