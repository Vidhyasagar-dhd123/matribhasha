
const Hero = () =>{
    return (
        <div className="text-center p-4 bg-gradient-to-r h-[80svh] from-0% from-gray-100 to-100% to-gray-200 flex flex-col justify-center items-center ">
            <div className="grid grid-cols-1 gap-4">
                <h1 className='text-4xl font-bold'>Welcome to Matribhasha</h1>
                <p>Democratizing Knowledge For Everyone By Everyone</p>
            </div>
            <button className="p-2 px-4 mt-4 text-white rounded-full bg-blue-600 hover:bg-blue-700">Get Started</button>
        </div>
    )
}

export default Hero