import { fetchWithAuth } from "./fetchWithAuth";

const BASE = import.meta.env.VITE_DOCUMENT;

/* -------------------------------------------------------------------------- */
/* 🟢 DOCUMENT LISTING */
/* -------------------------------------------------------------------------- */

// 🔹 For customers: list documents by owner
export const listDocuments = async (ownerType, ownerId) => {
  if (!ownerType || !ownerId) {
    throw new Error("ownerType and ownerId are required to list documents.");
  }

  const url = `${BASE}/documents?ownerType=${encodeURIComponent(
    ownerType
  )}&ownerId=${encodeURIComponent(ownerId)}`;
  return await fetchWithAuth(url);
};

// 🔹 For admins: list all documents (no filter)
export const listAllDocuments = async () => {
  return await fetchWithAuth(`${BASE}/documents`);
};

/* -------------------------------------------------------------------------- */
/* 🟢 DOCUMENT UPLOAD */
/* -------------------------------------------------------------------------- */
// Mainly for customer side uploads
export async function uploadDocument({ ownerType, ownerId, docType, file }) {
  if (!file) throw new Error("File is required for upload.");

  const form = new FormData();
  form.append("meta", JSON.stringify({ ownerType, ownerId, docType }));
  form.append("file", file);

  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE}/documents/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Upload failed: ${errText || res.statusText}`);
  }

  return await res.json();
}

/* -------------------------------------------------------------------------- */
/* 🟢 DOCUMENT STATUS UPDATE (Admin) */
/* -------------------------------------------------------------------------- */
export const updateDocumentStatus = async (id, status) => {
  if (!id || !status) throw new Error("Document ID and status are required.");
  return await fetchWithAuth(
    `${BASE}/documents/${id}/status?status=${encodeURIComponent(status)}`,
    { method: "PATCH" }
  );
};

/* -------------------------------------------------------------------------- */
/* 🟢 DOCUMENT DOWNLOAD */
/* -------------------------------------------------------------------------- */
export async function downloadDocument(id, filenameHint) {
  if (!id) throw new Error("Document ID is required for download.");

  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE}/documents/${id}/download`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to download file: ${errText || res.statusText}`);
  }

  const blob = await res.blob();

  // Try header name, otherwise use filenameHint (originalName), else default
  const disposition = res.headers.get("Content-Disposition") || "";
  const match = disposition.match(/filename="(.+)"/);
  const filename =
    match?.[1] || filenameHint || `document_${id}`;

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

/* -------------------------------------------------------------------------- */
/* 🟢 DOCUMENT DELETE (Admin) */
/* -------------------------------------------------------------------------- */
export const deleteDocument = async (id) => {
  if (!id) throw new Error("Document ID is required to delete.");
  return await fetchWithAuth(`${BASE}/documents/${id}`, { method: "DELETE" });
};
