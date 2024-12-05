## Analytics System

A robust analytics collection and reporting system that tracks visitor data, device information, and provides detailed analytics insights.

## Usage

0. fix in all neccessary details about website
  <br>>> `client/lib/siteData.js`
  <br>>> `server/.env`

1. install packages `npm run install`
2. run the server `npm run start:server`
3. run the client `npm run start:client`

in the target website, add a post request to the `<head>` tag

```html
<script defer>
  fetch('http://<hosted backend endpoint link>/api/clean_data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      url: window.location.href,
      referrer: document.referrer
    })
  });
</script>
```

## Features

- Visitor tracking with IP geolocation
- Browser and device detection
- Operating system identification
- Time-based analytics
- Clean data aggregation and reporting

## API Endpoints

### 1. Collect Analytics
- **POST** `/api`
- Collects visitor information including:
  - IP address and geolocation
  - Browser details
  - Operating system
  - Device type
  - Screen dimensions
  - Timestamp
  - Language preferences

### 2. Get Raw Analytics
- **GET** `/api`
- Returns raw analytics data
- Supports time range filtering (24h, 7d, 30d)

### 3. Get Clean Analytics
- **GET** `/api/clean_data`
- Returns processed analytics with:
  - Device usage statistics
  - Browser distribution
  - Operating system breakdown
  - Country-wise visitor distribution
  - Hourly and daily visit patterns
  - Unique visitor counts
  - Total page views
  - Last 24-hour statistics

## Environment Setup

Required environment variables:
- `PORT` - Server port (defaults to 3002)
- MongoDB connection string (handled by connectMongo)

## API Response Format
```json
{
  "data": [...],
  "deviceCounts": {...},
  "browserCounts": {...},
  "osCounts": {...},
  "countryCounts": {...},
  "visitsByDay": {...},
  "visitsByHour": {...},
  "uniqueIps": number,
  "totalViews": number,
  "visitsLast24Hours": number
}
```

This analytics system provides comprehensive visitor tracking and reporting capabilities, making it suitable for websites and applications requiring detailed user analytics.