import {
  GET_ANIME_DETAILS_BY_ID,
  GET_ANIME_EPISODES_BY_ID,
  SEARCH_ANIME,
  SEARCH_TORRENT,
  TOP_AIRING_ANIME,
  TOP_ANIME,
} from "./api";

export async function searchAnime(text, limit = 10) {
  try {
    if (text === "asd") throw new Error("Invalid search query");
    const response = await fetch(SEARCH_ANIME(text, limit));
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error);
  }
}

/* ------------------------------------------------------ */
export async function getTopAiringAnime() {
  try {
    const response = await fetch(TOP_AIRING_ANIME());

    if (response.status === 429) {
      throw new Error("Too many requests to the API. You are being rate-limited. Please wait a min and refresh the page.");
    } else if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Error ${response.status}: ${response.statusText} - ${errorData.message}`,
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error);
  }
}
/* ------------------------------------------------------ */

export async function getTopAnime(page = 1) {
  // set time out to prevent too many requests
  console.log("Fetching top anime with page:", page);

  await new Promise((resolve) => setTimeout(resolve, 300)); // 900 milliseconds delay
  try {
    const response = await fetch(TOP_ANIME(page), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 429) {
      console.log("Too many requests to the API. You are being rate-limited. Please wait a min and refresh the page.");
      throw new Error("Too many requests to the API. You are being rate-limited. Please wait a min and refresh the page.");
    } else if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Error ${response.status}: ${response.statusText} - ${errorData.message}`,
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getAnimeById(id) {
  try {
    console.log("Fetching anime with id:", id);

    const response = await fetch(GET_ANIME_DETAILS_BY_ID(id));

    if (response.status === 429) {
      throw new Error("Too many requests to the API. You are being rate-limited. Please wait a min and refresh the page.");
    } else if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Error ${response.status}: ${response.statusText} - ${errorData.message}`,
      );
    }

    const data = await response.json();
    console.log(data);

    return data;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getAnimeEpisodesById(id) {
  try {
    const response = await fetch(GET_ANIME_EPISODES_BY_ID(id));

    if (response.status === 429) {
      throw new Error("Too many requests to the API. You are being rate-limited. Please wait a min and refresh the page.");
    } else if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Error ${response.status}: ${response.statusText} - ${errorData.message}`,
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error);
  }
}

// const searchQuery = `${anime} Episode ${data.mal_id < 10 ? `0${data.mal_id}` : data.mal_id}`;
//     const response = await fetch(SEARCH_TORRENT(searchQuery));
//     const data2 = await response.json();
export async function searchTorrent(query) {
  try {
    const response = await fetch(SEARCH_TORRENT(query));
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}
