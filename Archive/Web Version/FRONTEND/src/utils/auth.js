// export const ANILIST_CLIENT_ID = () => {
//   const url = window.location.href;
//   if (url.includes("localhost")) {
//     console.log("Localhost detected");
//     return 20876;
//   } else return 20866;
// };

// export const ANILIST_CLIENT_ID = 20876;
// export const ANILIST_CLIENT_ID = 20866;
export const ANILIST_CLIENT_ID = window.location.href.includes("localhost") ? 20876 : 20866;
export const anilistAuthUrl = `https://anilist.co/api/v2/oauth/authorize?client_id=${ANILIST_CLIENT_ID}&response_type=token`;

export async function getAnilistProfile(anilistToken) {
  try {
    if (!localStorage.getItem("anilist_token")) return null;

    // Fetch user data from AniList API
    const response = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${anilistToken}`,
      },
      body: JSON.stringify({
        query: `
            query {
              Viewer {
                id
                name
                avatar {
                  large
                }
              }
            }
          `,
      }),
    });

    console.log("AniList Profile Response: ", response);

    if (response.status === 429) {
      throw new Error(
        "Too many requests to the API. You are being rate-limited. Please wait a minute and refresh the page.",
      );
    } else if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Error ${response.status}: ${response.statusText} - ${errorData.message}`,
      );
    }

    const data = await response.json();
    localStorage.setItem("anilist_id", data.data.Viewer.id);
    localStorage.setItem("anilist_name", data.data.Viewer.name);

    return data.data.Viewer;
  } catch (error) {
    console.log("Error in getAnilistProfile: ", error);
    throw new Error(error);
  }
}
