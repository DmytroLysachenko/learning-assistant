import type { Metadata } from "next";
import Image from "next/image";

import AuthForm from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Register | Polish Language Assistant",
  description: "Create a new Polish language assistant account",
};

const RegisterPage = () => {
  return (
    <div className="flex min-h-screen w-screen flex-col items-center justify-center p-4">
      <div className="mx-auto grid w-full max-w-[1000px] grid-cols-1 overflow-hidden rounded-2xl border shadow-xl md:grid-cols-2">
        <div className="flex items-center justify-center p-6 animate-fade-in">
          <AuthForm type="register" />
        </div>
        <div className="relative hidden bg-muted md:block">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 mix-blend-multiply" />
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
                Start Your Journey
              </h2>
              <p className="text-slate-200 mt-2">
                Learn new languages with AI-powered assistance
              </p>
              <div className="mt-4">
                <div className="progress-container">
                  <div
                    className="progress-bar bg-gradient-to-r from-green-500 to-blue-500"
                    style={{ width: "75%" }}
                  ></div>
                </div>
                <p className="text-sm text-slate-300 mt-1">
                  Join thousands of language learners
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
