import { useState } from "react"

const Button = ({ type, condition, status }) => {
    return (
        <button
            type={type}
            disabled={condition}
            className="border-2 border-fancy-red p-2.5 rounded-xl text-md font-semibold w-44 transition-all duration-300 ease-in-out bg-fancy-red active:bg-light-pink active:border-light-pink text-white cursor-pointer hidden">
            Vote {status}
        </button>
    )
}
export default Button