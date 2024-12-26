import { UserProfile } from "@clerk/nextjs";

const page = () => {
  return (
    <div className="flex justify-center min-h-screen bg-black pt-12">
      <UserProfile
        appearance={{
          variables: {
            colorBackground: "#000000",
            colorText: "#ffffff",
            colorPrimary: "#ffcc00",
          },
          elements: {
            card: "bg-gray-900 shadow-lg rounded-lg",
            cardHeader: "text-yellow-400",
            formButtonPrimary:
              "bg-yellow-500 hover:bg-yellow-600 text-black font-bold",
            formFieldInput:
              "bg-gray-800 text-white border border-gray-700 focus:ring-yellow-500",
          },
        }}
      />
    </div>
  );
};

export default page;
