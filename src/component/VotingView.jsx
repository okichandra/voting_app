import { useState, useEffect } from "react"
import { client, databases, db_id, colection_id } from "../lib/appwrite"
const VotingView = () => {

    const [question, setQuestion] = useState([])

    useEffect(() => {
        getQuestionFromDb()
    }, [])

    async function getQuestionFromDb() {
        const question = await databases.listDocuments(db_id,colection_id)
        setQuestion(question.documents)
    }

    return (
        <div>
            <main>
                {question.map((question) => {
                    <Question key={question.$id} data={question} />
                })}
            </main>
        </div>
    )
}

export default VotingView