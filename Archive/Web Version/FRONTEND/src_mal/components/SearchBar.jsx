import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Code, TextField } from "@radix-ui/themes";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import SearchResults from "./SearchResults";
import { searchAnime } from "../utils/helper";

export default function SearchBar() {
  const [searchText, setSearchText] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [isActive, setIsActive] = useState(false);

  const inputRef = useRef(null);
  const searchBarRef = useRef(null);

  const navigate = useNavigate();

  console.log(searchText);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target)
      ) {
        setIsActive(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchBarRef]);

  const handleSearchChange = (event) => {
    setSearchData([]);
    setSearchText(event.target.value);
    // console.log(event.target.value);
  };

  const handleSearchText = useCallback(async function handleSearchText(
    searchText,
  ) {
    if (searchText) {
      const data = await searchAnime(searchText);
      setSearchData(data);
    } else {
      toast.error("Invalid search query", {
        icon: <MagnifyingGlassIcon height="16" width="16" color="#ffffff" />,
        description: "Please enter a valid search query",
        classNames: {
          title: "text-rose-500",
        },
      });
      return;
    }
  }, []);

  // console.log(searchData);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (
        event.key === "Enter" &&
        inputRef.current === document.activeElement
      ) {
        handleSearchText(searchText);
      }
      if (event.ctrlKey && event.key === "k") {
        event.preventDefault();
        inputRef.current.select();
        inputRef.current.focus();
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleSearchText, searchText]);

  return (
    <div ref={searchBarRef} className="relative">
      <TextField.Root
        placeholder={"Search"}
        onInput={handleSearchChange}
        ref={inputRef}
        type="text"
        value={searchText}
        onFocus={() => setIsActive(true)}
        // onBlur={() => setIsActive(false)}
      >
        <TextField.Slot>
          <MagnifyingGlassIcon height="16" width="16" />
        </TextField.Slot>
        <TextField.Slot
          className="transition-all duration-100 ease-in-out hover:cursor-pointer hover:bg-[#5a5e6750]"
          onClick={() => handleSearchText(searchText)}
        >
          <Code size={"1"} color="gray" variant="outline">
            ctrl
          </Code>
          <Code size={"1"} color="gray" variant="outline">
            k
          </Code>
        </TextField.Slot>
      </TextField.Root>

      {isActive && (
        <div className="absolute mt-2 flex w-full animate-fade-down flex-col justify-center animate-duration-[400ms]">
          {searchData?.data?.map((x) => (
            <SearchResults key={x.mal_id} data={x} setIsActive={setIsActive} />
          ))}
        </div>
      )}
    </div>
  );
}
