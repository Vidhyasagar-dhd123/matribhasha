

const ChapterList = () =>{
    return (
        <div className="min-w-40 h-full min-h-screen bg-blue-100">
            {
                ["Chapter1","Chapter2","Chapter3"].map((value,key)=>{
                    return <div className="bg-blue-200 border-b border-b-blue-500 p-4 text-center text-blue-800 " key={key}>{value}</div>
                })
            }
        </div>
    )
}

export default ChapterList