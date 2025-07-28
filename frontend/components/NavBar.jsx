
const NavBar = () =>{
        /*  
+========================================================================================+
|                                                                                        |
|          Is exported in files :                                                        |
|              ./Layout.jsx                                                              |
|                                                                                        |
|          This file imports                                                             |
|              variable colors from : styles/components/personalization.css              |
|              custom classes from : styles/components/containers.css                    |
|                                                                                        |
|          after changes put your update in this comment.                                |
|                                                                                        |
+========================================================================================+
        */
    return (
        <div className="w-full sticky top-0 !bg-[var(--primary-color)]">
            <div className="flex flex-row justify-between align-middle">
                <div className="flex container !py-4 max-w-25 items-center relative sm:static">
                    MatriBhasha
                </div>
                <div className=" flex-row justify-between grow gap-x-2   absolute bg-amber-50 w-full hidden  top-0 left-0 sm:flex sm:static sm:bg-[var(--primary-color)] sm:max-w-150">
                    <div className="flex items-center justify-between p-2 flex-col m-2 w-10 h-5 rounded bg-amber-300 mx-2 relative  sm:hidden sm:mx-10">
                        <span className="w-10 h-1 bg-white rounded "></span>
                        <span className="w-10 h-1 bg-white rounded "></span>
                        <span className="w-10 h-1 bg-white rounded "></span>
                    </div>
                    <div className="p-2 m-2 hover:bg-amber-200 rounded">Home</div>
                    <div className="p-2 m-2 hover:bg-amber-200 rounded">About</div>
                    <div className="p-2 m-2 hover:bg-amber-200 rounded">Contact</div>
                    <div className="my-2 p-2 mx-10 hover:bg-amber-200 rounded">Login</div>
                    
                </div>
                
            </div>
        </div>
    )
}

export default NavBar