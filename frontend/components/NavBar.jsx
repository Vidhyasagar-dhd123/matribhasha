
const NavBar = () =>{
    return (
        //NavBar with
        <div className="container cursor-pointer min-w-full sticky top-0 !px-0 !bg-[var(--primary-color)]">
            <div className="flex flex-row justify-between">
                <div className="container !py-0 max-w-25 ">
                    NavBar
                </div>
                <div className="flex flex-row justify-between px-2  grow w-50 gap-x-2 max-w-75 mx-4">
                    <div className="mx-4">Home</div>
                    <div className="mx-4">About</div>
                    <div className="mx-4">Contact</div>
                    <div className="mx-4">Login</div>
                </div>
            </div>
        </div>
    )
}

export default NavBar