import { BookStats } from "../utils/books";

const BooksStatBar = ({data}: {data: BookStats}) => {
    return (
        <div className=" p-4 rounded-lg shadow-lg flex flex-wrap gap-6 justify-around bg-background">
            {
                Object.entries(data).map(([key, value]) => (
                    <div key={key} className="flex items-center min-w-[100px]">
                        <span className="  dark:">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} :</span>
                        <span className=" font-bold"> {Array.isArray(value) ? value.join(", ") : value}</span>
                    </div>
                ))
            }
        </div>
    );
}

export default BooksStatBar;