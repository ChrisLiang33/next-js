import { Suspense } from "react";
import getUser from "@/lib/getUser";
import getUserPost from "@/lib/getUserPosts";
import UserPosts from "./components/UserPosts";
import { Metadata } from "next";
import getAllUsers from "@/lib/getAllUsers";

import { notFound } from "next/navigation";

type Params = {
  params: {
    userId: string;
  };
};

export async function generateMetadata({
  params: { userId },
}: Params): Promise<Metadata> {
  const userData: Promise<User> = getUser(userId);
  const user: User = await userData;
  if (!user.name) {
    return {
      title: "user not found",
    };
  }
  return {
    title: user.name,
    description: `this is the page off ${user.name}`,
  };
}

export default async function UserPage({ params: { userId } }: Params) {
  const userData: Promise<User> = getUser(userId);
  const userPostsData: Promise<Post[]> = getUserPost(userId);
  //const [user, userPosts] = await Promise.all([userData, userPostsData]);
  const user = await userData;
  if (!user.name) {
    return notFound();
  }
  return (
    <>
      <h2>{user.name}</h2>
      <br />
      <Suspense fallback={<h2>Loading...</h2>}>
        {/* @ts-expect-error Server Component */}
        <UserPosts promise={userPostsData} />
      </Suspense>
    </>
  );
}

export async function generateStaticParams() {
  const userData: Promise<User[]> = getAllUsers();
  const users = await userData;

  return users.map((user) => {
    {
      userId: user.id.toString();
    }
  });
}
