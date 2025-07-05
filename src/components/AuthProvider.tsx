// components/AuthProvider.tsx (or wherever you store it)

"use client";

import { ImageKitProvider } from "@imagekit/next";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}
const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT!;

export default function AuthProvider({ children }: Props) {
  return 
    <SessionProvider>
        <ImageKitProvider urlEndpoint={urlEndpoint}>
            {children}
        </ImageKitProvider>
    </SessionProvider>;
}
