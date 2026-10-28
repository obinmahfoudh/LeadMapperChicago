import Link from "next/link"
import { Mail, MapPin, ExternalLink } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">LeadMapper Chicago</h3>
            <p className="text-sm text-slate-400 mb-4">Chicago Lead Service Line Tools</p>
            <p className="text-sm text-slate-400">
              Tools for checking lead service line data in Chicago. For complete information, visit the full project at{" "}
              <a 
                href="https://82-below.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 inline-flex items-center"
              >
                82-below.vercel.app <ExternalLink size={12} className="ml-1" />
              </a>
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/visualizations" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Visualizations
                </Link>
              </li>
              <li>
                <Link href="/priority-model" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Priority Model
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-slate-400 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Mail size={16} className="mr-2 text-emerald-400" />
                <a href="mailto:binmahfoudhobaid@gmail.com" className="text-sm text-slate-400 hover:text-white transition-colors">
                  binmahfoudhobaid@gmail.com
                </a>
              </li>
              <li className="flex items-center">
                <MapPin size={16} className="mr-2 text-emerald-400" />
                <span className="text-sm text-slate-400">Chicago, IL</span>
              </li>
            </ul>
            <div className="mt-6">
              <a 
                href="https://82-below.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-500 transition-colors text-sm font-medium"
              >
                View Full Project <ExternalLink size={14} className="ml-2" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800">
          <p className="text-sm text-center text-slate-500">&copy; {new Date().getFullYear()} Obaid Bin-Mahfoudh. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
