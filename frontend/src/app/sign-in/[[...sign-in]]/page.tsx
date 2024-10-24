import { FlipWords } from "@/components/ui/flip-words";
import SignInForm from "@/components/forms/sign-in";
import Image from "next/image";
import Logo from "@/assets/logo.svg"

export default function SignInPage() {
  const words: string[] = ["interviews", "meetings", "consultations"];

  return (
	<div className="grid grid-cols-12 gap-4 h-dvh p-5">
		<div className="hidden md:flex md:col-span-12 lg:col-span-6 flex-row justify-center grid grid-cols-12">
			<div className="col-span-6 flex content-center justify-end md:mr-5">
				<Image src={Logo} alt="meetgrid logo" className="mx-auto"/>
			</div>
			<div className="col-span-6 justify-start items-start content-center min-w-80">
				<h1 className="font-bold text-5xl text-left mt-5">Meetgrid</h1>
				<div className="text-black text-xl text-left mt-2">
					Streamline your
					<FlipWords words={words}/>
				</div>
			</div>
		</div>
		<div className="col-span-12 lg:col-span-6 content-center items-center">
			<SignInForm/>
		</div>
	</div>
	)
}