import { BookMarked, Clock } from "lucide-react"


export const ActivityPanel = () =>{
    return <div className="w-full flex items-center min-h-screen justify-center ">
        <div className="h-full min-h-screen w-full flex flex-col items-center">
            <h1 className="  font-bold pt-10">Hello User!!</h1>
            <div className="m-4 flex flex-col justify-center max-w-6xl lg:min-w-6xl">
                <div className="mx-10 flex items-center ">
                    <Clock/>
                    <h2 className=" m-4 font-bold">Your Activity</h2>
                </div>
                <div className="w-full ">
                    <div className="inline-block p-4  m-4 rounded max-w-max">Hello How are you</div>
                    <div className="inline-block p-4  m-4 rounded max-w-max">Hello how are you</div>
                    <div className="inline-block p-4  m-4 rounded max-w-max">Hello How are you</div>
                </div>
            </div>
            <div className="m-10 flex flex-col justify-center max-w-6xl lg:min-w-6xl">
                <div className="mx-10 flex items-center ">
                    <BookMarked/>
                    <h2 className=" m-4 font-bold">Saved Books</h2>
                </div>
                <div className="w-full ">
                    <div className="inline-block p-4  m-4 rounded max-w-max">Hello How are you</div>
                    <div className="inline-block p-4  m-4 rounded max-w-max">Hello how are you</div>
                    <div className="inline-block p-4  m-4 rounded max-w-max">Hello How are you</div>
                </div>
            </div>
        </div>
    </div>
}