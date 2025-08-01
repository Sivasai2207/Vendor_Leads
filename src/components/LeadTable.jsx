import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  collection,
  onSnapshot,
  doc,
  getDoc,
  runTransaction,
  deleteDoc,
  increment,
} from "firebase/firestore";
import { MoreVertical } from "lucide-react";

export default function LeadTable({ searchTerm, authorFilter, setAuthorOptions }) {
  const [user] = useAuthState(auth);
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  // 🔁 Load leads and fetch author names
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "vendorLeads"), async (snapshot) => {
      const leadDocs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const enrichedLeads = await Promise.all(
        leadDocs.map(async (lead) => {
          if (!lead.authorId) return { ...lead, authorName: "Unknown" };

          try {
            const authorDoc = await getDoc(doc(db, "allowedUsers", lead.authorId));
            if (!authorDoc.exists()) return { ...lead, authorName: "Unknown" };

            const authorData = authorDoc.data();
            return {
              ...lead,
              authorName: authorData.name ?? "Unknown",
            };
          } catch (err) {
            console.error("Error fetching author:", err);
            return { ...lead, authorName: "Unknown" };
          }
        })
      );

      setLeads(enrichedLeads);

      // Extract and sort unique contributor names
      const uniqueContributors = Array.from(
        new Set(
          enrichedLeads
            .filter((lead) => lead.authorName && lead.authorName !== "Unknown")
            .map((lead) => lead.authorName)
        )
      ).sort();

      if (typeof setAuthorOptions === "function") {
        setAuthorOptions(uniqueContributors);
      }
    });

    return () => unsubscribe();
  }, [setAuthorOptions]);

  // 🔍 Combined search and author filter logic
  const filteredLeads = leads.filter((lead) => {
    const search = searchTerm?.toLowerCase() || "";
    const author = authorFilter?.toLowerCase() || "";

    return (
      (
        `${lead.name} ${lead.companyName} ${lead.email} ${lead.phone} ${lead.notes} ${lead.authorName}`
          .toLowerCase()
          .includes(search)
      ) &&
      lead.authorName?.toLowerCase().includes(author)
    );
  });

  // 🗳 Voting logic
  const handleVote = async (leadId, newVoteType) => {
    if (!user) return alert("Please login to vote");

    const voteRef = doc(db, `vendorLeads/${leadId}/votes`, user.uid);
    const leadRef = doc(db, "vendorLeads", leadId);

    try {
      await runTransaction(db, async (tx) => {
        const voteSnap = await tx.get(voteRef);
        const leadSnap = await tx.get(leadRef);
        if (!leadSnap.exists()) throw new Error("Lead not found");

        const previousVote = voteSnap.exists() ? voteSnap.data().voteType : null;

        if (previousVote === newVoteType) {
          tx.update(leadRef, { [`${newVoteType}_count`]: increment(-1) });
          tx.delete(voteRef);
        } else {
          if (previousVote) {
            tx.update(leadRef, { [`${previousVote}_count`]: increment(-1) });
          }
          tx.update(leadRef, { [`${newVoteType}_count`]: increment(1) });
          tx.set(voteRef, {
            userId: user.uid,
            voteType: newVoteType,
            updated_at: new Date(),
          });
        }
      });
    } catch (err) {
      console.error("Voting error:", err.message);
      alert("Could not vote. Try again.");
    }
  };

  // 🗑 Lead delete
  const handleDelete = async (leadId) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    await deleteDoc(doc(db, "vendorLeads", leadId));
    setModalOpen(false);
  };

  const openModal = (lead) => {
    setSelectedLead(lead);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedLead(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="bg-white shadow-md rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Notes</th>
                <th className="px-6 py-4">Author</th>
                <th className="px-6 py-4">Votes</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{lead.name ?? "N/A"}</td>
                  <td className="px-6 py-4">{lead.companyName ?? "N/A"}</td>
                  <td className="px-6 py-4">{lead.phone ?? "N/A"}</td>
                  <td className="px-6 py-4">{lead.email ?? "N/A"}</td>
                  <td className="px-6 py-4">{lead.notes ?? "N/A"}</td>
                  <td className="px-6 py-4">{lead.authorName ?? "Unknown"}</td>
                  <td className="px-6 py-4 flex gap-3">
                    <button onClick={() => handleVote(lead.id, "like")} className="text-green-600">
                      👍 {lead.like_count ?? 0}
                    </button>
                    <button onClick={() => handleVote(lead.id, "dislike")} className="text-red-500">
                      👎 {lead.dislike_count ?? 0}
                    </button>
                    <button onClick={() => handleVote(lead.id, "stopped")} className="text-yellow-600">
                      ⛔ {lead.stopped_count ?? 0}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => openModal(lead)}>
                      <MoreVertical className="text-gray-500 hover:text-black" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Lead Details */}
      {isModalOpen && selectedLead && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 text-xl"
              onClick={closeModal}
            >
              ✖
            </button>
            <h2 className="text-xl font-bold mb-4">Lead Details</h2>
            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>Name:</strong> {selectedLead.name}</p>
              <p><strong>Company:</strong> {selectedLead.companyName}</p>
              <p><strong>Phone:</strong> {selectedLead.phone}</p>
              <p><strong>Email:</strong> {selectedLead.email}</p>
              <p><strong>Notes:</strong> {selectedLead.notes}</p>
              <p><strong>Votes:</strong> 👍 {selectedLead.like_count ?? 0}, 👎 {selectedLead.dislike_count ?? 0}, ⛔ {selectedLead.stopped_count ?? 0}</p>
            </div>
            {user?.uid === selectedLead.authorId && (
              <div className="mt-4">
                <button
                  onClick={() => handleDelete(selectedLead.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Delete Lead
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
