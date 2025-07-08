import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

export default function ContributeModal({ isOpen, onClose }) {
  const [user] = useAuthState(auth);
  const [form, setForm] = useState({
    name: "",
    companyName: "",
    email: "",
    phone: "",
    notes: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please log in to contribute");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "vendorLeads"), {
        ...form,
        authorId: user.uid,
        like_count: 0,
        dislike_count: 0,
        stopped_count: 0,
        status: "open", // ✅ NEW FIELD
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      });

      setForm({ name: "", companyName: "", email: "", phone: "", notes: "" });
      onClose();
    } catch (err) {
      console.error("Error adding document: ", err);
      alert("Failed to submit lead.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center p-4 z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Add a Vendor Lead</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="w-full border rounded px-3 py-2"
          />
          <input
            type="text"
            placeholder="Company Name"
            value={form.companyName}
            onChange={(e) => setForm({ ...form, companyName: e.target.value })}
            required
            className="w-full border rounded px-3 py-2"
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border rounded px-3 py-2"
          />
          <input
            type="tel"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full border rounded px-3 py-2"
          />
          <textarea
            placeholder="Notes"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="w-full border rounded px-3 py-2"
          ></textarea>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`${
                loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
              } text-white px-4 py-2 rounded`}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}