import { Skeleton } from "@/components/ui/skeleton";

export default function HomePageSkeleton() {
    return (
        <main className="grid grid-cols-12 grid-rows-4 gap-4 p-4">
            <Skeleton className="hidden md:block md:min-h-[250px] md:col-span-4 lg:col-span-6"/>
            <Skeleton className="hidden md:block md:min-h-[250px] md:col-span-4 lg:col-span-3"/>
            <Skeleton className="hidden md:block md:min-h-[250px] md:col-span-4 lg:col-span-3"/>
            <Skeleton className="row-span-2 col-span-12 lg:row-span-3 lg:col-span-8"/>
            <Skeleton className="row-span-2 col-span-12 lg:row-span-3 lg:col-span-4"/>
        </main>
    );
}