import hospitalsData from "./hospitals.json";

export interface Hospital {
  name: string;
  emergency: boolean;
  type: string;
  planCount: number;
}

export type HospitalNetwork = Record<string, Hospital[]>;

export const hospitals: HospitalNetwork = hospitalsData as HospitalNetwork;

export function getHospitalsByCity(city: string): Hospital[] {
  const normalized = city
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  for (const [key, value] of Object.entries(hospitals)) {
    const keyNorm = key
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
    if (keyNorm === normalized || keyNorm.includes(normalized) || normalized.includes(keyNorm)) {
      return value;
    }
  }
  return [];
}

export function getCities(): string[] {
  return Object.keys(hospitals);
}

export function buildHospitalsSummary(): string {
  const lines: string[] = [];
  for (const [city, hosps] of Object.entries(hospitals)) {
    const top = hosps.slice(0, 8);
    const names = top
      .map(
        (h) =>
          `${h.name}${h.emergency ? " (Urgencia/Emergencia)" : ""}`
      )
      .join(", ");
    lines.push(`- ${city}: ${hosps.length} hospitais. Principais: ${names}`);
  }
  return lines.join("\n");
}
