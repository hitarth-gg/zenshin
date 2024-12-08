import SearchBar from "./SearchBar";
import { Link } from "react-router-dom";
import zenshinLogo from "../assets/zenshinLogo.png";
import {
  DividerVerticalIcon,
  GitHubLogoIcon,
  PersonIcon,
  ShadowIcon,
  ShadowNoneIcon,
} from "@radix-ui/react-icons";
import { Button, DropdownMenu, Tooltip } from "@radix-ui/themes";
import { useZenshinContext } from "../utils/ContextProvider";
import { anilistAuthUrl } from "../utils/auth";
import { ANILIST_CLIENT_ID } from "../utils/auth";
import { useState } from "react";
import useGetAnilistProfile from "../hooks/useGetAnilistProfile";
import { toast } from "sonner";

export default function Header({ theme }) {
  const zenshinContext = useZenshinContext();
  function toggleGlow() {
    zenshinContext.setGlow(!zenshinContext.glow);
  }

  /* -------------------- ANILIST AUTH -------------------- */
  const [anilistToken, setAnilistToken] = useState(
    localStorage.getItem("anilist_token") || "",
  );

  const {
    isLoading,
    data: userProfile,
    error: userProfileError,
    status,
  } = useGetAnilistProfile(anilistToken);

  console.log("anilistToken: ", anilistToken);

  const handleLogin = () => {
    window.location.href = anilistAuthUrl;
  };

  const handleLogout = () => {
    localStorage.removeItem("anilist_token");
    localStorage.removeItem("anilist_id");
    localStorage.removeItem("anilist_name");
    setAnilistToken("");

    // refresh the page
    window.location.reload();
  };

  if (userProfileError) {
    toast.error("Error fetching Anilist Profile", {
      description: userProfileError?.message,
      classNames: {
        title: "text-rose-500",
      },
    });
  }

  return (
    <div className="sticky top-0 z-20 flex h-12 items-center justify-between border-[#5a5e6750] bg-[#111113] bg-opacity-60 px-4 py-3 backdrop-blur-md">
      <div className="flex items-center justify-center gap-x-2">
        <Link
          className="hover: font-spaceMono flex w-fit cursor-pointer select-none gap-x-2 rounded-sm p-1 text-sm transition-all duration-200 hover:bg-[#70707030]"
          to={"/"}
        >
          <img src={zenshinLogo} alt="" className="w-16" />
        </Link>
        <DividerVerticalIcon width={20} height={20} color="#ffffff40" />
        <a
          href="https://github.com/hitarth-gg"
          target="_blank"
          rel="noreferrer"
        >
          <Button color="gray" variant="ghost" size={"1"}>
            <GitHubLogoIcon className="my-1" width={17} height={17} />
          </Button>
        </a>
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
        {!anilistToken && (
          <Tooltip content="Login With Anilist">
            <Button
              color="gray"
              variant="ghost"
              size={"1"}
              onClick={handleLogin}
            >
              <PersonIcon className="my-1" width={16} height={16} />
            </Button>
          </Tooltip>
        )}
        {userProfile && (
          <DropdownMenu.Root modal={false}>
            <DropdownMenu.Trigger>
              <Button variant="ghost" color="gray">
                <div className="flex animate-fade items-center gap-x-2">
                  <img
                    src={userProfile.avatar.large}
                    alt="avatar"
                    className="h-6 w-6 rounded-full"
                  />
                  <div className="font-space-mono text-[.8rem]">
                    {userProfile.name}
                  </div>
                </div>
                <DropdownMenu.TriggerIcon />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.Item shortcut="⌘ N">Archive</DropdownMenu.Item>
              <DropdownMenu.Sub>
                <DropdownMenu.SubTrigger>More</DropdownMenu.SubTrigger>
                <DropdownMenu.SubContent>
                  <DropdownMenu.Item>Move to project…</DropdownMenu.Item>
                  <DropdownMenu.Item>Move to folder…</DropdownMenu.Item>

                  <DropdownMenu.Separator />
                  <DropdownMenu.Item>Advanced options…</DropdownMenu.Item>
                </DropdownMenu.SubContent>
              </DropdownMenu.Sub>
              <DropdownMenu.Item color="red" onClick={handleLogout}>
                Logout
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        )}

        <Link target="_blank" to="https://github.com/hitarth-gg/zenshin">
          <Button color="gray" variant="ghost" size={"1"}>
            <div className="p-1 text-[.8rem]">How to use</div>
          </Button>
        </Link>
        <Button
          color="gray"
          variant="ghost"
          size={"1"}
          onClick={() => toggleGlow()}
        >
          {zenshinContext.glow ? (
            <ShadowIcon className="my-1" width={16} height={16} />
          ) : (
            <ShadowNoneIcon className="my-1" width={16} height={16} />
          )}
        </Button>
      </div>
    </div>
  );
}
