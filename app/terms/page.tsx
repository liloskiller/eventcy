import Link from "next/link"
import { Button } from "@/components/ui/button"
import BackButton from "@/components/BackButton"

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 p-4">
      <BackButton />
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8 mt-12">
        <h1 className="text-3xl font-bold text-purple-700 mb-6">Terms and Conditions</h1>
        <div className="space-y-4 text-gray-700">
          <p>
            Welcome to EventCy. By using our services, you agree to comply with and be bound by the following terms and
            conditions:
          </p>
          <ol className="list-decimal list-inside space-y-2">
            <li>You must be at least 18 years old to use our services.</li>
            <li>You agree to provide accurate and complete information when creating an account.</li>
            <li>You are responsible for maintaining the confidentiality of your account information.</li>
            <li>You agree not to use our services for any illegal or unauthorized purpose.</li>
            <li>We reserve the right to modify or terminate our services at any time without notice.</li>
            <li>You agree to comply with all applicable laws and regulations while using our services.</li>
            <li>We are not responsible for any content posted by users on our platform.</li>
            <li>We reserve the right to remove any content that violates our terms and conditions.</li>
            <li>
              You agree to indemnify and hold us harmless from any claims resulting from your use of our services.
            </li>
            <li>These terms and conditions are subject to change without notice.</li>
          </ol>
        </div>
        <div className="mt-8">
          <Link href="/signup">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
              Back to Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

