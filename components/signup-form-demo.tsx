"use client";
import React, {useState} from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconBrandOnlyfans,
} from "@tabler/icons-react";

type Props = {
  variant?: "signup" | "contact";
  onSubmit?: (data: Record<string, string>) => void;
};

export default function SignupFormDemo({ variant = "signup", onSubmit }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Capture the form element before any await to avoid null currentTarget
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    const data: Record<string, string> = {};
    form.forEach((v, k) => (data[k] = String(v)));

    try {
      setIsLoading(true);
      const res = await fetch("/api/mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setIsLoading(false);
        console.log("✅ Email sent successfully!");
        toast.success("Message sent successfully!");
        if (formEl && typeof (formEl as HTMLFormElement).reset === "function") {
          (formEl as HTMLFormElement).reset(); // clear form fields
        }
      } else {
        setIsLoading(false);
        console.error("❌ Failed to send message:", result.error || result.message);
        toast.error(result.error || result.message || "Failed to send message. Please try again.");
      }
    } catch (err) {
      console.error("⚠️ Error submitting form:", err);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };


  const isContact = variant === "contact";

  return (
    <div className="dark">
      <div className="shadow-input w-full max-w-md md:max-w-none rounded-none p-4 pt-0 md:rounded-2xl md:p-8 md:pt-0 bg-black">

        <form className={isContact ? "mt-0 pl-0" : "my-8"} onSubmit={handleSubmit}>
          {isContact ? (
            <>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" placeholder="Your name" type="text" required />
              </LabelInputContainer>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" placeholder="you@example.com" type="email" required />
              </LabelInputContainer>
              <LabelInputContainer className="mb-6">
                <Label htmlFor="message">Message</Label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Tell me a bit about your project or question..."
                  rows={5}
                  className="w-full rounded-md border border-neutral-200 px-3 py-2 text-sm text-neutral-800 placeholder-neutral-400 outline-none transition focus:border-neutral-400 dark:border-neutral-800 bg-zinc-900 dark:text-neutral-200 dark:placeholder-neutral-500"
                  required
                />
              </LabelInputContainer>
              <button
                className="group/btn relative block h-10 w-full rounded-md bg-linear-to-br cursor-pointer from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
                type="submit"
              >
                {isLoading ? "Sending..." : "Send message →"}
                <BottomGradient />
              </button>
            </>
          ) : (
            <>
              <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
                <LabelInputContainer>
                  <Label htmlFor="firstname">First name</Label>
                  <Input id="firstname" name="firstname" placeholder="Tyler" type="text" />
                </LabelInputContainer>
                <LabelInputContainer>
                  <Label htmlFor="lastname">Last name</Label>
                  <Input id="lastname" name="lastname" placeholder="Durden" type="text" />
                </LabelInputContainer>
              </div>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" placeholder="projectmayhem@fc.com" type="email" />
              </LabelInputContainer>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" placeholder="••••••••" type="password" />
              </LabelInputContainer>
              <LabelInputContainer className="mb-8">
                <Label htmlFor="twitterpassword">Your twitter password</Label>
                <Input
                  id="twitterpassword"
                  name="twitterpassword"
                  placeholder="••••••••"
                  type="password"
                />
              </LabelInputContainer>

              <button
                className="group/btn relative block h-10 w-full rounded-md bg-linear-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
                type="submit"
              >
                Sign up &rarr;
                <BottomGradient />
              </button>

              <div className="my-8 h-px w-full bg-linear-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

              <div className="flex flex-col space-y-4">
                <button
                  className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
                  type="submit"
                >
                  <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">
                    GitHub
                  </span>
                  <BottomGradient />
                </button>
                <button
                  className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
                  type="submit"
                >
                  <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">
                    Google
                  </span>
                  <BottomGradient />
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-linear-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-linear-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};
