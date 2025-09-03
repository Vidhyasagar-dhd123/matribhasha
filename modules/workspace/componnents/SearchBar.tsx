import { Input } from "@/modules/shared/components/Input"
import { SearchIcon } from "lucide-react"


export const SearchBar = () =>{
    return (
        <div className="md:w-60 w-full md:h-screen border border-gray-200 shadow">
            <div className="w-full flex items-center bg-gray-50">
                <Input className="grow-1 min-w-2 p-2 h-10 m-2 "/>
                <SearchIcon className="m-1 mr-4"/>
            </div>
        </div>
    )
}