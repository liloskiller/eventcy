import { Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-purple-800 to-indigo-800 dark:from-gray-900 dark:to-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-3xl font-bold">EventCy</h2>
            <p className="mt-2 text-gray-300">Your gateway to Cyprus' hottest events</p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
              <Facebook size={24} />
              <span className="sr-only">Facebook</span>
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
              <Instagram size={24} />
              <span className="sr-only">Instagram</span>
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
              <Twitter size={24} />
              <span className="sr-only">Twitter</span>
            </a>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-gray-300">
          &copy; {new Date().getFullYear()} EventCy. All rights reserved. Get ready to party!
        </div>
      </div>
    </footer>
  )
}

