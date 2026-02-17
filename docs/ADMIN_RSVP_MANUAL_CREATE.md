# Backend Instructions: Admin Manual RSVP Creation

## Overview

Fitur untuk admin menambahkan data RSVP secara manual dengan input hanya **nama lengkap** dan **institusi**. Endpoint ini digunakan ketika ada peserta yang belum mengisi RSVP tetapi sudah hadir atau perlu didaftarkan secara manual.

---

## API Endpoint

### POST `/api/v1/admin/rsvp`

**Purpose**: Create RSVP record manually by admin

**Authentication**: Required (Admin role)

---

## Request Format

### Headers

```
Content-Type: application/json
Authorization: Bearer <admin_token>
```

### Request Body

```json
{
  "fullname": "string (required, min 1 char)",
  "institution": "string (required, min 1 char)",
  "event_name": "string (required - exact match)"
}
```

### Field Specifications

| Field         | Type   | Required | Validation            | Notes                                   |
| ------------- | ------ | -------- | --------------------- | --------------------------------------- |
| `fullname`    | string | ✅ Yes   | Min 1 char, max 255   | Nama lengkap peserta                    |
| `institution` | string | ✅ Yes   | Min 1 char, max 255   | Institusi/Organisasi peserta            |
| `event_name`  | string | ✅ Yes   | Exact match dari list | Harus sesuai dengan event yang tersedia |

### Valid Event Names (Frontend List)

```
- Nuzulul Quran
- Ngabuburits #1
- Ngabuburits #2
- Ngabuburits #3
- Ngabuburits #4
- Simposium Ramadan #1
- Simposium Ramadan #2
- Lailatul Hikmah
- HOMe (Heart Of Muslimah)
```

---

## Request Examples

### Example 1: Success Request

```bash
curl -X POST https://api.example.com/api/v1/admin/rsvp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "fullname": "Ahmad Hidayat",
    "institution": "Institut Teknologi Sepuluh Nopember",
    "event_name": "Nuzulul Quran"
  }'
```

---

## Response Format

### Success Response (201 Created)

```json
{
  "code": 201,
  "status": true,
  "message": "Data RSVP berhasil ditambahkan",
  "data": {
    "rsvp_id": "550e8400-e29b-41d4-a716-446655440000",
    "fullname": "Ahmad Hidayat",
    "institution": "Institut Teknologi Sepuluh Nopember",
    "code": "RDKA49",
    "status": "registered",
    "event_name": "Nuzulul Quran"
  }
}
```

### Response Field Details

| Field         | Type   | Description                                                    |
| ------------- | ------ | -------------------------------------------------------------- |
| `rsvp_id`     | UUID   | Unique identifier untuk RSVP record di database                |
| `fullname`    | string | Nama lengkap yang disimpan                                     |
| `institution` | string | Institusi yang disimpan                                        |
| `code`        | string | Generated unique code (6 chars, format: `RDKA##` atau `RDK##`) |
| `status`      | string | Always "registered" untuk manual creation (belum hadir)        |
| `event_name`  | string | Nama event yang dipilih                                        |

---

## Error Handling

### Error Response Examples

#### 1. Missing Required Field (400 Bad Request)

```json
{
  "code": 400,
  "status": false,
  "message": "Fullname dan institution harus diisi"
}
```

#### 2. Invalid Event Name (400 Bad Request)

```json
{
  "code": 400,
  "status": false,
  "message": "Event name tidak valid. Pilih dari list: Nuzulul Quran, Ngabuburits #1, ..."
}
```

#### 3. Unauthorized (401 Unauthorized)

```json
{
  "code": 401,
  "status": false,
  "message": "Unauthorized. Admin access required"
}
```

#### 4. Duplicate Entry (409 Conflict) - Optional

```json
{
  "code": 409,
  "status": false,
  "message": "Peserta dengan nama dan institusi yang sama sudah terdaftar untuk event ini"
}
```

#### 5. Server Error (500 Internal Server Error)

```json
{
  "code": 500,
  "status": false,
  "message": "Gagal menambahkan data RSVP"
}
```

---

## Backend Implementation Logic

