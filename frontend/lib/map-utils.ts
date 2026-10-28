export type ServiceLineClassification = "GRR" | "L" | "U" | "C" | "UNL" | string

export interface ServiceLineData {
  address: string
  "gooseneck/pigtail": string
  public_material: string
  private_material: string
  "classification for entire service line": ServiceLineClassification
  public_verification: string
  private_verification: string
  latitude: number
  longitude: number
  distance: number
}

export function getMarkerColorForClassification(classification: ServiceLineClassification): string {
  // Red for high-risk materials (GRR, L)
  if (classification === "GRR" || classification === "L") {
    return "#ef4444" // Tailwind red-500
  }

  // Gray for unknown (U)
  if (classification === "U") {
    return "#FFEB3B" // Tailwind yellow-500
  }

  // Green for safe materials (C, UNL, NL)
  if (classification === "C" || classification === "UNL" || classification === "NL") {
    return "#22c55e" // Tailwind green-500
  }

  // Default color for other classifications
  return "#6b7280" // Tailwind gray-500
}

export function getClassificationRiskLevel(
  classification: ServiceLineClassification,
): "high" | "medium" | "low" | "unknown" {
  if (classification === "GRR" || classification === "L") {
    return "high"
  }

  if (classification === "U") {
    return "unknown"
  }

  if (classification === "C" || classification === "UNL" || classification === "NL") {
    return "low"
  }

  return "unknown"
}

export function getClassificationFullName(classification: ServiceLineClassification): string {
  switch (classification) {
    case "GRR":
      return "Galvanized Requiring Replacement"
    case "L":
      return "Lead"
    case "U":
      return "Unknown"
    case "C":
      return "Copper"
    case "UNL":
      return "Not Lead"
    case "NL":
      return "Not Lead"
    default:
      return classification
  }
}
