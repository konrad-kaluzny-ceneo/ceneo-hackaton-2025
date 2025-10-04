"use client";

import { useUser } from "@/infrastructure/FrontendUserAccessor";

export default function User() {
  const user = useUser();
  return <></>;
}