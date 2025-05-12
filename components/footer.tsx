import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-[#CC0000] dark:bg-[#990000]">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-lg sm:text-xl font-bold mb-2">Subscribe to Our Newsletter</h3>
            <p className="text-white/80 mb-4 text-sm sm:text-base">
              Get the latest Nigerian news delivered straight to your inbox
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Your email address"
                className="flex-1 bg-white/20 border-white/20 placeholder:text-white/70 text-white"
                required
              />
              <Button variant="secondary" className="w-full sm:w-auto">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-2 sm:px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-4">
              <img src="RSN NEWS.jpg" alt="RSN Logo" className="h-8 w-8 object-contain rounded-full bg-white p-1 shadow-sm mr-1" />
              <h3 className="text-xl font-bold whitespace-nowrap">RSN NEWS</h3>
            </div>
            <p className="text-sm text-gray-300 mb-4 break-words">
              RSN NEWS - Beyond Headlines - Your trusted source for Nigerian news and global updates.
            </p>
            <div className="flex flex-row flex-wrap gap-2 sm:gap-3 overflow-x-auto pb-2">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-9 w-9 border-gray-700 text-gray-300 hover:text-white hover:border-white"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-9 w-9 border-gray-700 text-gray-300 hover:text-white hover:border-white"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-9 w-9 border-gray-700 text-gray-300 hover:text-white hover:border-white"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-9 w-9 border-gray-700 text-gray-300 hover:text-white hover:border-white"
              >
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Button>
            </div>
          </div>

          <div className="mt-6 sm:mt-0 min-w-0">
            <h4 className="text-md font-semibold mb-4 text-gray-100">Categories</h4>
            <ul className="grid grid-cols-2 sm:grid-cols-1 gap-2">
              <li>
                <Link href="/category/politics" className="text-sm text-gray-300 hover:text-white">
                  Politics
                </Link>
              </li>
              <li>
                <Link href="/category/business" className="text-sm text-gray-300 hover:text-white">
                  Business
                </Link>
              </li>
              <li>
                <Link href="/category/sports" className="text-sm text-gray-300 hover:text-white">
                  Sports
                </Link>
              </li>
              <li>
                <Link href="/category/entertainment" className="text-sm text-gray-300 hover:text-white">
                  Entertainment
                </Link>
              </li>
              <li>
                <Link href="/category/technology" className="text-sm text-gray-300 hover:text-white">
                  Technology
                </Link>
              </li>
              <li>
                <Link href="/category/health" className="text-sm text-gray-300 hover:text-white">
                  Health
                </Link>
              </li>
            </ul>
          </div>

          <div className="mt-6 sm:mt-0 min-w-0">
            <h4 className="text-md font-semibold mb-4 text-gray-100">Sources</h4>
            <ul className="grid grid-cols-2 sm:grid-cols-1 gap-2">
              <li>
                <a
                  href="https://punchng.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-300 hover:text-white"
                >
                  Punch
                </a>
              </li>
              <li>
                <a
                  href="https://guardian.ng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-300 hover:text-white"
                >
                  Guardian
                </a>
              </li>
              <li>
                <a
                  href="https://vanguardngr.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-300 hover:text-white"
                >
                  Vanguard
                </a>
              </li>
              <li>
                <a
                  href="https://channelstv.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-300 hover:text-white"
                >
                  Channels TV
                </a>
              </li>
              <li>
                <a
                  href="https://thecable.ng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-300 hover:text-white"
                >
                  The Cable
                </a>
              </li>
              <li>
                <a
                  href="https://premiumtimesng.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-300 hover:text-white"
                >
                  Premium Times
                </a>
              </li>
            </ul>
          </div>

          <div className="mt-6 sm:mt-0 min-w-0">
            <h4 className="text-md font-semibold mb-4 text-gray-100">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-300">123 News Street, Lagos, Nigeria</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                <span className="text-sm text-gray-300">+234 123 456 7890</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                <span className="text-sm text-gray-300">info@nigerianews.com</span>
              </li>
            </ul>

            <h4 className="text-md font-semibold mt-6 mb-3 text-gray-100">Legal</h4>
            <ul className="grid grid-cols-2 sm:grid-cols-1 gap-2">
              <li>
                <Link href="/privacy" className="text-sm text-gray-300 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-300 hover:text-white">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-800 text-center">
          <p className="text-sm text-gray-400 break-words">© {new Date().getFullYear()} RSN NEWS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
