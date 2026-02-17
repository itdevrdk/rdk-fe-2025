# Backend Endpoint: RSVP Summary

## Overview

Endpoint ini dibutuhkan untuk menampilkan summary statistik RSVP di halaman admin RSVP. Summary menampilkan total pendaftar, jumlah yang sudah hadir (joined), dan jumlah yang masih terdaftar (registered).

## Current Implementation (Temporary)

Saat ini frontend melakukan **3 request terpisah** untuk mendapatkan summary:

1. Request untuk total semua pendaftar
2. Request untuk total yang status 'joined'
3. Request untuk total yang status 'registered'

Ini **tidak efisien** dan sebaiknya diganti dengan endpoint khusus summary.

## Endpoint yang Direkomendasikan

### GET /admin/rsvp/summary

**Description:** Mendapatkan statistik summary untuk RSVP berdasarkan event

**Authentication:** Required (Admin)

**Query Parameters:**

| Parameter  | Type   | Required | Description                                                                  |
| ---------- | ------ | -------- | ---------------------------------------------------------------------------- |
| event_name | string | No       | Filter berdasarkan nama event. Jika kosong, return summary untuk semua event |

**Response Format:**

```json
{
  "code": 200,
  "status": true,
  "message": "Success",
  "data": {
    "event_name": "Nuzulul Quran", // null jika tidak ada filter
    "total_count": 150, // Total semua pendaftar
    "total_joined": 120, // Total yang sudah hadir (status: joined)
    "total_registered": 30 // Total yang masih terdaftar (status: registered)
  }
}
```

**Example Requests:**

```bash
# Get summary for specific event
GET /admin/rsvp/summary?event_name=Nuzulul%20Quran

# Get summary for all events
GET /admin/rsvp/summary
```

**Example Response (Specific Event):**

```json
{
  "code": 200,
  "status": true,
  "message": "Success",
  "data": {
    "event_name": "Nuzulul Quran",
    "total_count": 150,
    "total_joined": 120,
    "total_registered": 30
  }
}
```

**Example Response (All Events):**

```json
{
  "code": 200,
  "status": true,
  "message": "Success",
  "data": {
    "event_name": null,
    "total_count": 450,
    "total_joined": 380,
    "total_registered": 70
  }
}
```

## Database Query Logic

```sql
-- For specific event
SELECT
  COUNT(*) as total_count,
  SUM(CASE WHEN status = 'joined' THEN 1 ELSE 0 END) as total_joined,
  SUM(CASE WHEN status = 'registered' THEN 1 ELSE 0 END) as total_registered
FROM rsvp
WHERE event_name = ? -- if event_name parameter provided

-- For all events (no event_name filter)
SELECT
  COUNT(*) as total_count,
  SUM(CASE WHEN status = 'joined' THEN 1 ELSE 0 END) as total_joined,
  SUM(CASE WHEN status = 'registered' THEN 1 ELSE 0 END) as total_registered
FROM rsvp
```

## Frontend Integration

Frontend akan menggunakan endpoint ini di hook `useRsvpAdmin.ts`:

```typescript
// Hook baru yang akan ditambahkan
export const useGetRsvpSummary = (eventName?: string) => {
  return useQuery({
    queryKey: [...rsvpAdminKeys.all, 'summary', eventName || 'all'],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (eventName) {
        params.set('event_name', eventName);
      }

      const response = await api.get(
        `/admin/rsvp/summary?${params.toString()}`,
      );
      return response.data;
    },
    staleTime: 30 * 1000, // Cache 30 seconds
  });
};
```

## Performance Benefits

**Before (Current - 3 requests):**

```
Request 1: GET /admin/rsvp?page=1&limit=1&event_name=X
Request 2: GET /admin/rsvp?page=1&limit=1&event_name=X&status=joined
Request 3: GET /admin/rsvp?page=1&limit=1&event_name=X&status=registered
```

**After (1 request):**

```
Request 1: GET /admin/rsvp/summary?event_name=X
```

- Mengurangi jumlah request dari 3 menjadi 1
- Lebih efisien untuk database (1 query vs 3 queries)
- Response lebih cepat karena tidak perlu pagination logic

## Event Names (Static List)

Berikut adalah daftar event yang digunakan di frontend:

1. Nuzulul Quran
2. Ngabuburits #1
3. Ngabuburits #2
4. Ngabuburits #3
5. Ngabuburits #4
6. Simposium Ramadan #1
7. Simposium Ramadan #2
8. Lailatul Hikmah
9. HOMe (Heart Of Muslimah)

**Note:** Event name harus match exactly dengan data di database.

## Error Responses

**401 Unauthorized:**

```json
{
  "code": 401,
  "status": false,
  "message": "Unauthorized"
}
```

**500 Internal Server Error:**

```json
{
  "code": 500,
  "status": false,
  "message": "Internal server error"
}
```

## Implementation Priority

**Priority:** Medium-High

**Reason:**

- Current implementation works but not optimal (3 requests)
- Will improve performance and reduce server load
- Better user experience (faster loading)

## Testing

Pastikan endpoint ini di-test dengan:

1. ✅ Query dengan event_name specified
2. ✅ Query tanpa event_name (all events)
3. ✅ Query dengan event_name yang tidak ada di database (should return 0 counts)
4. ✅ Authentication check (non-admin should not access)
5. ✅ Response time (should be < 200ms for reasonable data size)

## Migration Timeline

1. **Backend:** Implement endpoint `/admin/rsvp/summary`
2. **Frontend:** Update hook to use new endpoint
3. **Testing:** Verify summary numbers match
4. **Deploy:** Remove old implementation using 3 requests

---

**Created:** February 17, 2026  
**Related Files:**

- Frontend: `/src/components/admin/rsvp/admin-rsvp-data.tsx`
- Frontend Hook: `/src/hooks/useRsvpAdmin.ts`
- Type Definition: `/src/types/rsvp.ts`
