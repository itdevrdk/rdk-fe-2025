# Instruksi Backend: Menghapus Field Nomor WhatsApp & Pilihan Mentoring

## ✅ Status: COMPLETED

**Backend telah menyelesaikan implementasi perubahan ini.**

Perubahan yang telah diimplementasikan:

- ✅ Field `telephone/whatsapp` dihapus dari request/response
- ✅ Field `mentoring_2026` dihapus dari Nuzulul Quran
- ✅ API endpoints sudah disesuaikan
- ✅ Validation schema sudah diupdate
- ✅ Database migration sudah dijalankan

**Dokumentasi API Aktual:** Lihat API documentation lengkap untuk detail implementasi final.

---

## Overview

Dokumen ini berisi instruksi lengkap untuk menghapus field **nomor WhatsApp/telephone** dan **pilihan mentoring** dari sistem pendaftaran RSVP Nuzulul Quran.

---

## 1. Database Migration

### SQL Command

Hapus kolom dari tabel pendaftaran Nuzulul Quran:

```sql
-- Tambahkan migration baru
ALTER TABLE nuzulul_quran_registrations
DROP COLUMN IF EXISTS telephone,
DROP COLUMN IF EXISTS whatsapp_number,
DROP COLUMN IF EXISTS phone_number,
DROP COLUMN IF EXISTS mentor_choice,
DROP COLUMN IF EXISTS mentor_code,
DROP COLUMN IF EXISTS pilihan_mentoring;
```

### Migration Notes

- Backup database sebelum menjalankan migration
- Test di environment development terlebih dahulu
- Pastikan tidak ada foreign key constraint yang terkait

---

## 2. Model/Entity Update

Hapus field berikut dari model `NuzululQuranRegistration`:

### Field yang Harus Dihapus:

- `telephone` / `whatsapp_number` / `phone_number`
- `mentor_choice` / `mentor_code` / `pilihan_mentoring`

### Contoh (Python/SQLAlchemy):

```python
class NuzululQuranRegistration(Base):
    __tablename__ = 'nuzulul_quran_registrations'

    id = Column(String, primary_key=True)
    nama_lengkap = Column(String, nullable=False)
    email = Column(String, nullable=False)
    jenis_kelamin = Column(String, nullable=False)
    instansi = Column(String, nullable=False)
    code = Column(String, nullable=False, unique=True)
    status = Column(String, default='registered')
    created_at = Column(DateTime, default=datetime.utcnow)

    # HAPUS field berikut:
    # telephone = Column(String)
    # mentor_choice = Column(String)
```

---

## 3. API Endpoint: POST `/rsvp/nuzulul-quran/register`

### Request Body (UPDATED)

**Schema yang VALID sekarang:**

```json
{
  "nama_lengkap": "string",
  "email": "string",
  "jenis_kelamin": "Laki-laki" | "Perempuan",
  "instansi": "string"
}
```

### Validation Schema Update

**Contoh menggunakan Pydantic (Python):**

```python
from pydantic import BaseModel, EmailStr
from typing import Literal

class NuzululQuranRegistrationRequest(BaseModel):
    nama_lengkap: str
    email: EmailStr
    jenis_kelamin: Literal["Laki-laki", "Perempuan"]
    instansi: str

    # HAPUS field berikut:
    # telephone: Optional[str] = None
    # mentor_choice: Optional[str] = None
```

### Response (No Changes)

```json
{
  "code": 200,
  "status": true,
  "message": "Registration successful",
  "data": {
    "fullname": "string",
    "code": "string",
    "status": "registered"
  }
}
```

---

## 4. API Endpoint: GET `/admin/rsvp/{code}/details`

### Response (UPDATED)

**Schema yang VALID sekarang:**

```json
{
  "code": 200,
  "status": true,
  "message": "success",
  "data": {
    "rsvp_id": "string",
    "event_name": "string",
    "fullname": "string",
    "institution": "string",
    "province": "string",
    "city": "string",
    "code": "string",
    "status": "registered" | "joined"
  }
}
```

**HAPUS dari response:**

- ❌ `telephone` / `whatsapp_number` / `phone_number`
- ❌ `mentor_choice` / `mentor_code` / `pilihan_mentoring`

### Contoh Implementation:

```python
def get_registration_detail(code: str):
    registration = db.query(NuzululQuranRegistration).filter_by(code=code).first()

    return {
        "code": 200,
        "status": True,
        "message": "success",
        "data": {
            "rsvp_id": registration.id,
            "event_name": "Nuzulul Quran",
            "fullname": registration.nama_lengkap,
            "institution": registration.instansi,
            "province": registration.province,
            "city": registration.city,
            "code": registration.code,
            "status": registration.status
            # HAPUS: "telephone": registration.telephone
            # HAPUS: "mentor_choice": registration.mentor_choice
        }
    }
```

---

## 5. API Endpoint: GET `/admin/rsvp` (List)

### Response Format (No Changes Required)

Endpoint ini hanya menampilkan data list sederhana, kemungkinan tidak perlu perubahan.

**Verify:** Pastikan tidak ada field `telephone` atau `mentor_choice` yang ter-expose di response list.

---

## 6. Service/Business Logic Update

### Registration Service

Update logic pendaftaran untuk menghapus handling field yang dihapus:

```python
def register_participant(data: NuzululQuranRegistrationRequest):
    # Generate unique code
    code = generate_unique_code()

    # Create new registration
    registration = NuzululQuranRegistration(
        id=str(uuid.uuid4()),
        nama_lengkap=data.nama_lengkap,
        email=data.email,
        jenis_kelamin=data.jenis_kelamin,
        instansi=data.instansi,
        code=code,
        status='registered',
        # HAPUS: telephone=data.telephone
        # HAPUS: mentor_choice=data.mentor_choice
    )

    db.add(registration)
    db.commit()

    # Send email confirmation
    send_confirmation_email(registration.email, registration.code)

    return registration
```

