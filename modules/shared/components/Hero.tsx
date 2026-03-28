
const Hero = () =>{
    return (
        <div className=" p-4  h-[80svh] from-0% from-gray-100 to-100% to-gray-200 flex flex-col justify-center items-center ">
            <div className="grid grid-cols-1 gap-4">
                <h1 className=' font-bold'>Welcome to Matribhasha</h1>
                <p>Democratizing Knowledge For Everyone By Everyone</p>
            </div>
            <button className="p-2 px-4 mt-4  rounded-full  hover:">Get Started</button>
        </div>
    )
}

export default Hero