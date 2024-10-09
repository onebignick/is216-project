import { FlipWords } from "@/components/ui/flip-words";
import SignInForm from "@/components/ui/sign-in";
import Image from "next/image";
import Logo from "@/assets/logo.svg"


export default function SignInPage() {
  const words: string[] = ["interviews", "meetings", "consultations"];

  return (
    <div className="grid grid-cols-4 gap-4 h-dvh p-5 bg-[#FEF4E6]">
      <div className="grid col-span-1 content-center justify-end">
        <Image src={Logo} alt="meetgrid logo"/>
      </div>
      <div className="grid col-span-1 justify-start items-start content-center">
        <h1 className="font-bold text-5xl">Meetgrid</h1>
        <div className="text-black text-xl min-w-350 max-w-359">
          Streamline your
          <FlipWords words={words}/>
          today
        </div>
      </div>
      <div className="grid col-span-2 content-center">
      <SignInForm/>
      </div>
    </div>
	)
}