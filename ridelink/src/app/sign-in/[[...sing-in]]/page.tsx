import { SignIn } from "@clerk/nextjs"; // Adjust the path as needed

export default function Page() {
  return (
    <div className="flex justify-center p-8 md:p-16">
      <SignIn
        appearance={{
          variables: {
            colorPrimary: "blue",
            colorText: "black",
          },
        }}
      />
    </div>
  );
}
