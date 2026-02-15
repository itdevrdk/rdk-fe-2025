# RSVP API Quick Reference

Quick lookup for RSVP endpoints implementation in the frontend.

## 📦 Imports

```tsx
// General RSVP (Public)
import { useRsvp } from '@/hooks/useRsvp';

// Nuzulul Quran (Public)
import { useNuzululQuran } from '@/hooks/useNuzululQuran';

// Admin Operations (Authenticated)
import { useRsvpAdmin } from '@/hooks/useRsvpAdmin';
```

## 🎯 Quick Usage

### Public Endpoints (No Auth)

| Hook              | Method                      | Endpoint                            | Purpose                    |
| ----------------- | --------------------------- | ----------------------------------- | -------------------------- |
| `useRsvp`         | `registerRsvp()`            | `POST /rsvp`                        | General RSVP registration  |
| `useNuzululQuran` | `registerParticipant()`     | `POST /rsvp/nuzulul-quran/register` | Nuzulul Quran registration |
| `useNuzululQuran` | `checkRegistrationStatus()` | `GET /rsvp/nuzulul-quran/check`     | Check by email or name     |

### Admin Endpoints (Auth Required)

| Hook           | Method               | Endpoint                         | Purpose                 |
| -------------- | -------------------- | -------------------------------- | ----------------------- |
| `useRsvpAdmin` | `getAllRsvps()`      | `GET /admin/rsvp`                | Get paginated RSVP list |
| `useRsvpAdmin` | `getRsvpByCode()`    | `GET /admin/rsvp/:code`          | Get RSVP for check-in   |
| `useRsvpAdmin` | `getRsvpDetails()`   | `GET /admin/rsvp/:code/details`  | Get complete details    |
| `useRsvpAdmin` | `updateRsvpStatus()` | `PATCH /admin/rsvp/:code/status` | Check-in participant    |

## 💻 Code Snippets

### General RSVP Registration

```tsx
const { loading, registerRsvp } = useRsvp();

const result = await registerRsvp({
  fullname: 'Ahmad Fauzi',
  institution: 'ITS',
  province: 'Jawa Timur',
  city: 'Surabaya',
});
// Returns: { data: { fullname, code, status } }
```

### Nuzulul Quran Registration

```tsx
const { loading, registerParticipant } = useNuzululQuran();

const result = await registerParticipant({
  nama_lengkap: 'Fatimah Zahra',
  email: 'fatimah@example.com',
  jenis_kelamin: 'Perempuan',
  instansi: 'Engineering',
});
// Returns: { data: { fullname, code, status } }
```

### Check Registration

**Supports search by email OR full name**

```tsx
const { loading, checkRegistrationStatus } = useNuzululQuran();

// Search by email
const result1 = await checkRegistrationStatus('fatimah@example.com');

// Search by full name
const result2 = await checkRegistrationStatus('Fatimah Zahra');

// Returns: { data: { is_registered, data: {...} } }
```

### Get RSVP List (Admin)

```tsx
const { loading, getAllRsvps } = useRsvpAdmin();

const result = await getAllRsvps({
  page: 1,
  limit: 10,
  status: 'registered',
  search: 'Ahmad',
});
// Returns: { data: [...], meta: { page, limit, total_data, total_page } }
```

### Check-in Flow (Admin)

```tsx
const { loading, getRsvpByCode, updateRsvpStatus } = useRsvpAdmin();

// 1. Verify participant
const participant = await getRsvpByCode('RDKA49');

// 2. Check-in
if (participant.data.status === 'registered') {
  await updateRsvpStatus('RDKA49', { status: 'joined' });
}
```

## 🎨 Component Examples

### Registration Form Component

```tsx
'use client';

import { useState } from 'react';
import { useRsvp } from '@/hooks/useRsvp';

export function RsvpForm() {
  const { loading, registerRsvp } = useRsvp();
  const [code, setCode] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const result = await registerRsvp({
        fullname: formData.get('fullname') as string,
        institution: formData.get('institution') as string,
        province: formData.get('province') as string,
        city: formData.get('city') as string,
      });

      setCode(result.data.code);
      alert(`Registration successful! Your code: ${result.data.code}`);
    } catch (error: any) {
      if (error.response?.status === 409) {
        alert('You are already registered!');
      } else {
        alert('Registration failed. Please try again.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name='fullname' required placeholder='Full Name' />
      <input name='institution' required placeholder='Institution' />
      <input name='province' required placeholder='Province' />
      <input name='city' required placeholder='City' />
      <button disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </button>
      {code && (
        <p>
          Your RSVP Code: <strong>{code}</strong>
        </p>
      )}
    </form>
  );
}
```

