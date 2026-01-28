import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { api } from '@/lib/api';

import {
  DANGER_TOAST,
  showToast,
  SUCCESS_TOAST,
  WARNING_TOAST,
} from '@/components/Toast';

interface RegisterFormData {
  email: string;
  namaLengkap: string;
  status: string;
  whatsapp: string;
  motivasi: string;
  komitmen: string;
  buktiFollow: File | null;
}

export const useKhatamanAkbarRegister = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const registerContent = async (formData: RegisterFormData) => {
    setIsLoading(true);

    try {
      const payload = new FormData();
      payload.append('event_code', 'KHATAMAN_AKBAR_47');
      payload.append('email', formData.email);
      payload.append('full_name', formData.namaLengkap);
      payload.append('phone', formData.whatsapp);

      // Mapping status -> participant_type
      const participantType =
        formData.status === 'Mahasiswa ITS' ? 'ITS' : 'UMUM';
      payload.append('participant_type', participantType);

      payload.append('motivation', formData.motivasi);

      // Mapping komitmen -> commitment_level
      let commitmentLevel = 'TIDAK_SIAP';
      if (formData.komitmen === 'Insya Allah bisa') {
        commitmentLevel = 'SIAP';
      } else if (formData.komitmen === 'Insya Allah diusahakan') {
        commitmentLevel = 'DIUSAHAKAN';
      }
      payload.append('commitment_level', commitmentLevel);

      if (formData.buktiFollow) {
        payload.append('follow_proof', formData.buktiFollow);
      }

      const response = await api.post('/api/v1/volunteer/register', payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.status) {
        showToast('Pendaftaran berhasil!', SUCCESS_TOAST);
        // Optional: Redirect or Reset form
        setTimeout(() => {
          router.push('/khataman-akbar');
        }, 1500);
      }
    } catch (error: unknown) {
      // Handle known errors
      const err = error as {
        response?: { status: number; data: { message: string } };
      };
      if (err.response) {
        const { status, data } = err.response;
        if (status === 409) {
          showToast(
            data.message || 'Email sudah terdaftar pada event ini',
            WARNING_TOAST,
          );
        } else if (status === 400) {
          showToast(data.message || 'Validasi gagal', DANGER_TOAST);
        } else {
          showToast(
            data.message || 'Terjadi kesalahan pada server',
            DANGER_TOAST,
          );
        }
      } else {
        showToast('Gagal menghubungi server', DANGER_TOAST);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    registerContent,
  };
};
