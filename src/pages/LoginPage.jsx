import { useState } from "react";
import { useNavigate } from "react-router-dom";

const validRoomCodes = ["PromNightBmDua"]
const validAdminCodes = ["Yeimwoq5mtjci0"]
const locationUser = [3.589740970607336, 98.65134794709122]

const allowedLat = locationUser[0];
const allowedLng = locationUser[1];
const allowedRadiusKm = 1;

const LoginPage = () => {
    const [roomCode, setRoomCode] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleVoterLogin = (e) => {
        e.preventDefault(); // cegah reload form

        if (roomCode.trim() === "") {
            setError("Masukkan kode ruang voting!");
            return;
        }

        const normalizedCode = roomCode.trim();

        if (validRoomCodes.includes(normalizedCode)) {
            // Minta lokasi pengguna
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;

                    const distance = getDistanceFromLatLonInKm(
                        latitude,
                        longitude,
                        allowedLat,
                        allowedLng
                    );

                    if (distance <= allowedRadiusKm) {
                        localStorage.setItem("hasAccess", "true");
                        navigate(`/voter?room=${normalizedCode}`);
                    } else {
                        setError("Lokasi Anda tidak diizinkan untuk voting.");
                        console.log(latitude, longitude)
                        console.log("sistem", allowedLat, allowedLng)
                    }
                },
                () => {
                    setError("Izinkan akses lokasi untuk melanjutkan.");
                }
            );
        } else if (validAdminCodes.includes(normalizedCode)) {
            navigate("/admin");
        } else {
            setError("Kode ruang tidak valid!");
        }
    };

    // Fungsi hitung jarak antar 2 koordinat
    function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) *
            Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    function deg2rad(deg) {
        return deg * (Math.PI / 180);
    }
    return (
        <div className="bg-gradient-to-b from-light-orange to-fancy-red font-set-poppins">
            <div className="container h-svh flex flex-col justify-center gap-12 px-6">
                <section className="bagian-atas">
                    <h1 className="text-4xl text-white font-semibold mb-4 capitalize">selamat datang di website voting angkatan 2025!</h1>
                    <span className="capitalize text-white">silahkan masukkan kode login</span>
                </section>
                <form action={handleVoterLogin}>
                    <section className="flex gap-4">
                        <input
                            type="text"
                            placeholder="Masukkan Kode Ruang"
                            value={roomCode}
                            onChange={(e) => {
                                setRoomCode(e.target.value)
                                setError("")
                            }}
                            className="border-2 border-white text-white w-full p-2 py-4 rounded-lg focus:outline-white"
                        />
                        <button
                            onClick={handleVoterLogin}
                            className="border-2 border-white bg-white text-fancy-red font-bold px-5 py-4 rounded-lg"
                        >
                            Masuk
                        </button>
                    </section>
                </form>
                {error && (
                    <section>
                        <p className="text-white font-medium bg-red-600 px-4 py-3 mt-2 rounded-lg">{error}</p>
                    </section>
                )}
                <section>
                    <p className="text-white">*website ini dibuat atas keperluan angkatan 2025 dan tidak dapat dipergunakan untuk keperluan lainnya.</p>
                </section>
            </div>
        </div>
    )
}
export default LoginPage