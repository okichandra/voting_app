import logo from '../assets/error404.svg'

const ErrorPage = () => {
    return (
        <div className=" h-dvh flex font-set-poppins flex-col items-center justify-center bg-gray-100 px-6">
            <img src={logo} alt="" />
            <p className="text-2xl text-fancy-red font-medium text-center">Apa yang anda cari tidak ada!</p>
        </div>
    )
}
export default ErrorPage