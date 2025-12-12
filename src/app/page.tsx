import { PasswordGenerator } from "@/components/password-generator";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8">
      <PasswordGenerator />
    </div>
  );
}
