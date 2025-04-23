import AuthForm from "@/components/AuthForm";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Login | Language Assistant",
  description: "Login to your language assistant account",
};

const LoginPage = () => {
  return (
    <div className="flex min-h-screen w-screen flex-col items-center justify-center p-4">
      <div className="mx-auto grid w-full max-w-[1000px] grid-cols-1 overflow-hidden rounded-2xl border shadow-xl md:grid-cols-2">
        <div className="flex items-center justify-center p-6 animate-fade-in">
          <AuthForm type="login" />
        </div>
        <div className="relative hidden bg-muted md:block">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 mix-blend-multiply" />
          <Image
            src="/images/login-preview.jpg"
            alt="Language assistant illustration"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-slate-900/20 p-10 flex flex-col justify-end">
            <div className="glass p-6 rounded-xl max-w-md animate-slide-up">
              <h2 className="text-2xl font-bold text-white">
                Language Assistant
              </h2>
              <p className="text-slate-200 mt-2">
                Your AI-powered language learning companion
              </p>
              <div className="flex gap-2 mt-4">
                <span className="level-indicator level-beginner">Beginner</span>
                <span className="level-indicator level-intermediate">
                  Intermediate
                </span>
                <span className="level-indicator level-advanced">Advanced</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
