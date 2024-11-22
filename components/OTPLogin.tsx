// "use client"
// import { auth } from '@/firebase'
// import { ConfirmationResult, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'
// import { useRouter } from 'next/navigation'
// import React, { FormEvent, useEffect, useState, useTransition } from 'react'
// import { Input } from './ui/input'
// import { Button } from './ui/button'

// const OTPLogin = () => {
//     const router = useRouter()
//     const [phoneNumber, setPhoneNumber] = useState("")
//     const [otp, setOtp] = useState("")
//     const [error, setError] = useState<string | null>(null)
//     const [success, setSuccess] = useState("")
//     const [resetCountdown, setResetCountdown] = useState(0)
//     const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null)
//     const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null)

//   const [isPending, startTransition] = useTransition()

  
//   useEffect(() => {
//     let timer: NodeJS.Timeout
//     if (resetCountdown > 0) {
//       timer = setTimeout(() => setResetCountdown(resetCountdown - 1), 1000)
//     }
//     return () => clearTimeout(timer)
//   }, [resetCountdown])
  
//   useEffect(() => {
//     const recaptchaVerifier = new RecaptchaVerifier( auth,"recaptcha-container",
//       {
//         size : 'invisible',
//       }
//     )
//     setRecaptchaVerifier(recaptchaVerifier)
//     return () => {
//       recaptchaVerifier.clear()
//     }
//   }, [auth])
 

//   const requestOtp = async(e? :FormEvent<HTMLFormElement>) => {
//     e?.preventDefault()
//     setResetCountdown(60)

//     startTransition(async () => {
//       setError("")
//       if (!recaptchaVerifier) {
//         return setError("Recaptcha verification is not initialized")
//       }

//       try {
//         const confirmationResult = await signInWithPhoneNumber(
//           auth, phoneNumber, recaptchaVerifier
//         )
//         setConfirmationResult(confirmationResult)
//         setSuccess("OTP sent successfully")
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       } catch (error :any) {
//         console.log(error);
//         setResetCountdown(0)
//         if (error.code === "auth/invalid-phone-number") {
//           setError("Invalid phone number")
//         } else if (error.code ==="auth/too-many-requests") {
//           setError("Too many requests. Please try again later")
//         } else {
//           setError("Failed to send OTp. Please try again")
//         }
//       }
//     })
//   }
//   return (
//     <div>
//         {
//           !confirmationResult && (
//             <form onSubmit={requestOtp}>
//               <Input
//                 className='text-black'
//                 type='tel'
//                 value={phoneNumber}
//                 onChange={(e) => setPhoneNumber(e.target.value)}
//               />
//               <p className='text-xs text-gray-400 mt-2'>Please Enter Your Number with Country Code (i.e +92)</p>
//             </form>
//           )
//       }
//       <Button
//       disabled={!phoneNumber || isPending || resetCountdown > 0}
//         onClick={() => requestOtp()}
//       className='mt-5'
//       >
//         {
//           resetCountdown > 0 ? `Resend OTP in ${resetCountdown}` : isPending ? "Sending OTP" : "Send OTP"
//         }
//       </Button>

//       <div className='p-10 text-center'>
//         {error && <p className='text-red-500'>{ error }</p>}
//         {success && <p className='text-green-500'>{ success }</p>}
//       </div>
//       <div id='recaptcha-container' />
//     </div>
//   )
// }

// export default OTPLogin


"use client"
import { auth } from '@/firebase'
import { Auth, ConfirmationResult, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import React, { FormEvent, useEffect, useState, useTransition } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from './ui/input-otp'

const OTPLogin = () => {
    const router = useRouter()
    const [phoneNumber, setPhoneNumber] = useState("")
    const [otp, setOtp] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState("")
    const [resetCountdown, setResetCountdown] = useState(0)
    const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null)
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null)

    const [isPending, startTransition] = useTransition()

    useEffect(() => {
        let timer: NodeJS.Timeout
        if (resetCountdown > 0) {
            timer = setTimeout(() => setResetCountdown(resetCountdown - 1), 1000)
        }
        return () => clearTimeout(timer)
    }, [resetCountdown])

useEffect(() => {
    if (!auth) return;

    const verifier = new RecaptchaVerifier(auth,'recaptcha-container', {
        size: 'invisible',
        callback: (response) => {
            console.log('Recaptcha verified');
        },
        'expired-callback': () => {
            setError("Recaptcha expired. Please try again.");
        }
    }); // Pass the auth object directly here

    setRecaptchaVerifier(verifier);

    return () => {
        verifier.clear();
    };
}, []);

  useEffect(() => {
    const hasEnteredAllDigits = otp.length === 6
    if (hasEnteredAllDigits) {
      verifyOtp()
    }
  }, [otp])
  
  const verifyOtp = async () => {
    startTransition(async () => {
      setError("")
      if (!setConfirmationResult) {
        setError("Please request OTP first")
        return
      }
      try {
        await confirmationResult?.confirm(otp)
        router.replace("/")
      } catch (error) {
        
      }
    })
  }

    const requestOtp = async (e?: FormEvent<HTMLFormElement>) => {
        e?.preventDefault()
        setResetCountdown(60)

        startTransition(async () => {
            setError("")
            if (!recaptchaVerifier) {
                return setError("Recaptcha verification is not initialized")
            }

            if (!/^\+[1-9]\d{1,14}$/.test(phoneNumber)) {
                return setError("Please enter a valid phone number with the country code (e.g., +92xxxxxxxxxx)")
            }

            try {
                const confirmationResult = await signInWithPhoneNumber(
                    auth, phoneNumber, recaptchaVerifier
                )
                setConfirmationResult(confirmationResult)
                setSuccess("OTP sent successfully")
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                console.log(error)
                setResetCountdown(0)
                if (error.code === "auth/invalid-phone-number") {
                    setError("Invalid phone number")
                } else if (error.code === "auth/too-many-requests") {
                    setError("Too many requests. Please try again later")
                } else {
                    setError("Failed to send OTP. Please try again")
                }
            }
        })
    }

    return (
        <div>
            {!confirmationResult && (
                <form onSubmit={requestOtp}>
                    <Input
                        className='text-black'
                        type='tel'
                        placeholder="Enter phone number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    <p className='text-xs text-gray-400 mt-2'>Please Enter Your Number with Country Code (e.g., +92)</p>
                </form>
        )}
        
        {
          confirmationResult && (
            <InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          )
        }

            <Button
                disabled={!phoneNumber || isPending || resetCountdown > 0}
                onClick={() => requestOtp()}
                className='mt-5'
            >
                {resetCountdown > 0 ? `Resend OTP in ${resetCountdown}` : isPending ? "Sending OTP..." : "Send OTP"}
            </Button>

            <div className='p-10 text-center'>
                {error && <p className='text-red-500'>{error}</p>}
                {success && <p className='text-green-500'>{success}</p>}
            </div>

            <div id='recaptcha-container'></div>
        </div>
    )
}

export default OTPLogin