---

## 7. API Documentation Update

### Swagger/OpenAPI

Update dokumentasi API untuk menghapus field yang tidak digunakan:

```yaml
/rsvp/nuzulul-quran/register:
  post:
    summary: Register for Nuzulul Quran event
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required:
              - nama_lengkap
              - email
              - jenis_kelamin
              - instansi
            properties:
              nama_lengkap:
                type: string
                example: 'Ahmad Hidayat'
              email:
                type: string
                format: email
                example: 'ahmad@example.com'
              jenis_kelamin:
                type: string
                enum: ['Laki-laki', 'Perempuan']
                example: 'Laki-laki'
              instansi:
                type: string
                example: 'Engineering'
              # HAPUS properti telephone dan mentor_choice
```

---

## 8. Testing Checklist

### Unit Tests

- [ ] Test registrasi berhasil tanpa field `telephone`
- [ ] Test registrasi berhasil tanpa field `mentor_choice`
- [ ] Test validasi request body yang benar
- [ ] Test model serialization tanpa field yang dihapus

### Integration Tests

- [ ] POST `/rsvp/nuzulul-quran/register` - sukses tanpa field yang dihapus
- [ ] GET `/admin/rsvp/{code}/details` - response tidak mengandung field yang dihapus
- [ ] GET `/admin/rsvp` - list response tidak terpengaruh
- [ ] PATCH `/admin/rsvp/{code}/status` - check-in masih berfungsi

### Database Tests

- [ ] Migration berhasil dijalankan
- [ ] Kolom berhasil dihapus dari tabel
- [ ] Data existing tidak corrupt
- [ ] Rollback migration berfungsi (jika diperlukan)

### Manual Testing

1. **Registrasi Baru:**

   ```bash
   curl -X POST http://localhost:8000/rsvp/nuzulul-quran/register \
     -H "Content-Type: application/json" \
     -d '{
       "nama_lengkap": "Test User",
       "email": "test@example.com",
       "jenis_kelamin": "Laki-laki",
       "instansi": "Umum"
     }'
   ```

2. **Get Detail:**

   ```bash
   curl -X GET http://localhost:8000/admin/rsvp/{code}/details \
     -H "Authorization: Bearer {token}"
   ```

3. **Verify Response** tidak mengandung field `telephone` atau `mentor_choice`

---

## 9. Deployment Steps

### Prerequisites

- [ ] Backup production database
- [ ] Test migration di staging environment
- [ ] Review semua perubahan code

### Deployment Sequence

1. **Deploy Database Migration**

   ```bash
   # Run migration
   alembic upgrade head
   # or
   python manage.py migrate
   ```

2. **Deploy Backend Code**
   - Deploy updated API endpoints
   - Deploy updated models
   - Deploy updated validators

3. **Verify Deployment**
   - Test health check endpoint
   - Test registration endpoint
   - Test admin detail endpoint
   - Monitor error logs

4. **Rollback Plan** (if needed)
   ```bash
   # Rollback migration
   alembic downgrade -1
   # Rollback code deployment
   git revert {commit_hash}
   ```

---

## 10. Coordination with Frontend

### Frontend Changes (Already Completed) ✅

- ✅ Form pendaftaran tidak memiliki field telephone
- ✅ Form pendaftaran tidak memiliki field pilihan mentoring
- ✅ Admin check page tidak menampilkan telephone
- ✅ Type definitions sudah disesuaikan

### Frontend Files Modified:

- `src/types/nuzulul-quran.ts` - Interface updated
- `src/components/admin/nuzulul-quran/admin-nuzulul-quran-check.tsx` - UI updated

### API Contract

Frontend sudah menyesuaikan dengan API contract baru:

- Request tidak mengirim field yang dihapus
- Response tidak expect field yang dihapus

---

## 11. Data Migration (Optional)

Jika ada data lama yang perlu dimigrasi atau dibersihkan:

```sql
-- Backup data lama (optional)
CREATE TABLE nuzulul_quran_registrations_backup AS
SELECT * FROM nuzulul_quran_registrations;

-- Atau export specific columns
SELECT id, telephone, mentor_choice
FROM nuzulul_quran_registrations
WHERE telephone IS NOT NULL OR mentor_choice IS NOT NULL;
```

---

## 12. Monitoring & Validation

### Post-Deployment Monitoring

- Monitor error rates untuk endpoint registrasi
- Monitor response time
- Check logs untuk validation errors
- Verify registration success rate

### Metrics to Watch

- Total registrations per day
- Failed registration attempts
- API response times
- Error rates

---

## 13. Documentation Updates

### Update Documentation:

- [ ] API documentation (Swagger/OpenAPI)
- [ ] README.md (jika ada instruksi registrasi)
- [ ] Developer guide
- [ ] System architecture diagram (jika ada)

---

## Contact & Support

Jika ada pertanyaan atau issue terkait perubahan ini, hubungi:

- **Frontend Team**: [Frontend Developer Name]
- **Backend Team**: [Backend Developer Name]
- **Database Team**: [DBA Name]

---

## Changelog

| Date       | Version | Changes                                                       | Author        |
| ---------- | ------- | ------------------------------------------------------------- | ------------- |
| 2026-02-15 | 1.0     | Initial instruction - Remove telephone & mentor_choice fields | Frontend Team |

---

## Notes

- ⚠️ **PENTING**: Lakukan backup database sebelum migration
- 🔄 Test di development/staging environment terlebih dahulu
- 📝 Update semua dokumentasi terkait
- ✅ Koordinasi dengan frontend team untuk deployment bersamaan
