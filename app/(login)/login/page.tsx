import { headers, cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconBrandOpenai,
} from "@tabler/icons-react";

type SupportedProvider = "github" | "google";

export default function Login({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const signIn = async (formData: FormData) => {
    "use server";
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const provider = formData.get("provider") as SupportedProvider;
    const headersList = headers();
    console.log(headersList.get("host"));
    console.log(provider);
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `http://${headersList.get("host")}/auth/callback`,
      },
    });

    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }
    return redirect(data.url);
  };

  return (
    <>
      <div className="w-full flex flex-col items-center gap-4">
        <div className={"text-xl font-bold flex flex-row gap-2"}>
          <IconBrandOpenai /> FakeGPT
        </div>
        <div className={"text-gray-400"}>Sign in to get started!</div>
        <div className={"flex flex-col w-full items-center"}>
          <form
            className="animate-in gap-2 text-foreground w-1/2"
            action={signIn}
          >
            <input hidden value={"github"} name="provider" readOnly />
            <button className="bg-teal-500 rounded-md px-4 py-2 text-foreground mb-2 w-full flex flex-row gap-2 justify-center">
              <IconBrandGithub /> Sign in with Github
            </button>
          </form>
          <form
            className="animate-in gap-2 text-foreground w-1/2 flex justify-around"
            action={signIn}
          >
            <input hidden value={"google"} name="provider" readOnly />
            <button className="bg-teal-500 rounded-md px-4 py-2 text-foreground mb-2 w-full flex flex-row gap-2 justify-center">
              <IconBrandGoogle /> Sign in with Google
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
