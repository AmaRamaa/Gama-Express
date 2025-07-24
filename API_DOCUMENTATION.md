# GamaExpress Vehicle API Documentation

## Overview

The GamaExpress Vehicle API provides comprehensive access to vehicle model data from multiple manufacturers. This RESTful API is built with Express.js and uses Supabase as the backend database.

## Base URL

```
http://localhost:3001
```

## API Documentation

Interactive API documentation is available at: `http://localhost:3001/api-docs`

## Authentication

Currently, the API is open and does not require authentication. Future versions may include API key authentication.

## Rate Limiting

- **Rate Limit**: 1000 requests per 15 minutes per IP address
- **Headers**: Rate limit information is included in response headers

## Response Format

All API responses follow this consistent format:

```json
{
  "success": true,
  "data": { /* response data */ },
  "pagination": { /* pagination info for paginated endpoints */ }
}
```

Error responses:

```json
{
  "error": "Error Type",
  "message": "Detailed error message"
}
```

## Endpoints

### Health Check

**GET** `/health`

Returns server health status.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-01-24T10:00:00.000Z",
  "uptime": 3600,
  "environment": "development"
}
```

---

### Vehicles

#### Search Vehicles

**GET** `/api/v1/vehicles/search`

Advanced vehicle search with filtering and pagination.

**Query Parameters:**
- `q` (string): Search query for manufacturer or model
- `manufacturer` (string): Filter by manufacturer name
- `year_from` (integer): Minimum year filter
- `year_to` (integer): Maximum year filter
- `sort_by` (string): Sort field (`manufacturer`, `model`, `year`)
- `sort_order` (string): Sort order (`asc`, `desc`)
- `page` (integer): Page number (default: 1)
- `limit` (integer): Items per page (max: 100, default: 20)

**Example:**
```bash
GET /api/v1/vehicles/search?q=golf&manufacturer=VW&year_from=2010&page=1&limit=20
```

#### Get All Vehicles

**GET** `/api/v1/vehicles`

Get all vehicles with pagination.

**Query Parameters:**
- `page` (integer): Page number
- `limit` (integer): Items per page (max: 100)
- `sort_by` (string): Sort field
- `sort_order` (string): Sort order

#### Get Vehicle by ID

**GET** `/api/v1/vehicles/:id`

Get specific vehicle details by ID.

#### Get Models by Manufacturer

**GET** `/api/v1/vehicles/manufacturer/:manufacturer/models`

Get all models for a specific manufacturer.

**Parameters:**
- `manufacturer` (string): Manufacturer name

**Query Parameters:**
- `page` (integer): Page number
- `limit` (integer): Items per page

#### Get Models by Year Range

**GET** `/api/v1/vehicles/years/:fromYear/:toYear`

Get models within a specific year range.

**Parameters:**
- `fromYear` (integer): Start year
- `toYear` (integer): End year

#### Get Database Statistics

**GET** `/api/v1/vehicles/stats`

Get comprehensive database statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalVehicles": 5432,
    "totalManufacturers": 43,
    "yearRange": {
      "min": 1977,
      "max": 2024
    },
    "topManufacturers": [
      { "name": "VW", "count": 234 },
      { "name": "BMW", "count": 189 }
    ]
  }
}
```

---

### Manufacturers

#### Get All Manufacturers

**GET** `/api/v1/manufacturers`

Get list of all manufacturers.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "vw",
      "name": "VW",
      "slug": "vw"
    }
  ],
  "total": 43
}
```

#### Get Manufacturer Details

**GET** `/api/v1/manufacturers/:identifier`

Get manufacturer details with sample models.

**Parameters:**
- `identifier` (string): Manufacturer ID, slug, or name

#### Get Manufacturer Statistics

**GET** `/api/v1/manufacturers/:identifier/stats`

Get detailed statistics for a specific manufacturer.

---

### Admin (Future Implementation)

#### Import CSV

**POST** `/api/v1/admin/import/csv`

Import vehicle data from CSV file.

#### Clear Cache

**POST** `/api/v1/admin/cache/clear`

Clear application cache.

#### Database Cleanup

**POST** `/api/v1/admin/database/cleanup`

Clean up duplicate records.

#### System Information

**GET** `/api/v1/admin/system/info`

Get system and database information.

---

## Error Codes

- **200**: Success
- **400**: Bad Request - Invalid parameters
- **404**: Not Found - Resource not found
- **429**: Too Many Requests - Rate limit exceeded
- **500**: Internal Server Error

## Examples

### Search for VW Golf models from 2010 onwards

```bash
curl "http://localhost:3001/api/v1/vehicles/search?q=golf&manufacturer=VW&year_from=2010"
```

### Get all manufacturers

```bash
curl "http://localhost:3001/api/v1/manufacturers"
```

### Get BMW models

```bash
curl "http://localhost:3001/api/v1/vehicles/manufacturer/BMW/models"
```

### Get database statistics

```bash
curl "http://localhost:3001/api/v1/vehicles/stats"
```

## Running the Server

### Development Mode

```bash
npm run server:dev
```

### Production Mode

```bash
npm run server
```

## Environment Variables

Create a `.env` file with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Backend Configuration
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

## Caching

The API implements intelligent caching:
- **Cache Duration**: 5 minutes
- **Cache Scope**: Manufacturers, statistics, and frequently accessed data
- **Cache Management**: Automatic expiry and manual clearing via admin endpoints

## Performance

- **Pagination**: All list endpoints support pagination
- **Rate Limiting**: 1000 requests per 15 minutes per IP
- **Compression**: Gzip compression enabled
- **Response Time**: Most endpoints respond within 100-300ms

## Support

For issues and questions:
- Check the interactive documentation at `/api-docs`
- Review the health endpoint at `/health`
- Monitor server logs for debugging information
