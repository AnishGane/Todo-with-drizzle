import { Suspense } from "react";
import TodoServer from "./todo-server";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-svh flex items-center justify-center">Loading...</div>}>
      <TodoServer />
    </Suspense>
  );
}
