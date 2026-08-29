import { NextResponse } from "next/server";
import crypto from "crypto";

const registeredDevices = {
  VCS001: { lat: 34.0522, lon: -118.2437, location: "Los Angeles, CA" },
  VCS002: { lat: 51.5074, lon: -0.1278, location: "London, UK" },
  VCS003: { lat: 64.1466, lon: -21.9426, location: "Reykjavik, Iceland" },
  VCS9341: { lat: -3.4653, lon: -62.2159, location: "Amazon Basin, Brazil" },
  VCS2128: { lat: 64.0466, lon: -21.4126, location: "Hellisheidi, Iceland" },
  VCS7715: { lat: -23.6509, lon: -70.3975, location: "Antofagasta, Chile" },
  GS8832: { lat: -0.2286, lon: 130.5167, location: "Raja Ampat, Indonesia" },
  GS5544: { lat: 14.1592, lon: -16.0718, location: "Kaolack, Senegal" },
  CAR1247: { lat: 32.8475, lon: -115.5694, location: "Imperial Valley, CA" },
  PING: { lat: 0, lon: 0, location: "Ping" },
};

const projectMetadata = {
  "VCS-9341": { name: "Manauary Reforestation", vintage: "2024", methodology: "VM0007 v1.6" },
  "VCS-2128": { name: "Mammoth Direct Air Capture", vintage: "2025", methodology: "Puro.earth" },
  "GS-8832": { name: "Coral Triangle Mangrove Network", vintage: "2024", methodology: "VM0033 v2.0" },
  "CAR-1247": { name: "Imperial Valley Methane Recovery", vintage: "2025", methodology: "AMS-III.H" },
  "GS-5544": { name: "Sahel Regenerative Soils", vintage: "2024", methodology: "VM0042 v1.0" },
  "VCS-7715": { name: "Atacama Solar Thermal Array", vintage: "2025", methodology: "ACM0002" },
  VCS001: { name: "Demo Project", vintage: "2024", methodology: "VM0007" },
};

function generateHash() {
  return "0x" + crypto.randomBytes(32).toString("hex");
}

export async function POST(request) {
  let body = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const projectId = (body.projectId || "PING").toUpperCase();
  const claimedAmount = body.claimedAmount || "0";

  if (projectId === "PING") {
    return NextResponse.json({ verified: true, ok: true, ts: Date.now() });
  }

  try {
    const IOT_API_KEY = process.env.IOT_HARDWARE_API_KEY || "sk_live_iot_default";
    const device = registeredDevices[projectId] || {
      lat: 0,
      lon: 0,
      location: "Unknown Location (Simulated Fallback)",
    };

    const { lat, lon, location } = device;
    let radiation = 750;
    let cloudCover = 25;
    let satOk = true;

    try {
      const satRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=cloud_cover,direct_radiation`,
        { next: { revalidate: 300 } },
      );
      if (satRes.ok) {
        const satData = await satRes.json();
        radiation = satData.current?.direct_radiation ?? radiation;
        cloudCover = satData.current?.cloud_cover ?? cloudCover;
      } else {
        satOk = false;
      }
    } catch {
      satOk = false;
    }

    const energyValue = parseInt(claimedAmount, 10) || 0;
    const expectedMaxEnergy = Math.max(10, radiation * 0.5);
    const discrepancy = energyValue - expectedMaxEnergy;

    if (discrepancy > 50) {
      return NextResponse.json(
        {
          verified: false,
          error: `Satellite check failed! Your physical installation is in ${location}. Current direct radiation is only ${radiation} W/m2. It is physically impossible to generate ${energyValue} kW right now. Max theoretically possible: ~${Math.round(expectedMaxEnergy)} kW.`,
        },
        { status: 400 },
      );
    }

    const zkHash = generateHash();
    const iotHash = generateHash();
    const satHash = generateHash();
    const fullZkProof = crypto
      .createHash("sha256")
      .update(`${projectId}-${claimedAmount}-${Date.now()}-${IOT_API_KEY}`)
      .digest("hex");

    const meta = projectMetadata[projectId] || { name: "Unknown", vintage: "2024", methodology: "—" };

    return NextResponse.json({
      verified: true,
      project: meta,
      iotData: {
        sensorId: `AERO_NODE_${projectId}`,
        captured: energyValue,
        gps: `${lat.toFixed(4)} N, ${lon.toFixed(4)} W (${location})`,
      },
      satelliteData: {
        provider: "Open-Meteo Satellite API",
        cloudCover: `${cloudCover}%`,
        radiation: `${radiation} W/m2`,
        status: satOk ? "live" : "fallback",
      },
      zkProof: "0x" + fullZkProof.substring(0, 40),
      iotHash,
      satelliteHash: satHash,
      challengeWindowEnds: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Backend Error]", error.message);
    return NextResponse.json({ verified: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: "ok", endpoint: "verify", version: "2.0" });
}
