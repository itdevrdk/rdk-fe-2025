# RSVP API Integration

This document provides an overview of the RSVP API integration implemented in the frontend application.

## 📁 Files Created

### Type Definitions

- **[src/types/rsvp.ts](src/types/rsvp.ts)** - TypeScript type definitions for RSVP endpoints
  - General RSVP types (registration, responses)
  - Admin RSVP types (queries, list items, details)
  - Status update types

### Custom Hooks

#### 1. **[src/hooks/useRsvp.ts](src/hooks/useRsvp.ts)** - General RSVP Hook (Public)

Handles public general RSVP operations:

- `registerRsvp()` - POST /api/v1/rsvp

#### 2. **[src/hooks/useRsvpAdmin.ts](src/hooks/useRsvpAdmin.ts)** - Admin RSVP Hook (Authenticated)

Handles all admin RSVP operations (for both general and Nuzulul Quran events):

- `getAllRsvps()` - GET /api/v1/admin/rsvp (with pagination and filters)
- `getRsvpByCode()` - GET /api/v1/admin/rsvp/:code (for check-in)
- `getRsvpDetails()` - GET /api/v1/admin/rsvp/:code/details (complete info)
- `updateRsvpStatus()` - PATCH /api/v1/admin/rsvp/:code/status (check-in)

#### 3. **[src/hooks/useNuzululQuran.ts](src/hooks/useNuzululQuran.ts)** - Nuzulul Quran Hook (Existing)

Already implements Nuzulul Quran specific endpoints:

- `registerParticipant()` - POST /api/v1/rsvp/nuzulul-quran/register
- `checkRegistrationStatus()` - GET /api/v1/rsvp/nuzulul-quran/check (search by email or name)
- `getAdminRegistrations()` - GET /api/v1/admin/rsvp (for admin list)

## 🚀 Usage Examples

### Public General RSVP Registration

```tsx
import { useRsvp } from '@/hooks/useRsvp';

function GeneralRsvpForm() {
  const { loading, registerRsvp } = useRsvp();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await registerRsvp({
        fullname: 'Ahmad Fauzi',
        institution: 'Institut Teknologi Sepuluh Nopember',
        province: 'Jawa Timur',
        city: 'Surabaya',
      });

      console.log('Registration code:', result.data.code); // "RDKA49"
      console.log('Status:', result.data.status); // "registered"
    } catch (error) {
      // Handle errors (409 duplicate, 422 validation, etc.)
      console.error('Registration failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
}
```

### Nuzulul Quran Registration

```tsx
import { useNuzululQuran } from '@/hooks/useNuzululQuran';

function NuzululQuranForm() {
  const { loading, registerParticipant } = useNuzululQuran();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await registerParticipant({
        nama_lengkap: 'Fatimah Zahra',
        email: 'fatimah@example.com',
        jenis_kelamin: 'Perempuan',
        instansi: 'Engineering',
      });

      console.log('Registration code:', result.data.code); // "RDKB7X"
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return <form onSubmit={handleSubmit}>{/* Form fields */}</form>;
}
```

### Check Nuzulul Quran Registration Status

**Search supports both email and full name (nama_lengkap)**

```tsx
import { useNuzululQuran } from '@/hooks/useNuzululQuran';

function CheckRegistration() {
  const { loading, checkRegistrationStatus } = useNuzululQuran();

  const handleCheck = async (searchTerm) => {
    try {
      // Search by email: 'fatimah@example.com'
      // OR by full name: 'Fatimah Zahra'
      const result = await checkRegistrationStatus(searchTerm);

      if (result.data.is_registered) {
        console.log('Found:', result.data.data);
        // {
        //   id: "550e8400-...",
        //   nama_lengkap: "Fatimah Zahra",
        //   email: "fatimah@example.com",
        //   registered_at: "2026-02-15T15:30:00+07:00",
        //   status: "registered"
        // }
      } else {
        console.log('Not registered');
      }
    } catch (error) {
      console.error('Check failed:', error);
    }
  };

  return (
    <div>
      <input
        onChange={(e) => handleCheck(e.target.value)}
        placeholder='Enter email or name'
      />
    </div>
  );
}
```

### Admin: Get All RSVPs with Filters

```tsx
import { useRsvpAdmin } from '@/hooks/useRsvpAdmin';

function AdminRsvpList() {
  const { loading, getAllRsvps } = useRsvpAdmin();

  useEffect(() => {
    const fetchRsvps = async () => {
      try {
        const result = await getAllRsvps({
          event_name: "Peringatan Nuzulul Qur'an RDK 47 ITS",
          page: 1,
          limit: 10,
          status: 'registered',
          search: 'Ahmad',
        });

        console.log('RSVPs:', result.data);
        // [{ fullname: "Ahmad Fauzi", code: "RDKA49" }, ...]

        console.log('Pagination:', result.meta);
        // { page: 1, limit: 10, total_data: 25, total_page: 3 }
      } catch (error) {
        console.error('Fetch failed:', error);
      }
    };

    fetchRsvps();
  }, [getAllRsvps]);

  return <div>{/* Render list */}</div>;
}
```

