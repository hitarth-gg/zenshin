import SearchBar from "./SearchBar";
import { Link } from "react-router-dom";
import zenshinLogo from "../assets/zenshinLogo.png";
import {
  DividerVerticalIcon,
  GitHubLogoIcon,
  MoonIcon,
  SunIcon,
} from "@radix-ui/react-icons";
import { Button } from "@radix-ui/themes";

export default function Header({ theme, toggleTheme }) {
  return (
    <div className="sticky top-0 z-10 flex h-12 items-center justify-between border-[#5a5e6750] bg-[#111113] bg-opacity-60 px-4 py-3 backdrop-blur-md">
      <div className="flex items-center justify-center gap-x-2">
        <Link
          className="hover: font-spaceMono flex w-fit cursor-pointer select-none gap-x-2 rounded-sm p-1 text-sm transition-all duration-200 hover:bg-[#70707030]"
          to={"/"}
        >
          {/* <span>zenshin | 全身</span> */}
          <img src={zenshinLogo} alt="" className="w-16" />
        </Link>
        <DividerVerticalIcon width={20} height={20} color="#ffffff40" />
        <Button color="gray" variant="ghost" size={"1"}>
          <a
            href="https://github.com/hitarth-gg"
            target="_blank"
            rel="noreferrer"
          >
            <GitHubLogoIcon className="my-1" width={17} height={17} />
          </a>
        </Button>
        <DividerVerticalIcon width={20} height={20} color="#ffffff40" />
        <Button color="gray" variant="ghost" size={"1"}>
          <Link to="/newreleases">
            <div className="p-1 font-space-mono text-[.8rem]">New Releases</div>
          </Link>
        </Button>
      </div>

      <div className="w-2/6">
        <SearchBar />
      </div>
      <div className="flex items-center justify-center gap-x-8">
        <Link target="_blank" to="https://github.com/hitarth-gg/zenshin">
          <Button color="gray" variant="ghost" size={"1"}>
            <div className="p-1 text-[.8rem]">How to use</div>
          </Button>
        </Link>
        <Button color="gray" variant="ghost" size={"1"} onClick={toggleTheme}>
          {theme === "dark" ? (
            <MoonIcon className="my-1" width={17} height={17} />
          ) : (
            <SunIcon className="my-1" width={17} height={17} />
          )}
        </Button>
      </div>
    </div>
  );
}
