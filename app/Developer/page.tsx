

const Developer=()=>{
    const Info = [
        {
            heading:"Frontend Developers",
            role:[
                {text:"Design UI patterns"},
                {text:"Design Pages"},
                {text:"Design UI components"},
                {text:"Design UI themes"}
            ]
        },{
            heading:"Backend Developers",
            role:[
                {text:"Design API"},
                {text:"Design API for Database Models"},
                {text:"Suggest Performance Optimization"}
            ]
        }
    ]
    return (
        <div className="h-full flex flex-col items-center">
            <h1 className="text-4xl font-bold text-center m-4">Developers Page</h1>
            <div className="bg-gray-50 p-10 rounded-2xl">{
                Info.map((type,key)=>{
                    return (
                    <div key={key} className="p-2">
                        <h2 className="text-2xl font-semibold">{type.heading}</h2>
                        <ol className="list-decimal list-inside">
                            {type.role.map((value,key_inner)=>{
                                return(
                                    <li key={key_inner}>{value.text}</li>
                                )
                            })}
                        </ol>
                    </div>
                )

                })
            }</div>
        </div>
    )
}

export default Developer