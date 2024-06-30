import LoginForm from "@/components/auth/LoginForm"
import Link from "next/link"

const LoginPage = () => {
  return (
    <div className="flex items-center justify-center bg-[#2f303e] my-24">
      <div className="bg-[#3b3c4c] p-8 border-l-[15px] border-[#6e6dfb] w-full max-w-2xl mx-10 flex flex-col gap-8 rounded-md shadow-md">
        <h1 className="text-3xl font-bold">
          <span className="text-[#6e6dfb]">LOG</span>
          IN
        </h1>

        <LoginForm />

        <div className="text-[#9ca9b9] w-full flex justify-center gap-1">
          <span>Not a member?</span>
          <Link href="/register" className="font-bold">
            Register
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LoginPage