### Step-by-Step Process:

1. **Validate Authentication**
   - Verify JWT token dari header
   - Pastikan user adalah admin
   - Return 401 jika tidak authorized

2. **Validate Input**
   - Check fullname tidak kosong dan valid length (1-255 chars)
   - Check institution tidak kosong dan valid length (1-255 chars)
   - Check event_name ada di list event yang valid
   - Return 400 jika ada validation error

3. **Generate Unique Code**
   - Format: `RDKA` + 2 digit random number (00-99) atau `RDK` + 2 digit
   - Pastikan code belum exist di database
   - Retry jika code sudah ada (iterasi sampai dapat code yang unique)
   - Example: `RDKA49`, `RDKA87`, `RDK45`, dll

4. **Save to Database**
   - Create RSVP record dengan:
     - fullname (from request)
     - institution (from request)
     - event_name (from request)
     - code (generated)
     - status: "registered" (default untuk manual creation)
     - email: null atau kosong (optional)
     - gender: null atau kosong (optional)
     - province: null atau kosong (optional, bisa diisi default)
     - city: null atau kosong (optional, bisa diisi default)
     - created_at: current timestamp
     - updated_at: current timestamp

5. **Return Success Response**
   - Status 201 Created
   - Return created RSVP data dengan code yang sudah generated
   - Include rsvp_id untuk reference

### Database Table Schema Reference

```sql
CREATE TABLE rsvp (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fullname VARCHAR(255) NOT NULL,
  institution VARCHAR(255) NOT NULL,
  province VARCHAR(255),
  city VARCHAR(255),
  code VARCHAR(10) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'registered', -- 'registered' or 'joined'
  event_name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  gender VARCHAR(50),
  event_type VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_rsvp_code ON rsvp(code);
CREATE INDEX idx_rsvp_event_name ON rsvp(event_name);
CREATE INDEX idx_rsvp_fullname ON rsvp(fullname);
```

---

## Integration with Existing Features

### Cache Invalidation

Setelah berhasil create RSVP, pastikan:

- Invalidate RSVP list cache (untuk halaman admin)
- Invalidate summary/statistics cache (total count, registered count, joined count)

### Query Cache Keys (from frontend)

```typescript
rsvpAdminKeys.lists(); // Invalidate list queries
rsvpAdminKeys.summaries(); // Invalidate summary queries
```

---

## Testing Checklist

### Manual Testing

- [ ] Create RSVP dengan nama dan institusi valid
- [ ] Verify code yang generated unique
- [ ] Verify status = "registered"
- [ ] Verify data muncul di admin RSVP data list
- [ ] Verify summary count ter-update

### Error Testing

- [ ] Test dengan fullname kosong → 400 error
- [ ] Test dengan institution kosong → 400 error
- [ ] Test dengan event_name invalid → 400 error
- [ ] Test tanpa authentication → 401 error
- [ ] Test dengan non-admin user → 401 error

### Edge Cases

- [ ] Test dengan fullname panjang (max 255)
- [ ] Test dengan institution panjang (max 255)
- [ ] Test dengan special characters di fullname/institution
- [ ] Test concurrent requests (code uniqueness)

---

## Frontend Integration Info

### Frontend Hook

```typescript
const { mutateAsync: createRsvp } = useCreateRsvpManual();

// Usage
await createRsvp({
  fullname: 'Ahmad Hidayat',
  institution: 'ITS',
  event_name: 'Nuzulul Quran',
});
```

### Frontend Files

- Modal: `src/components/admin/rsvp/admin-rsvp-add-modal.tsx`
- Data Component: `src/components/admin/rsvp/admin-rsvp-data.tsx`
- Hook: `src/hooks/useRsvpAdmin.ts` (useCreateRsvpManual)
- Types: `src/types/rsvp.ts` (RsvpAdminCreateRequest, RsvpAdminCreateResponse)

---

## Notes

- Event name harus exact match (case-sensitive)
- Code harus unique di seluruh database
- Status selalu "registered" untuk manual creation (bukan "joined")
- Email, gender, province, city bisa optional atau default value
- Created by admin, bukan self-registration
