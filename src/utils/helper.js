import { GET_ANIME_DETAILS_BY_ID, GET_ANIME_EPISODES_BY_ID, SEARCH_ANIME, TOP_AIRING_ANIME } from "./api";

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

export async function getTopAnime() {
  try {
    const response = await fetch(TOP_AIRING_ANIME());
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
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error);
  }
}
