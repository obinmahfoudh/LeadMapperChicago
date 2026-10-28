import { Card } from "@/components/ui/card"
import { Mail, MapPin, ExternalLink } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-6">Contact</h1>
          <p className="text-xl text-slate-300">Get in touch with Obaid Bin-Mahfoudh</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-6">Get In Touch</h2>
            <p className="text-slate-600 mb-8">
              Have questions about this project or interested in discussing potential opportunities? 
              Feel free to reach out via email.
            </p>

            <div className="space-y-6">
              <Card className="p-6 border-slate-200">
                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-emerald-600 mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold text-slate-800">Email</h3>
                    <a href="mailto:binmahfoudhobaid@gmail.com" className="text-emerald-600 hover:text-emerald-700">
                      binmahfoudhobaid@gmail.com
                    </a>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-slate-200">
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-emerald-600 mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold text-slate-800">Location</h3>
                    <p className="text-slate-600">Chicago, Illinois</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Project Resources */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-12 text-center">Project Resources</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-md transition-shadow border-slate-200">
              <h3 className="text-xl font-bold text-emerald-600 mb-4">Original Team Project</h3>
              <p className="text-slate-600 mb-4">
                View the complete team project with all contributions, health information, and mitigation strategies.
              </p>
              <a
                href="https://82-below.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 hover:text-emerald-700 flex items-center"
              >
                Visit Website <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            </Card>

            <Card className="p-6 hover:shadow-md transition-shadow border-slate-200">
              <h3 className="text-xl font-bold text-blue-600 mb-4">City of Chicago</h3>
              <p className="text-slate-600 mb-4">
                Official information about lead service lines and replacement programs in Chicago.
              </p>
              <a
                href="https://www.leadsafechicago.org/lead-service-line-replacement"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 flex items-center"
              >
                Visit Website <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            </Card>

            <Card className="p-6 hover:shadow-md transition-shadow border-slate-200">
              <h3 className="text-xl font-bold text-purple-600 mb-4">EPA Lead Information</h3>
              <p className="text-slate-600 mb-4">
                Comprehensive resources about lead in drinking water from the Environmental Protection Agency.
              </p>
              <a
                href="https://www.epa.gov/ground-water-and-drinking-water/basic-information-about-lead-drinking-water"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-700 flex items-center"
              >
                Visit Website <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
