import Image from "next/image";
import NotFound404 from "@/assets/images/404.svg";

export default function NotFound() {
  return (
    <div className="w-screen h-screen flex justify-center items-center pb-20">
      <Image src={NotFound404} alt="Image" className="h-1/2 object-contain " />
    </div>
  );
}
