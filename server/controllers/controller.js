const Sniffr = require("sniffr").default;
const AnalyticsModel = require("../models/model");

const getClientIp = (req) => {
  const forwarded = req.headers["x-forwarded-for"];
  return forwarded ? forwarded.split(",")[0] : req.connection.remoteAddress;
};

const collectAnalytics = async (req, res) => {
  try {
    const s = new Sniffr();

    const visitorIp = getClientIp(req);

    // Parse User Agent
    s.sniff(req.headers["user-agent"]);

    // get time of visit
    const timestamp = new Date();

    let ipDetails;
    try {
      const ipDetailsResponse = await fetch(
        `http://ip-api.com/json/${visitorIp}`
      );
      ipDetails = await ipDetailsResponse.json();
    } catch (fetchError) {
      console.error("Error fetching IP details:", fetchError);
      ipDetails = { error: "Unable to retrieve IP details" };
    }

    const visitorDetails = {
      visitor: {
        ip: visitorIp,
        timestamp: timestamp.toISOString(),
        timezone: timestamp.getTimezoneOffset(),
        language: req.headers["accept-language"]?.split(",")[0],
      },
      browser: {
        name: s.browser.name,
        version: s.browser.version.join("."),
        userAgent: req.headers["user-agent"],
      },
      os: {
        name: s.os.name,
        version: s.os.version.join("."),
      },
      device: {
        name: detectDeviceType(req.body.screenWidth),
        _name: s.device.name,
        screenWidth: req.body.screenWidth,
      },
      location: ipDetails,
      page: {
        url: req.headers.referer,
      },
    };

    await AnalyticsModel.create(visitorDetails);

    res.setHeader("Content-Type", "application/json");
    return res.json(visitorDetails);
  } catch (error) {
    console.error("Error getting visitor details:", error);
    return res.status(500).json({
      error: "Failed to get visitor details",
      message: error.message,
    });
  }
};

function detectDeviceType(screenWidth) {
  if (!screenWidth) return "unknown";

  // check screen size if available and sort
  if (screenWidth) {
    if (screenWidth < 768) return "mobile";
    if (screenWidth >= 768 && screenWidth < 1024) return "tablet";
    if (screenWidth >= 1024) return "desktop";
  }
}

// Get analytics data
const getAnalytics = async (req, res) => {
  try {
    const timeRange = req.params.range || "24h";
    const startDate = getStartDate(timeRange);

    const data = await AnalyticsModel.find({
      "visitor.timestamp": { $gte: startDate },
    }).sort("-visitor.timestamp");

    res.json(data);
  } catch (error) {
    console.error("Analytics Fetch Error:", error);
    res.status(500).json({ error: "Failed to fetch analytics data" });
  }
};

function getStartDate(range) {
  const now = new Date();
  switch (range) {
    case "24h":
      return new Date(now - 24 * 60 * 60 * 1000);
    case "7d":
      return new Date(now - 7 * 24 * 60 * 60 * 1000);
    case "30d":
      return new Date(now - 30 * 24 * 60 * 60 * 1000);
    default:
      return new Date(now - 24 * 60 * 60 * 1000);
  }
}

const getCleanAnalytics = async (req, res) => {
  try {
    const visitorData = await AnalyticsModel.find({});

    // Map data into a simplified structure
    const data = visitorData.map((doc) => ({
      ip: doc.visitor.ip,
      timestamp: new Date(doc.visitor.timestamp),
      timezone: doc.visitor.timezone,
      browserName: doc.browser.name,
      browserVersion: doc.browser.version,
      osName: doc.os.name,
      osVersion: doc.os.version,
      deviceName: doc.device.name,
      deviceType: doc.device._name,
      country: doc.location.country,
      countryCode: doc.location.countryCode,
      region: doc.location.region,
      regionName: doc.location.regionName,
      city: doc.location.city,
      latitude: doc.location.lat,
      longitude: doc.location.lon,
      timezoneName: doc.location.timezone,
      isp: doc.location.isp,
      organization: doc.location.org,
      autonomousSystem: doc.location.as,
      referer: doc.page.url,
    }));

    // Helper function to count occurrences in each category
    const countOccurrences = (array, key) => {
      return array.reduce((acc, item) => {
        const value = item[key] || "Unknown";
        acc[value] = (acc[value] || 0) + 1;
        return acc;
      }, {});
    };

    // Aggregations by category
    const deviceCounts = countOccurrences(data, "deviceType");
    const browserCounts = countOccurrences(data, "browserName");
    const osCounts = countOccurrences(data, "osName");
    const countryCounts = countOccurrences(data, "country");

    // Aggregation by day and hour
    const visitsByDay = data.reduce((acc, visit) => {
      const date = visit.timestamp.toISOString().split("T")[0]; // Format to YYYY-MM-DD
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    const visitsByHour = data.reduce((acc, visit) => {
      const hour = visit.timestamp.getUTCHours(); // Use UTC hour for consistency
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {});

    // Unique visits (using unique IPs)
    const uniqueIps = new Set(data.map((visit) => visit.ip)).size;

    // Total views
    const totalViews = data.length;

    // Visits in the past 24 hours
    const oneDayAgo = new Date();
    oneDayAgo.setUTCDate(oneDayAgo.getUTCDate() - 1);
    const visitsLast24Hours = data.filter(
      (visit) => visit.timestamp > oneDayAgo
    ).length;

    // Return all aggregated data as JSON
    res.status(200).json({
      data, // Raw data
      deviceCounts, // Device counts
      browserCounts, // Browser counts
      osCounts, // OS counts
      countryCounts, // Country counts
      visitsByDay, // Visits by day
      visitsByHour, // Visits by hour
      uniqueIps, // Unique IPs (Unique visits)
      totalViews, // Total views
      visitsLast24Hours, // Visits in the past 24 hours
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { collectAnalytics, getAnalytics, getCleanAnalytics };
