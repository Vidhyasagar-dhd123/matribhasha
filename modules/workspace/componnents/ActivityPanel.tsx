import { BookMarked, Clock } from "lucide-react"


export const ActivityPanel = () =>{
    return <div className="w-full flex items-center h-screen justify-center bg-gray-100">
        <div className="h-full w-full flex flex-col items-center">
            <h1 className="text-center text-xl font-bold pt-10">Hello Raghuveer!!</h1>
            <div className="m-4 flex flex-col justify-center max-w-6xl min-w-6xl">
                <div className="mx-10 flex items-center text-gray-600">
                    <Clock/>
                    <h2 className="text-2xl m-4 font-bold">Your Activity</h2>
                </div>
                <div className="w-full ">
                    <div className="inline-block p-4 bg-white m-4 rounded max-w-max">Hello How are you</div>
                    <div className="inline-block p-4 bg-white m-4 rounded max-w-max">Hello how are you</div>
                    <div className="inline-block p-4 bg-white m-4 rounded max-w-max">Hello How are you</div>
                </div>
            </div>
            <div className="m-10 flex flex-col justify-center max-w-6xl min-w-6xl">
                <div className="mx-10 flex items-center text-gray-600">
                    <BookMarked/>
                    <h2 className="text-2xl m-4 font-bold">Saved Books</h2>
                </div>
                <div className="w-full ">
                    <div className="inline-block p-4 bg-white m-4 rounded max-w-max">Hello How are you</div>
                    <div className="inline-block p-4 bg-white m-4 rounded max-w-max">Hello how are you</div>
                    <div className="inline-block p-4 bg-white m-4 rounded max-w-max">Hello How are you</div>
                </div>
            </div>
        </div>
    </div>
}