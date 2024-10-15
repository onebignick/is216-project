import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {

  return (
    <main className="flex">
      <HomePanel/>
    </main>
  );
}

async function HomePanel() {
  const user = await currentUser()

  return (
    <section>
      <Card>
        <CardHeader>
          <CardTitle>
            Welcome back, {user!.username}!
          </CardTitle>
          <CardDescription>
            What would you like to do today?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CardTitle>Upcoming Events</CardTitle>
        </CardContent>
      </Card>
    </section>
  )
}
