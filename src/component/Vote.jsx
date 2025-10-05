const Vote = ({ text, percentage, votes }) => {
    return (
        <div className="w-full votes border-2 border-transparent transition-all duration-300 ease-in-out shadow-lg rounded-xl peer-checked:border-fancy-red peer-checked:shadow-3xl px-4 py-2 ">
            <label
                htmlFor={text}
                className="flex flex-row justify-between items-center cursor-pointer"
            >
                <div>
                    <p className="font-semibold text-fancy-red">
                        {text}
                    </p>
                    <small className="text-gray-900">{votes} votes</small>
                </div>
                <div>
                    <span className="font-semibold text-fancy-red">{percentage || 0}%</span></div>
            </label>
        </div>
    )
}
export default Vote