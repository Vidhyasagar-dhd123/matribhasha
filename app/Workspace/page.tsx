import { ActivityPanel } from "@/modules/workspace/componnents/ActivityPanel";
import { SearchBar } from "@/modules/workspace/componnents/SearchBar";

const WorkspacePage = () => {
  return <div>
    <div className="flex md:flex-row flex-col w-full items-center justify-between">
      <SearchBar/>
      <ActivityPanel/>
    </div>
  </div>;
}

export default WorkspacePage