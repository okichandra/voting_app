import { useState, useEffect } from "react";
import { colection_id, databases, db_id } from "../lib/appwrite";
import Button from "./Button";
import Vote from "./Vote";

const Question = ({ data }) => {
    const [isKingSubmitted, setIsKingSubmitted] = useState(false);
    const [isQueenSubmitted, setIsQueenSubmitted] = useState(false);

    useEffect(() => {
        const hasVotedKing = localStorage.getItem(`voted_king_${data.$id}`) === "true";
        const hasVotedQueen = localStorage.getItem(`voted_queen_${data.$id}`) === "true";

        if (hasVotedKing) setIsKingSubmitted(true);
        if (hasVotedQueen) setIsQueenSubmitted(true);
    }, [data.$id]);

    const handleSubmit = (e, type) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const selectedVote = formData.get(type);

        if (!selectedVote) {
            alert(`Anda belum memilih ${type === "king_" ? "King" : "Queen"}`);
            return;
        }

        const answerKeys = Object.keys(data)
            .filter((key) => key.startsWith(type))
            .sort();

        const voteKeys = Object.keys(data)
            .filter((key) => key.startsWith(type === "king_" ? "kvotes_" : "qvotes_"))
            .sort();

        const answers = answerKeys.map((key) => data[key]);
        const selectedIndex = answers.indexOf(selectedVote);

        if (selectedIndex !== -1) {
            const voteKey = voteKeys[selectedIndex];

            databases.updateDocument(db_id, colection_id, data.$id, {
                [voteKey]: data[voteKey] + 1,
            });

            if (type === "king_") {
                setIsKingSubmitted(true);
                localStorage.setItem(`voted_king_${data.$id}`, "true");
            } else {
                setIsQueenSubmitted(true);
                localStorage.setItem(`voted_queen_${data.$id}`, "true");
            }
        }
    };

    if (!data) return null;

    const getTotalVotes = (prefix) =>
        Object.keys(data)
            .filter((key) => key.startsWith(prefix))
            .reduce((total, key) => total + data[key], 0);

    const totalKingVotes = getTotalVotes("kvotes_");
    const totalQueenVotes = getTotalVotes("qvotes_");

    return (
        <>
            <div className="">
                <div className="header">
                    <h2 className="font-bold text-4xl text-fancy-red">{data.text}</h2>
                </div>
                <div className="coverall flex">
                    <div className="kingg w-full">
                        <div className="leaderboard mt-10 mb-4">
                            <h1 className="capitalize font-semibold text-fancy-red text-xl mb-2">Leaderboard King</h1>
                            <span className="text-fancy-red capitalize font-medium">Total voters: {totalKingVotes}</span>
                        </div>

                        <form onSubmit={(e) => handleSubmit(e, "king_")} className="flex flex-col gap-4 votes-container">
                            {Object.keys(data)
                                .filter((key) => key.startsWith("king_"))
                                .sort()
                                .map((key, index) => {
                                    const voteKey = `kvotes_${index + 1}`;

                                    return (
                                        <label key={key} className="flex items-center">
                                            <input
                                                className="peer appearance-none"
                                                type="radio"
                                                name="king_"
                                                value={data[key]}
                                                disabled={isKingSubmitted}
                                                id={data[key]} />
                                            <Vote text={data[key]} percentage={totalKingVotes ? Math.floor((data[voteKey] / totalKingVotes) * 100) : 0} votes={data[voteKey]} />
                                        </label>
                                    );
                                })}
                            <Button type="submit" status="King" condition={isKingSubmitted} />
                        </form>
                    </div>
                    <div className="queennn w-full">
                        <div className="leaderboard mt-10 mb-4">
                            <h1 className="capitalize font-semibold text-fancy-red text-xl mb-2">Leaderboard Queen</h1>
                            <span className="text-fancy-red capitalize font-medium">Total voters: {totalQueenVotes}</span>
                        </div>

                        <form onSubmit={(e) => handleSubmit(e, "queen_")} className="flex flex-col gap-4 votes-container">
                            {Object.keys(data)
                                .filter((key) => key.startsWith("queen_"))
                                .sort()
                                .map((key, index) => {
                                    const voteKey = `qvotes_${index + 1}`;

                                    return (
                                        <label key={key} className="flex items-center">
                                            <input
                                                className="appearance-none peer"
                                                type="radio"
                                                name="queen_"
                                                value={data[key]}
                                                disabled={isQueenSubmitted}
                                                id={data[key]} />
                                            <Vote text={data[key]} percentage={totalQueenVotes ? Math.floor((data[voteKey] / totalQueenVotes) * 100) : 0} votes={data[voteKey]} />
                                        </label>
                                    );
                                })}
                            <Button type="submit" status="Queen" condition={isQueenSubmitted} />
                        </form>
                    </div>
                </div>
            </div>

        </>
    );
};

export default Question;
