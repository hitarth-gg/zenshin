import { useEffect } from "react";
import CenteredLoader from "../ui/CenteredLoader";
import { toast } from "sonner";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";

export default function AnilistAuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const getAccessToken = async () => {
      const hash = window.location.hash;

      if (hash) {
        const params = new URLSearchParams(hash.substring(1)); // Remove the # at the beginning
        const accessToken = params.get("access_token");
        const tokenType = params.get("token_type");
        const expiresIn = params.get("expires_in");

        if (accessToken) {
          // Store the access token in local storage
          localStorage.setItem("anilist_token", accessToken);
          console.log(`Access Token: ${accessToken}`);
          console.log(`Token Type: ${tokenType}`);
          console.log(`Expires In: ${expiresIn}`);

          window.location.replace("/");

          toast.success("Successfully logged in to AniList", {
            icon: (
              <ExclamationTriangleIcon height="16" width="16" color="#ffffff" />
            ),
            classNames: {
              title: "text-green-500",
            },
          });
        }
      }
    };

    getAccessToken();
  }, []);

  return (
    <div>
      <CenteredLoader />
    </div>
  );
}
