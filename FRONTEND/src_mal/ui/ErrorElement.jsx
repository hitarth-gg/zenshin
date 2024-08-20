import { useRouteError } from "react-router-dom";
import psyduck from "../assets/psyduck.png";

export default function ErrorElement({ title="Something Went wrong !", text, type }) {
  const error = useRouteError();

  const style = {
    outer: `border-rose-500 bg-rose-500`,
    inner: `text-rose-500`,
  };

  if (type === "warning") {
    style.outer = `border-orange-500 bg-orange-500`;
    style.inner = `text-orange-500`;
  } else if (type === "info") {
    style.outer = `border-sky-500 bg-sky-500`;
    style.inner = `text-sky-500
    `;
  }

  return (
    <div
      className={`w-fit rounded-md border ${style.outer} bg-opacity-5 px-8 py-4`}
    >
      <div className="flex flex-col items-center justify-center">
        <img src={psyduck} className="w-10" alt="" />
        <div className={`font-medium ${style.inner}`}>
          {title}
        </div>
        <p className="text-sm">
          {text || error?.data || error?.message || "Unknown Error"}
        </p>
      </div>
    </div>
  );
}
