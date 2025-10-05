import { useState, useEffect } from "react";
import { colection_id, databases, db_id } from "../lib/appwrite";

const DATABASE_ID = db_id;
const COLLECTION_ID = colection_id;

const AdminPage = () => {
    const [data, setData] = useState([]);
    const [newData, setNewData] = useState("");
    const [loading, setLoading] = useState(false);
    const [kingData, setKingData] = useState([]); // Data King
    const [queenData, setQueenData] = useState([]); // Data Queen
    const [kingVotes, setKingVotes] = useState({}); // Votes King
    const [queenVotes, setQueenVotes] = useState({}); // Votes Queen
    const [newKing, setNewKing] = useState(""); // State untuk input King
    const [newQueen, setNewQueen] = useState(""); // State untuk input Queen
    const [error, setError] = useState(""); // State untuk pesan error

    useEffect(() => {
        fetchData();
    }, []);

    console.log(databases)

    // **1. Ambil Data dari Collection**
    const fetchData = async () => {
        try {
            const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);

            // Pisahkan data menjadi king, queen, votes
            const kings = [];
            const queens = [];
            const kingVotes = {};
            const queenVotes = {};

            response.documents.forEach((doc) => {
                Object.keys(doc).forEach((key) => {
                    if (key.startsWith("king_")) {
                        kings.push({ id: doc.$id, key, name: doc[key] });
                    }
                    if (key.startsWith("queen_")) {
                        queens.push({ id: doc.$id, key, name: doc[key] });
                    }
                    if (key.startsWith("kvotes_")) {
                        kingVotes[key] = doc[key];
                    }
                    if (key.startsWith("qvotes_")) {
                        queenVotes[key] = doc[key];
                    }
                });
            });

            setKingData(kings);
            setQueenData(queens);
            setKingVotes(kingVotes);
            setQueenVotes(queenVotes);

        } catch (error) {
            console.error("Gagal mengambil data:", error);
        }
    };


    useEffect(() => {
        fetchData();
    }, []);

    // **2. Tambah Data ke Collection**
    const handleAddKing = async () => {
        if (!newKing.trim()) {
            setError("Nama King tidak boleh kosong!");
            return;
        }
        setLoading(true);
        setError("");

        try {
            const newKey = `king_${kingData.length + 1}`;
            await databases.updateDocument(DATABASE_ID, COLLECTION_ID, kingData[0]?.id || "default_id", {
                [newKey]: newKing
            });
            setNewKing(""); // Reset input setelah menambahkan
            fetchData();
        } catch (error) {
            console.error("Gagal menambahkan king:", error);
        } finally {
            setLoading(false);
        }
        console.log("tessstingg")
    };

    const handleAddQueen = async () => {
        if (!newQueen.trim()) {
            setError("Nama Queen tidak boleh kosong!");
            return;
        }
        setLoading(true);
        setError("");

        try {
            const newKey = `queen_${queenData.length + 1}`;
            await databases.updateDocument(DATABASE_ID, COLLECTION_ID, queenData[0]?.id || "default_id", {
                [newKey]: newQueen
            });
            setNewQueen(""); // Reset input setelah menambahkan
            fetchData();
        } catch (error) {
            console.error("Gagal menambahkan queen:", error);
        } finally {
            setLoading(false);
        }
    };

    // **3. Edit Data di Collection**
    const handleEditData = async (docId, fieldKey, newValue) => {
        try {
            await databases.updateDocument(DATABASE_ID, COLLECTION_ID, docId, {
                [fieldKey]: newValue,
            });

            fetchData(); // Refresh data setelah update
        } catch (error) {
            console.error("Gagal memperbarui data:", error);
        }
    };

    const handleDeleteData = async (docId, fieldKey) => {
        try {
            await databases.updateDocument(DATABASE_ID, COLLECTION_ID, docId, {
                [fieldKey]: null, // Menghapus hanya satu field
            });

            fetchData(); // Refresh data setelah hapus
        } catch (error) {
            console.error("Gagal menghapus data:", error);
        }
    };


    return (
        <div className="p-5">
            <h1 className="text-2xl font-bold mb-4">Admin Page</h1>

            {/* Loading */}
            {loading && <div className="text-center text-red-500 font-semibold">Loading...</div>}

            {/* King Section */}
            <h2 className="text-xl font-bold">King Candidates</h2>
            <div>
                {kingData.map((item) => (
                    <div key={item.key} className="border p-3 flex justify-between items-center mb-2">
                        <input
                            type="text"
                            defaultValue={item.name}
                            className="border border-red-300 p-1 mr-2"
                            onBlur={(e) => handleEditData(item.id, item.key, e.target.value)}
                        />
                        <button
                            onClick={() => handleDeleteData(item.id, item.key)}
                            className="bg-red-500 text-white px-2 py-1"
                            disabled={loading}
                        >
                            {loading ? "Loading..." : "Hapus"}
                        </button>
                    </div>
                ))}
            </div>
            <div className="mt-3 flex gap-2">
                <input
                    type="text"
                    placeholder="Masukkan Nama King"
                    value={newKing}
                    onChange={(e) => setNewKing(e.target.value)}
                    className="border p-2 border-yellow-400 placeholder-gray-500"
                />
                <button
                    onClick={handleAddKing}
                    className="bg-blue-500 text-white px-3 py-2"
                    disabled={loading}
                >
                    {loading ? "Loading..." : "Tambah King"}
                </button>
            </div>
            <div>
                <input type="text" />
            </div>
            {/* Queen Section */}
            <h2 className="text-xl font-bold mt-4">Queen Candidates</h2>
            <ul>
                {queenData.map((item) => (
                    <li key={item.key} className="border p-3 flex justify-between items-center mb-2">
                        <input
                            type="text"
                            defaultValue={item.name}
                            className="border p-1 mr-2"
                            onBlur={(e) => handleEditData(item.id, item.key, e.target.value)}
                        />
                        <button
                            onClick={() => handleDeleteData(item.id, item.key)}
                            className="bg-red-500 text-white px-2 py-1"
                            disabled={loading}
                        >
                            {loading ? "Loading..." : "Hapus"}
                        </button>
                    </li>
                ))}
            </ul>
            <div className="mt-3 flex gap-2">
                <input
                    type="text"
                    placeholder="Masukkan nama Queen"
                    value={newQueen}
                    onChange={(e) => setNewQueen(e.target.value)}
                    className="border p-2"
                />
                <button
                    onClick={handleAddQueen}
                    className="bg-blue-500 text-white px-3 py-2"
                    disabled={loading}
                >
                    {loading ? "Loading..." : "Tambah Queen"}
                </button>
            </div>
        </div>
    );
};

export default AdminPage;
