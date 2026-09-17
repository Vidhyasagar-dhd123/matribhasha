"use server";

import Input from "@/modules/admin/components/Input";


export default async function Page() {
  return (
    <div className="p-4 flex flex-col items-center bg-secondary">
      <Input label="Name"></Input>
      <Input label="Email"></Input>
      <Input label="Password" type="password"></Input>
    </div>
  );
}