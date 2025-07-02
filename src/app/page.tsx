"use client";
import { signOut } from "next-auth/react";

export default function Home() {
  return (
    <h4>
      Hello{" "}
      <button
        onClick={() =>
          signOut({
            callbackUrl: "/login", // logout করার পরে এই পেজে যাবে
          })
        }
      >
        Sign out
      </button>
    </h4>
  );
}
