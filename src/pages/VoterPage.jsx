import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react"
import { client, databases, db_id, colection_id } from "../lib/appwrite"
import Question from "../component/Question";

const VoterPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const roomCode = queryParams.get("room"); // Ambil kode ruang dari URL
    const [questions, setQuestion] = useState([]);
    const [isAllowed, setIsAllowed] = useState(false);

    useEffect(() => {
        const hasAccess = localStorage.getItem("hasAccess");

        if (hasAccess !== "true") {
            navigate("/error?   unverived"); // arahkan jika belum punya akses
            console.log("terrr")
        } else {
            setIsAllowed(true);
        }
    }, [navigate]);


    useEffect(() => {
        if (!isAllowed) return;

        getQuestionFromDb();

        const unsubscribe = client.subscribe(
            `databases.${db_id}.collections.${colection_id}.documents`,
            (res) => {
                if (res.events.includes("databases.*.collections.*.documents.*.update")) {
                    setQuestion((prevQuestions) => {
                        return prevQuestions.map((question) => {
                            if (question.$id !== res.payload.$id) {
                                return question;
                            }
                            return res.payload;
                        });
                    });
                }
            }
        );

        return () => {
            unsubscribe();
        };
    }, [isAllowed]);

    async function getQuestionFromDb() {
        const question = await databases.listDocuments(db_id, colection_id);
        setQuestion(question.documents);
    }

    if (!isAllowed) return null; // jangan render jika belum valid
    return (
        <div className="h-dvh p-4 px-6 font-set-poppins bg-light-color pb-11 ">
            {
                questions.map((question) => (
                    <Question key={question.$id} data={question} />
                ))
            }
        </div>
    )
}
export default VoterPage