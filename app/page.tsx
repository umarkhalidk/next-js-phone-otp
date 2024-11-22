import OTPLogin from "@/components/OTPLogin";

export default function Home() {
  return (
    <div className="flex flex-col h-96 justify-center items-center">
      <h2 className="text-center font-bold mb-2" >Login With Phone OTP</h2>
      <OTPLogin />
    </div>
  );
}
