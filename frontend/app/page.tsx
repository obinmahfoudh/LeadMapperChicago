import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLinkIcon, ImageIcon, BarChart3Icon, InfoIcon } from "lucide-react"
import AddressSearchMap from "@/components/address-search-map"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">LeadMapper Chicago</h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Check if your address has a lead service line and explore data about lead pipes in Chicago.
            </p>
          </div>
        </div>
      </section>

      {/* Notice Bar */}
      <section className="py-4 bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <InfoIcon className="h-5 w-5 text-emerald-400 shrink-0" />
              <p className="text-slate-300 text-sm">
                Service line information was last updated in Spring 2025. For addressses with multiple service lines exact locations may not be accurate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Address Lookup Section */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AddressSearchMap />
        </div>
      </section>

      {/* Other Tools Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-8 text-slate-800">More Tools</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <Card className="bg-white hover:shadow-lg transition-shadow border-slate-200">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <ImageIcon className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-slate-800">Visualizations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4">
                  Data visualizations showing lead service line distribution and analysis across Chicago.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/visualizations">View Visualizations</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white hover:shadow-lg transition-shadow border-slate-200">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <BarChart3Icon className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-slate-800">Priority Model</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4">
                  Analysis model for prioritizing lead service line replacement based on risk factors.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/priority-model">View Model</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-10 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-300 mb-4">
            Want to learn more about lead exposure, health effects, and mitigation strategies?
          </p>
          <Button asChild size="lg" className="bg-emerald-600 text-white hover:bg-emerald-500">
            <a href="https://82-below.vercel.app/" target="_blank" rel="noopener noreferrer">
              Visit Full Team Project <ExternalLinkIcon className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </section>
    </div>
  )
}
