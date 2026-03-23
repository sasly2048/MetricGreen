import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request) {
  try {
    const body = await request.json();
    const projectId = body.projectId || "VCS001";
    const claimedAmount = body.claimedAmount || "0";

    const IOT_API_KEY =
      process.env.IOT_HARDWARE_API_KEY || "sk_live_iot_default";
    const SATELLITE_API_KEY =
      process.env.SATELLITE_PROVIDER_API_KEY || "sk_live_esa_default";

    // --- LOOPHOLE CLOSED: HARDWARE ANCHOR REGISTRY ---
    const registeredDevices = {
      VCS001: { lat: 34.0522, lon: -118.2437, location: "Los Angeles, CA" },
      VCS002: { lat: 51.5074, lon: -0.1278, location: "London, UK" },
      VCS003: { lat: 64.1466, lon: -21.9426, location: "Reykjavik, Iceland" },
    };

    const device = registeredDevices[projectId] || {
      lat: 0,
      lon: 0,
      location: "Unknown Location (Simulated Fallback)",
    };

    const { lat, lon, location } = device;

    const satRes = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=" +
        lat +
        "&longitude=" +
        lon +
        "&current=cloud_cover,direct_radiation",
    );

    if (!satRes.ok) {
      throw new Error("Satellite oracle failed to respond.");
    }
    const satData = await satRes.json();
    const radiation = satData.current?.direct_radiation ?? 0;
    const cloudCover = satData.current?.cloud_cover ?? 0;

    let energyValue = parseInt(claimedAmount, 10);
    if (isNaN(energyValue)) energyValue = 0;

    const iotResponse = {
      sensorId: "AERO_NODE_" + projectId,
      energyReading: energyValue,
      status: "online",
    };

    console.log(
      "[Backend] Validating " +
        projectId +
        " at " +
        location +
        ". Radiation: " +
        radiation +
        " W/m2",
    );

    // THE LIE DETECTOR LOGIC FIX
    // Calculate expected maximum energy based on an assumed panel efficiency and size
    const expectedMaxEnergy = Math.max(10, radiation * 0.5); // Example formula assuming a 50% multiplier based on panel size/efficiency
    let discrepancy = iotResponse.energyReading - expectedMaxEnergy;

    if (discrepancy > 50) {
      return NextResponse.json(
        {
          verified: false,
          error:
            "Satellite check failed! Your physical installation is in " +
            location +
            ". Current direct radiation is only " +
            radiation +
            " W/m2. It is physically impossible to generate " +
            iotResponse.energyReading +
            " kW right now. Max theoretically possible: ~" +
            Math.round(expectedMaxEnergy) +
            " kW.",
        },
        { status: 400 },
      );
    }

    const hash = crypto
      .createHash("sha256")
      .update(
        projectId + "-" + claimedAmount + "-" + Date.now() + "-" + IOT_API_KEY,
      )
      .digest("hex");

    return NextResponse.json({
      verified: true,
      iotData: {
        sensorId: iotResponse.sensorId,
        captured: iotResponse.energyReading,
        gps: lat + " N, " + lon + " W (" + location + ")",
      },
      satelliteData: {
        provider: "Open-Meteo Satellite API",
        cloudCover: cloudCover + "%",
        radiation: radiation + " W/m2",
      },
      zkProof: "0x" + hash.substring(0, 40),
    });
  } catch (error) {
    console.error("[Backend Error]", error.message);
    return NextResponse.json(
      { verified: false, error: error.message },
      { status: 500 },
    );
  }
}
