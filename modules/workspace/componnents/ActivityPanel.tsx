import { BookMarked, Clock } from "lucide-react"


export const ActivityPanel = () =>{
    return <div className="w-full flex items-center min-h-screen justify-center bg-[var(--background)]">
        <div className="h-full min-h-screen w-full flex flex-col items-center">
            <h1 className="text-center text-xl font-bold pt-10">Hello Raghuveer!!</h1>
            <div className="m-4 flex flex-col justify-center max-w-6xl lg:min-w-6xl">
                <div className="mx-10 flex items-center text-gray-600">
                    <Clock/>
                    <h2 className="text-2xl m-4 font-bold">Your Activity</h2>
                </div>
                <div className="w-full ">
                    <div className="inline-block p-4 bg-[var(--secondary)] m-4 rounded max-w-max">Hello How are you</div>
                    <div className="inline-block p-4 bg-[var(--secondary)] m-4 rounded max-w-max">Hello how are you</div>
                    <div className="inline-block p-4 bg-[var(--secondary)] m-4 rounded max-w-max">Hello How are you</div>
                </div>
            </div>
            <div className="m-10 flex flex-col justify-center max-w-6xl lg:min-w-6xl">
                <div className="mx-10 flex items-center text-gray-600">
                    <BookMarked/>
                    <h2 className="text-2xl m-4 font-bold">Saved Books</h2>
                </div>
                <div className="w-full ">
                    <div className="inline-block p-4 bg-[var(--secondary)] m-4 rounded max-w-max">Hello How are you</div>
                    <div className="inline-block p-4 bg-[var(--secondary)] m-4 rounded max-w-max">Hello how are you</div>
                    <div className="inline-block p-4 bg-[var(--secondary)] m-4 rounded max-w-max">Hello How are you</div>
                </div>
            </div>
        </div>
    </div>
}