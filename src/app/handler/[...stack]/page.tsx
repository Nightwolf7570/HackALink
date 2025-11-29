import { StackHandler } from "@stackframe/stack";
import { stackServerApp } from "@/stack/server";

export default function Handler() {
  return <StackHandler app={stackServerApp} />;
}
