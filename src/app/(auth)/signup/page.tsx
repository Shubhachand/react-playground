import SignupForm from '@/components/auth/SignupForm';

export default function SignupPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white overflow-hidden">

      {/* Optional Background Image */}
      <div className="absolute inset-0 bg-[url('/image.jpg')] bg-cover bg-center opacity-10 z-0" />

      {/* Branding */}
      <div className="absolute top-10 text-center z-10">
        <h1 className="text-4xl font-bold text-white drop-shadow-lg">Reactify AI</h1>
        <p className="text-sm text-gray-300">Prompt. Generate. React.</p>
      </div>

      {/* Signup Form */}
      <div className="z-10 w-full max-w-md p-6">
        <SignupForm />
      </div>
    </div>
  );
}
