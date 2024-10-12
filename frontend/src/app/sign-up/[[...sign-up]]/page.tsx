import SignUpForm from "@/components/ui/sign-up";
import Image from "next/image";
import Logo from "@/assets/logo.svg"

export default function Page() {
	return (
		<body className="bg-[#FEF4E6]">
			<div className="p-3 inline-grid grid-cols-2 gap-0">
				<Image src={Logo} alt="meetgrid logo" className="size-12"/>
				<h1 className="content-center font-bold">Meetgrid</h1>
			</div>
			<div className="m-2 container mx-auto sm:w-9/12 sm:w-12 content-center">
				<SignUpForm/>
			</div>
		</body>

	)
}
