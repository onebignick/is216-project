import SignUpForm from "@/components/ui/sign-up";
import Image from "next/image";
import Logo from "@/assets/logo.svg"

export default function Page() {
	return (
		<div className="grid grid-rows-12 gap-4 h-dvh p-5">
			<div className="flex grid-rows-1 items-center gap-2">
				<Image src={Logo} alt="meetgrid logo" className="size-12"/>
				<h1 className="content-center font-bold">Meetgrid</h1>
			</div>
			<div className="grid grid-rows-1 grid-cols-12 gap-4">
				<div className="col-span-12 sm:col-start-2 sm:col-span-10 md:col-start-3 md:col-span-8">
					<SignUpForm/>
				</div>
			</div>
		</div>
	)
}
