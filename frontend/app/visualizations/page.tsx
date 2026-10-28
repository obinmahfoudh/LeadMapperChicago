import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageIcon, ExternalLinkIcon } from "lucide-react"
import Link from "next/link"

export default function VisualizationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <section className="bg-slate-800 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Visualizations</h1>
          <p className="text-lg text-slate-300">
            Data visualizations and graphics I created for the Chicago Lead Service Line project.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Placeholder for future content */}
          <Card className="border-2 border-dashed border-slate-300 bg-slate-50">
            <CardHeader>
              <CardTitle className="flex items-center text-slate-600">
                <ImageIcon className="h-6 w-6 mr-2" />
                Coming Soon
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-500 mb-6">
                This section will showcase data visualizations, charts, and graphics I created for the project. 
                Check back soon for updates, or visit the original project to see visualizations in context.
              </p>
              <a 
                href="https://82-below.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-slate-700 hover:text-slate-900 font-medium"
              >
                View Original Project <ExternalLinkIcon className="ml-1 h-4 w-4" />
              </a>
            </CardContent>
          </Card>

          {/* Grid for future images */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Gallery</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Placeholder cards */}
              {[1, 2, 3].map((i) => (
                <div 
                  key={i}
                  className="aspect-video bg-slate-100 rounded-lg border-2 border-dashed border-slate-200 flex items-center justify-center"
                >
                  <div className="text-center text-slate-400">
                    <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                    <p className="text-sm">Visualization {i}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Reference to original project */}
      <section className="py-12 bg-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-600 mb-4">
            For the complete project with all team contributions and live visualizations, visit the original site.
          </p>
          <a 
            href="https://82-below.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center bg-slate-800 text-white px-6 py-3 rounded-lg hover:bg-slate-700 transition-colors font-medium"
          >
            View Full Team Project <ExternalLinkIcon className="ml-2 h-4 w-4" />
          </a>
        </div>
      </section>
    </div>
  )
}