### Check-in Scanner Component

```tsx
'use client';

import { useState } from 'react';
import { useRsvpAdmin } from '@/hooks/useRsvpAdmin';

export function CheckInScanner() {
  const { loading, getRsvpByCode, updateRsvpStatus } = useRsvpAdmin();
  const [participant, setParticipant] = useState(null);

  const handleScan = async (code: string) => {
    try {
      const result = await getRsvpByCode(code);
      setParticipant(result.data);

      if (result.data.status === 'joined') {
        alert('Already checked in!');
        return;
      }

      // Auto check-in
      await updateRsvpStatus(code, { status: 'joined' });
      alert(`Welcome, ${result.data.fullname}!`);
    } catch (error: any) {
      if (error.response?.status === 404) {
        alert('Invalid RSVP code');
      }
    }
  };

  return (
    <div>
      <input
        onChange={(e) => handleScan(e.target.value)}
        placeholder='Scan or enter code'
        disabled={loading}
      />
      {participant && (
        <div>
          <h3>{participant.fullname}</h3>
          <p>Event: {participant.event_name}</p>
          <p>Status: {participant.status}</p>
        </div>
      )}
    </div>
  );
}
```

### Admin RSVP List Component

```tsx
'use client';

import { useEffect, useState } from 'react';
import { useRsvpAdmin } from '@/hooks/useRsvpAdmin';

export function AdminRsvpList() {
  const { loading, getAllRsvps } = useRsvpAdmin();
  const [rsvps, setRsvps] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getAllRsvps({
        page,
        limit: 10,
        status: 'registered',
      });
      setRsvps(result.data);
    };
    fetchData();
  }, [page, getAllRsvps]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Code</th>
          </tr>
        </thead>
        <tbody>
          {rsvps.map((rsvp) => (
            <tr key={rsvp.code}>
              <td>{rsvp.fullname}</td>
              <td>{rsvp.code}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => setPage((p) => p - 1)} disabled={page === 1}>
        Previous
      </button>
      <button onClick={() => setPage((p) => p + 1)}>Next</button>
    </div>
  );
}
```

## ⚡ Common Patterns

### Error Handling

```tsx
try {
  await registerRsvp(data);
} catch (error: any) {
  const status = error.response?.status;
  const message = error.response?.data?.message;

  switch (status) {
    case 409: // Duplicate
      alert('Already registered');
      break;
    case 422: // Validation
      alert('Please fill all required fields');
      break;
    default:
      alert('Something went wrong');
  }
}
```

### Loading States

```tsx
const { loading, registerRsvp } = useRsvp();

return (
  <button disabled={loading}>{loading ? 'Processing...' : 'Submit'}</button>
);
```

### Pagination

```tsx
const [page, setPage] = useState(1);
const result = await getAllRsvps({ page, limit: 10 });

// result.meta.total_page - Total pages available
// result.meta.total_data - Total records
```

## 🔒 Authentication

Admin hooks automatically include JWT token from cookie (`rdk-its`). No manual token handling needed.

## 📝 Field Mappings

### General RSVP

```typescript
{
  fullname: string; // Required
  institution: string; // Required
  province: string; // Required
  city: string; // Required
}
```

### Nuzulul Quran RSVP

```typescript
{
  nama_lengkap: string; // Required
  email: string; // Required, valid email
  jenis_kelamin: 'Laki-laki' | 'Perempuan'; // Required
  instansi: string; // Required
}
```

### Status Values

- `"registered"` - Initial state after registration
- `"joined"` - After check-in (one-way, cannot revert)

## 🚨 Important Notes

1. **Duplicate Check**: Based on `fullname` only (no telephone field)
2. **RSVP Code**: Auto-generated, format: `RDK` + 3 random alphanumeric chars
3. **Status Flow**: `registered` → `joined` (one-way)
4. **Admin Auth**: All admin methods require valid JWT token
5. **Search Flexibility**: Nuzulul Quran check supports **BOTH email and full name** - you can search using either `"fatimah@example.com"` OR `"Fatimah Zahra"`

## 📚 Files Reference

- Types: [src/types/rsvp.ts](../src/types/rsvp.ts)
- General Hook: [src/hooks/useRsvp.ts](../src/hooks/useRsvp.ts)
- Admin Hook: [src/hooks/useRsvpAdmin.ts](../src/hooks/useRsvpAdmin.ts)
- Nuzulul Quran Hook: [src/hooks/useNuzululQuran.ts](../src/hooks/useNuzululQuran.ts)
- Full Docs: [RSVP_INTEGRATION.md](RSVP_INTEGRATION.md)