### Admin: Check-in Participant

```tsx
import { useRsvpAdmin } from '@/hooks/useRsvpAdmin';

function CheckInScanner() {
  const { loading, getRsvpByCode, updateRsvpStatus } = useRsvpAdmin();

  const handleCheckIn = async (code) => {
    try {
      // First, get participant info
      const participant = await getRsvpByCode(code);
      console.log('Participant:', participant.data);
      // {
      //   event_name: "Peringatan Nuzulul Qur'an RDK 47 ITS",
      //   fullname: "Ahmad Fauzi",
      //   code: "RDKA49",
      //   status: "registered"
      // }

      // Check if already joined
      if (participant.data.status === 'joined') {
        alert('Already checked in!');
        return;
      }

      // Check-in the participant
      const result = await updateRsvpStatus(code, { status: 'joined' });
      console.log('Checked in:', result.data.fullname);
    } catch (error) {
      if (error.response?.status === 404) {
        alert('RSVP code not found');
      } else if (error.response?.status === 409) {
        alert('Already checked in');
      } else {
        alert('Check-in failed');
      }
    }
  };

  return (
    <div>
      <input
        onChange={(e) => handleCheckIn(e.target.value)}
        placeholder='Scan or enter code'
      />
    </div>
  );
}
```

### Admin: Get Complete RSVP Details

```tsx
import { useRsvpAdmin } from '@/hooks/useRsvpAdmin';

function RsvpDetails({ code }) {
  const { loading, getRsvpDetails } = useRsvpAdmin();
  const [details, setDetails] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const result = await getRsvpDetails(code);
        setDetails(result.data);
        // {
        //   rsvp_id: "550e8400-...",
        //   event_name: "Peringatan Nuzulul Qur'an RDK 47 ITS",
        //   fullname: "Ahmad Fauzi",
        //   institution: "Institut Teknologi Sepuluh Nopember",
        //   province: "Jawa Timur",
        //   city: "Surabaya",
        //   code: "RDKA49",
        //   status: "registered"
        // }
      } catch (error) {
        console.error('Fetch details failed:', error);
      }
    };

    fetchDetails();
  }, [code, getRsvpDetails]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>{details?.fullname}</h2>
      <p>Institution: {details?.institution}</p>
      <p>
        Location: {details?.city}, {details?.province}
      </p>
      <p>Code: {details?.code}</p>
      <p>Status: {details?.status}</p>
    </div>
  );
}
```

## 🔐 Authentication

Admin endpoints (`useRsvpAdmin` methods) require JWT authentication. The authentication token is automatically included in requests via the axios interceptor configured in [src/lib/api.ts](src/lib/api.ts).

The token is retrieved from:

- **Client-side**: Cookie named `rdk-its`
- **Server-side**: From request headers

## ⚠️ Error Handling

All hooks use try-finally blocks to manage loading state. Error handling is left to the consumer. Common errors:

### Public Endpoints

- **400**: Invalid request body or missing search parameter
- **409**: Duplicate registration (same fullname/email)
- **422**: Validation error (missing required fields, invalid email, etc.)

### Admin Endpoints

- **401**: Unauthorized (missing or invalid token)
- **404**: RSVP not found
- **409**: Already checked in (status already "joined")
- **422**: Invalid status value or query parameters

## 📊 Response Formats

All responses follow the standard API format:

```typescript
{
  code: number;        // HTTP status code
  status: boolean;     // Success flag
  message: string;     // Human-readable message
  data: T;            // Response data (type varies)
  meta?: object;      // Pagination metadata (for list endpoints)
  error?: string;     // Error message (on failure)
}
```

## 🔄 Breaking Changes from Previous API

1. **Removed Fields**: `telephone`, `whatsapp`, `mentoring_2026` no longer exist
2. **Duplicate Check**: Now uses `fullname` only (not `fullname + telephone`)
3. **Error Messages**: Updated to reflect removal of telephone field

## � Important Notes About Search

**Nuzulul Quran Check Registration (`checkRegistrationStatus`)**:

- ✅ Can search by **EMAIL**: `"fatimah@example.com"`
- ✅ Can search by **FULL NAME**: `"Fatimah Zahra"`
- The backend will match against both `email` and `nama_lengkap` fields
- Search is case-insensitive (backend handles this)
- Return `404` if not found, `200` with data if found

**Example**: Both of these work:

```tsx
// Search by email
await checkRegistrationStatus('fatimah@example.com');

// Search by name
await checkRegistrationStatus('Fatimah Zahra');
```

## �📚 Related Documentation

- Backend API Documentation: [docs/backend-instructions-nuzulul-quran.md](docs/backend-instructions-nuzulul-quran.md)
- Type Definitions: [src/types/rsvp.ts](src/types/rsvp.ts)
- Existing Nuzulul Quran Types: [src/types/nuzulul-quran.ts](src/types/nuzulul-quran.ts)
