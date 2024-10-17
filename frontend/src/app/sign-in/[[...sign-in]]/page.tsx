import { FlipWords } from "@/components/ui/flip-words";
import SignInForm from "@/components/ui/sign-in";
import Image from "next/image";
import Logo from "@/assets/logo.svg"

export default function SignInPage() {
  const words: string[] = ["interviews", "meetings", "consultations"];

  return (
	<div className="grid grid-cols-12 gap-4 h-dvh p-5">
		<div className="col-span-12 md:col-span-6 flex flex-col md:flex-row justify-center">
			<div className="flex col-span-3 content-center justify-end md:mr-5">
				<Image src={Logo} alt="meetgrid logo" className="mx-auto"/>
			</div>
			<div className="col-span-3 justify-start items-start content-center ">
				<h1 className="font-bold text-5xl text-center mt-5">Meetgrid</h1>
				<div className="text-black text-xl min-w-350 max-w-359 text-center mt-2">
					Streamline your
					<FlipWords words={words}/>
					today
				</div>
			</div>
		</div>
		<div className="grid col-span-12 content-center md:col-span-6">
			<SignInForm/>
		</div>
	</div>
	)
}