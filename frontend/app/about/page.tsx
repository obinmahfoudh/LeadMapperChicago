import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-6">About This Project</h1>
          <p className="text-xl text-slate-300">
            A showcase of tools developed for the Chicago Lead Service Line project
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-6">The Project</h2>
              <p className="text-slate-600 mb-4">
                The Chicago Lead Service Line project was developed as part of a team effort to address the lack of 
                clarity regarding lead pipeline data in Chicago. The mission was to map and analyze lead contamination 
                using geospatial data to visualize and quantify the impact of lead poisoning in different Chicago 
                neighborhoods.
              </p>
              <p className="text-slate-600 mb-4">
                Chicago has one of the highest numbers of lead service lines in the U.S., requiring urgent policy 
                intervention. High lead levels in drinking water are linked to cognitive and developmental issues, 
                especially in children.
              </p>
              <p className="text-slate-600">
                This site showcases specific tools and components from that project, including the address lookup 
                functionality and data visualizations.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm">
              <h2 className="text-3xl font-bold text-slate-800 mb-6">Full Team Project</h2>
              <p className="text-slate-600 mb-4">
                This site showcases a subset of the complete project. The full team project includes additional 
                features and information:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-slate-600 mb-6">
                <li>Health effects of lead exposure</li>
                <li>Mitigation strategies and resources</li>
                <li>Exposure area analysis</li>
                <li>Complete project documentation</li>
              </ul>
              <a 
                href="https://82-below.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-500 transition-colors font-medium"
              >
                Visit Full Project <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Tools on This Site */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-12 text-center">Tools on This Site</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
              <h3 className="text-xl font-bold text-emerald-600 mb-4">Address Lookup</h3>
              <p className="text-slate-600 mb-4">
                Search for any Chicago address to see if it has a lead service line. Uses Google Maps integration 
                for accurate geocoding and displays nearby service line data.
              </p>
              <Button asChild variant="outline" size="sm">
                <Link href="/">Try It</Link>
              </Button>
            </div>

            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
              <h3 className="text-xl font-bold text-blue-600 mb-4">Visualizations</h3>
              <p className="text-slate-600 mb-4">
                Data visualizations showing lead service line distribution and analysis across Chicago neighborhoods.
              </p>
              <Button asChild variant="outline" size="sm">
                <Link href="/visualizations">View</Link>
              </Button>
            </div>

            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
              <h3 className="text-xl font-bold text-purple-600 mb-4">Priority Model</h3>
              <p className="text-slate-600 mb-4">
                Analysis model for prioritizing lead service line replacement based on risk factors and demographic data.
              </p>
              <Button asChild variant="outline" size="sm">
                <Link href="/priority-model">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Info */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-8 max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Developed by Obaid Bin-Mahfoudh</h2>
            <p className="text-slate-600 mb-6">
              This site was built to showcase specific contributions to the Chicago Lead Service Line project.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-emerald-600 text-white hover:bg-emerald-500">
                <Link href="/contact">Contact</Link>
              </Button>
              <Button asChild variant="outline">
                <a href="https://82-below.vercel.app/" target="_blank" rel="noopener noreferrer">
                  View Team Project <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
