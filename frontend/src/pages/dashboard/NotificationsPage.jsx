import React, { useState } from "react";
import { sendEmailToCustomer, sendSmsToCustomer } from "../../api/notificationApi";

export default function NotificationsPage() {
  const [email, setEmail] = useState({ username: "", subject: "", body: "" });
  const [sms, setSms] = useState({ phone: "", message: "" });

  const handleEmail = async (e) => {
    e.preventDefault();
    try {
      await sendEmailToCustomer(email.username, email.subject, email.body);
      alert("✅ Email notification sent successfully!");
      setEmail({ username: "", subject: "", body: "" });
    } catch (err) {
      console.error("Failed to send email:", err);
      alert("❌ Failed to send email notification");
    }
  };

  const handleSms = async (e) => {
    e.preventDefault();
    try {
      await sendSmsToCustomer(sms.phone, sms.message);
      alert("✅ SMS notification sent successfully!");
      setSms({ phone: "", message: "" });
    } catch (err) {
      console.error("Failed to send SMS:", err);
      alert("❌ Failed to send SMS notification");
    }
  };

  return (
    <div className="space-y-10 p-6">
      {/* EMAIL SECTION */}
      <section className="bg-white p-6 rounded-lg shadow-md border">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Send Email Notification (by Username)</h2>
        <form onSubmit={handleEmail} className="space-y-3">
          <input
            className="border p-2 w-full rounded"
            placeholder="Customer Username (system will send to their registered email)"
            value={email.username}
            onChange={(e) => setEmail({ ...email, username: e.target.value })}
            required
          />
          <input
            className="border p-2 w-full rounded"
            placeholder="Subject"
            value={email.subject}
            onChange={(e) => setEmail({ ...email, subject: e.target.value })}
            required
          />
          <textarea
            className="border p-2 w-full rounded"
            placeholder="Message Body"
            value={email.body}
            onChange={(e) => setEmail({ ...email, body: e.target.value })}
            required
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Send Email
          </button>
        </form>
      </section>

      {/* SMS SECTION */}
      <section className="bg-white p-6 rounded-lg shadow-md border">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Send SMS Notification</h2>
        <form onSubmit={handleSms} className="space-y-3">
          <input
            className="border p-2 w-full rounded"
            placeholder="Customer Phone Number"
            value={sms.phone}
            onChange={(e) => setSms({ ...sms, phone: e.target.value })}
            required
          />
          <textarea
            className="border p-2 w-full rounded"
            placeholder="SMS Message"
            value={sms.message}
            onChange={(e) => setSms({ ...sms, message: e.target.value })}
            required
          />
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Send SMS
          </button>
        </form>
      </section>
    </div>
  );
}
