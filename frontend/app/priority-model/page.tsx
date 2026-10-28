import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3Icon, ExternalLinkIcon, InfoIcon, MapIcon, BeakerIcon } from "lucide-react"

export default function PriorityModelPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3Icon className="h-8 w-8 text-blue-400" />
            <h1 className="text-4xl font-bold">Priority Replacement Model</h1>
          </div>
          <p className="text-xl text-slate-400 max-w-3xl">
            A data-driven methodology to identify and prioritize Chicago block groups for
            lead service line replacement based on social harm and infrastructure risk.
          </p>
        </div>
      </section>

      {/* Overview & Methodology */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="md:col-span-2 space-y-6">
              <h2 className="text-3xl font-bold text-slate-800">Methodology</h2>
              <p className="text-slate-600 leading-relaxed">
                This prioritization method is adapted from the framework used by <strong>Safe Water Engineering</strong> in Washington, D.C.
                Analysis is conducted at the <strong>block group level</strong> (typically 600–3,000 residents),
                calculating a composite score from two primary dimensions: social vulnerability and infrastructure likelihood.
              </p>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                <div className="flex">
                  <InfoIcon className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                  <p className="text-sm text-blue-800">
                    <strong>Note on ADI Scaling:</strong> Socioeconomic data was sourced from the <em>Neighborhood Atlas</em>.
                    I utilized <strong>State-level ADI scores</strong> rather than Federal scores to ensure the rankings are
                    more granular and relevant to the specific economic landscape of Chicago and Illinois.
                  </p>
                </div>
              </div>
            </div>

            <Card className="bg-slate-800 text-white border-none shadow-xl">
              <CardHeader>
                <CardTitle className="text-sm font-mono text-blue-400 uppercase tracking-widest">
                  The Formula
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">CoL × LoL</div>
                <p className="text-xs text-slate-400">
                  Multiplying the <strong>Cost of Lead</strong> by the <strong>Likelihood of Lead</strong>
                  generates a final priority score (0–100).
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Metric 1: CoL */}
          <div className="space-y-12 mb-20">
            <div className="border-t pt-12">
              <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                <span className="bg-slate-800 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">1</span>
                Cost of Lead (CoL): Social Harm Score
              </h3>
              <p className="text-slate-600 mb-8">
                CoL reflects the potential impact of lead exposure on vulnerable populations. It is calculated as:
                <code className="block bg-slate-100 p-3 rounded mt-2 text-center font-bold text-slate-800">
                  CoL = (0.5 * ADI Score) + (0.5 * Children Under 5 Score)
                </code>
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <h4 className="font-bold mb-4 flex items-center"><BeakerIcon className="h-4 w-4 mr-2 text-blue-500" /> Children Under 5 Metric</h4>
                    <p className="text-sm text-slate-500 mb-4">Data sourced from the American Community Survey (ACS). Bin metrics follow the Safe Water Engineering model.</p>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-slate-400"><th className="text-left pb-2">Children Count</th><th className="text-right pb-2">Points</th></tr>
                      </thead>
                      <tbody className="text-slate-700">
                        <tr className="border-b"><td className="py-2">50+ children</td><td className="py-2 text-right font-bold">10</td></tr>
                        <tr className="border-b"><td className="py-2">11-50 children</td><td className="py-2 text-right font-bold">5</td></tr>
                        <tr className="border-b"><td className="py-2">1-10 children</td><td className="py-2 text-right font-bold">3</td></tr>
                        <tr><td className="py-2">No children</td><td className="py-2 text-right font-bold">1</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <img src="/images/ACS_Score.png" alt="ACS Intermediate Score" className="rounded-lg border shadow-sm" />
                    <p className="text-[10px] text-center text-slate-400 uppercase font-bold">ACS Children Score</p>
                  </div>
                  <div className="space-y-2">
                    <img src="/images/ADI_Score.png" alt="ADI Intermediate Score" className="rounded-lg border shadow-sm" />
                    <p className="text-[10px] text-center text-slate-400 uppercase font-bold">ADI State Score</p>
                  </div>
                  <div className="col-span-2 space-y-2">
                    <img src="/images/CoL.png" alt="Final Cost of Lead Map" className="rounded-lg border-2 border-blue-200 shadow-md" />
                    <p className="text-xs text-center font-bold text-slate-600">Resulting Cost of Lead (CoL) Score</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Metric 2: LoL */}
            <div className="border-t pt-12">
              <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                <span className="bg-slate-800 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">2</span>
                Likelihood of Lead (LoL): Infrastructure Risk
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-4">
                  <p className="text-slate-600">
                    The average number of service lines within a block group suspected to require replacement.
                    Each individual service line is scored based on its reported material:
                  </p>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex justify-between border-b py-1"><span>Lead or Galvanized Requiring Replacement</span> <strong>10 pts</strong></li>
                    <li className="flex justify-between border-b py-1"><span>Unknown Materials</span> <strong>5 pts</strong></li>
                    <li className="flex justify-between py-1"><span>Non-Lead Materials</span> <strong>0 pts</strong></li>
                  </ul>
                  <p className="text-xs text-slate-400 italic">
                    The final LoL for a block group is the normalized average of all contained service line scores.
                  </p>
                </div>
                <div className="space-y-2">
                  <img src="/images/LoL.png" alt="Likelihood of Lead Map" className="rounded-lg border shadow-sm" />
                  <p className="text-xs text-center font-bold text-slate-600 uppercase">LoL Score Distribution</p>
                </div>
              </div>
            </div>

            {/* Final Cumulative Score */}
            <div className="border-t pt-12">
              <h2 className="text-3xl font-bold text-slate-800 mb-6 text-center">Final Cumulative Model</h2>
              <div className="max-w-3xl mx-auto text-center mb-10">
                <p className="text-slate-600">
                  By multiplying the social harm (CoL) and the infrastructure likelihood (LoL), we identify
                  high-priority "Hot Spots" where replacement efforts would yield the highest public health benefit
                  for the most disadvantaged populations.
                </p>
              </div>
              <div className="space-y-4 max-w-4xl mx-auto">
                <img src="/images/Model_Score.png" alt="Final Model Score Map" className="rounded-xl border-4 border-slate-200 shadow-2xl" />
                <p className="text-sm text-center font-bold text-slate-800">Final Prioritization Model (0-100 Score)</p>
              </div>
            </div>
          </div>

          {/* Interactive Map Section */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-slate-800 mb-8 flex items-center justify-center">
              <MapIcon className="mr-3 h-8 w-8 text-blue-600" />
              Interactive Model Explorer
            </h2>
            <Card className="overflow-hidden border-2 border-slate-200 shadow-xl">
              <div className="aspect-video w-full bg-slate-100">
                <iframe
                  src="/model_interactive_map.html"
                  className="w-full h-[600px] border-none"
                  title="Chicago Lead Priority Interactive Map"
                />
              </div>
              <CardContent className="bg-slate-50 py-4">
                <p className="text-sm text-slate-500 text-center">
                  Use the interactive map to explore block-group priority scores across Chicago's neighborhoods.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer / Credits */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">References & Resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12 text-sm text-slate-400">
            <div className="p-4 bg-slate-800 rounded-lg">
              <p className="font-bold text-white mb-2">Methodology</p>
              Safe Water Engineering (Washington, D.C.)
            </div>
            <div className="p-4 bg-slate-800 rounded-lg">
              <p className="font-bold text-white mb-2">Social Data</p>
              Neighborhood Atlas (ADI) & American Community Survey (ACS)
            </div>
          </div>
          <a
            href="https://82-below.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-blue-600 text-white px-8 py-4 rounded-full hover:bg-blue-500 transition-all font-bold shadow-lg hover:shadow-blue-500/20"
          >
            Explore the Team Project <ExternalLinkIcon className="ml-2 h-5 w-5" />
          </a>
        </div>
      </section>
    </div>
  )
}