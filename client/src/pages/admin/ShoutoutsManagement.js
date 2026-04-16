import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, X } from "lucide-react";

const EMOJIS = [
  "🎉", "👏", "🔥", "💯","✨", "🌟",
  "💪", "😍", "🥳", "🙌", "👍", "🤝", "❤️",
  "🏆","⚡", "😄"
];

const ShoutoutsManagement = () => {
  const [shoutouts, setShoutouts] = useState([]);
  const [users, setUsers] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [senderId, setSenderId] = useState("");
  const [recipientIds, setRecipientIds] = useState([]);
  const [message, setMessage] = useState("");

  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);

  const [emoji, setEmoji] = useState("🎉");

  const fetchUsers = async () => {
    const res = await axios.get("http://127.0.0.1:8000/api/users/");
    setUsers(res.data);
  };

  const fetchShoutouts = async () => {
    const res = await axios.get("http://127.0.0.1:8000/api/shoutouts/feed");
    setShoutouts(res.data);
  };

  useEffect(() => {
    fetchUsers();
    fetchShoutouts();
  }, []);

  // ADD TAG
  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
    }
    setTagInput("");
  };

  const removeTag = (tag) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleAddShoutout = async () => {
    await axios.post("http://127.0.0.1:8000/api/shoutouts/", {
      sender_id: Number(senderId),
      recipient_ids: recipientIds,
      message,
      tag_names: tags
    });

    setShowModal(false);
    setMessage("");
    setTags([]);
    setTagInput("");
    setRecipientIds([]);
    setSenderId("");

    fetchShoutouts();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://127.0.0.1:8000/api/shoutouts/${id}`);
    fetchShoutouts();
  };

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Shoutout Management</h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Plus /> New Shoutout
        </button>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

          <div className="bg-white p-6 rounded-xl w-[450px] shadow-xl relative">

            <X
              className="absolute top-3 right-3 cursor-pointer"
              onClick={() => setShowModal(false)}
            />

            <h2 className="text-xl font-bold mb-4">Create Shoutout</h2>

            {/* SENDER */}
            <select
              value={senderId}
              onChange={(e) => setSenderId(e.target.value)}
              className="w-full p-2 border rounded mb-2"
            >
              <option value="">Select Sender</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>

            {/* RECIPIENT */}
            <select
              multiple
              onChange={(e) =>
                setRecipientIds([...e.target.selectedOptions].map(o => Number(o.value)))
              }
              className="w-full p-2 border rounded mb-2"
            >
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>

            {/* MESSAGE */}
            <textarea
              placeholder="Write your shoutout..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 border rounded mb-3"
            />

            {/* EMOJI PICKER */}
            <div className="mb-3">
              <p className="text-sm font-semibold mb-1">Choose Emoji</p>
              <div className="flex flex-wrap gap-2">
                {EMOJIS.map((e, i) => (
                  <button
                    key={i}
                    onClick={() => setEmoji(e)}
                    className={`text-xl p-2 rounded border ${
                      emoji === e ? "bg-blue-100 border-blue-500" : ""
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            {/* TAGS */}
            <div className="mb-3">
              <p className="text-sm font-semibold mb-1">Tags</p>

              <div className="flex gap-2">
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add tag (e.g. teamwork)"
                  className="flex-1 p-2 border rounded"
                />
                <button
                  onClick={addTag}
                  className="bg-gray-800 text-white px-3 rounded"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((t, i) => (
                  <span
                    key={i}
                    className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs flex items-center gap-1"
                  >
                    {t}
                    <X
                      size={12}
                      className="cursor-pointer"
                      onClick={() => removeTag(t)}
                    />
                  </span>
                ))}
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleAddShoutout}
                className="px-4 py-2 bg-blue-700 text-white rounded"
              >
                Submit
              </button>
            </div>

          </div>
        </div>
      )}

      {/* LIST */}
      <div className="space-y-4">
        {shoutouts.map((s) => (
          <div key={s.id} className="border p-4 rounded shadow">

            <p className="text-lg font-semibold">
              {s.message} {s.emoji || emoji}
            </p>

            <p className="text-sm text-gray-600">
              From: {s.sender?.name}
            </p>

            <p className="text-sm text-gray-600">
              To: {s.recipients?.map(r => r.name).join(", ")}
            </p>

            <div className="flex flex-wrap gap-2 mt-2">
              {s.tags?.map((tag, i) => (
                <span
                  key={i}
                  className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>

            <button
              onClick={() => handleDelete(s.id)}
              className="mt-3 bg-red-600 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};

export default ShoutoutsManagement;