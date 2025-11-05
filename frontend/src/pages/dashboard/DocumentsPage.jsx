import React, { useEffect, useState } from "react";
import {
  listAllDocuments,
  updateDocumentStatus,
  downloadDocument,
  deleteDocument,
} from "../../api/documentApi";

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError("");
      // 🟢 Fetch all documents (for admin)
      const data = await listAllDocuments();
      setDocuments(data || []);
    } catch (err) {
      console.error("Failed to load documents:", err);
      setError("Could not load documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateDocumentStatus(id, status);
      loadDocuments();
    } catch (err) {
      alert("Error updating status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;
    try {
      await deleteDocument(id);
      loadDocuments();
    } catch (err) {
      alert("Error deleting document");
    }
  };

  if (loading)
    return <div className="p-6 text-gray-500 text-center">Loading documents...</div>;

  if (error)
    return <div className="p-6 text-red-500 text-center">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Documents</h2>

      {documents.length === 0 ? (
        <div className="text-gray-500 text-center">No documents found</div>
      ) : (
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">Owner ID</th>
              <th className="py-2 px-4 text-left">Type</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id} className="border-t hover:bg-gray-50">
                <td className="py-2 px-4">{doc.id}</td>
                <td className="py-2 px-4">{doc.ownerId}</td>
                <td className="py-2 px-4">{doc.docType}</td>
                <td
                  className={`py-2 px-4 font-medium ${
                    doc.status === "VERIFIED"
                      ? "text-green-600"
                      : doc.status === "REJECTED"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {doc.status}
                </td>
                <td className="py-2 px-4 flex gap-2">
                  <button
                    onClick={() => downloadDocument(doc.id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => handleStatusChange(doc.id, "VERIFIED")}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Verify
                  </button>
                  <button
                    onClick={() => handleStatusChange(doc.id, "REJECTED")}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
