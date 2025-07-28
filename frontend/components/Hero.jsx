const Hero = ({...props}) =>{
/*
+======================================================================+
|                                                                      |
|          Is exported in files :                                      |
|              ../pages/index.js                                       |
|                                                                      |
|          This file imports                                           |
|                                                                      |
|          after changes put your update in this comment.              |
|                                                                      |
+======================================================================+
*/

    return (
        <>
            <div {...props}>
                <div className="h-full bg-red-50 rounded  bg-repeat-round">
                    <div style={{}} title="Add an image here" className="animate-[moveBg_100s_linear_infinite] bg-[url('../public/images/my_exp.svg')]  bg-center bg-[length:80px_80px] sm:bg-[length:100px_100px] bg-scroll flex-col flex items-center justify-center min-w-full h-full ">
                        <div className="w-full h-full ">
                            <div style={{background:"#feee"}}  className="mt-50 p-10 rounded-2xl backdrop-brightness-150">  
                                <h1 className="sm:text-7xl text-6xl text-center bg-clip-text text-transparent bg-gradient-to-b from-[var(--gradient-stop-1)] from-30%  to-[var(--gradient-stop-2)]">Welcome to Matribhasha</h1>
                                    
                                <div className="flex flex-col text-center">
                                    <p>Democratizing Knowledge For Everyone By Everyone</p>
                                </div>
                            </div>
                            <div className="flex flex-col w-full items-center">
                                <div className="w-full flex flex-row justify-center items-center m-2">
                                    <span className="w-35 lg:w-100 bg-amber-800 h-[1px] rounded-2xl"></span>
                                    <div className="text-xl sm:text-2xl p-2 py-[1px] bg-[rgba(255,255,255,0.7)] border border-[1px] text-amber-800 rounded-4xl ">Features</div>
                                    <span className="w-35 lg:w-100  bg-amber-800 h-[1px] rounded-2xl"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
        
    )
}

export default Hero