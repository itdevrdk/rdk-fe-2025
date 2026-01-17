import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import api from '@/lib/api';

import { isTeamEvent, RegistrationForm, useRegistrationStore } from './store';

import { ApiError, ApiResponse } from '@/types/api';

// Response data type for registration
type RegistrationData = {
  id: string;
  event_type: string;
};

const registerRIC = async (
  form: RegistrationForm,
): Promise<ApiResponse<RegistrationData>> => {
  const isTeam = isTeamEvent(form.event_type);
  const formData = new FormData();

  formData.append('event_type', form.event_type);
  formData.append('agree_data_usage', String(form.agree_data_usage));
  formData.append('agree_guidebook', String(form.agree_guidebook));

  if (isTeam) {
    // Team registration
    formData.append('team_name', form.team_name);
    formData.append('supervisor_name', form.supervisor_name);
    formData.append('supervisor_phone', form.supervisor_phone);
    formData.append('result_link', form.result_link);

    // Append participants without identity_card (will be sent separately)
    const participantsData = form.participants.map((p) => ({
      fullname: p.fullname,
      email: p.email,
      phone: p.phone,
      province: p.province,
      city: p.city,
      institution: p.institution,
      role: p.role,
    }));
    formData.append('participants', JSON.stringify(participantsData));

    // Append identity cards for each participant
    form.participants.forEach((p, index) => {
      if (p.identity_card) {
        formData.append(`identity_card_${index}`, p.identity_card);
      }
    });

    if (form.statement_link) {
      formData.append('statement_link', form.statement_link);
    }

    if (form.plagiarism_statement) {
      formData.append('plagiarism_statement', form.plagiarism_statement);
    }
  } else {
    // Individual registration
    formData.append('fullname', form.fullname);
    formData.append('email', form.email);
    formData.append('phone', form.phone);
    formData.append('province', form.province);
    formData.append('city', form.city);
    formData.append('institution', form.institution);
    formData.append('supervisor_name', form.supervisor_name);
    formData.append('supervisor_phone', form.supervisor_phone);

    if (form.identity_card) {
      formData.append('identity_card', form.identity_card);
    }
    if (form.statement_link) {
      formData.append('statement_link', form.statement_link);
    }
    if (form.poster_link) {
      formData.append('poster_link', form.poster_link);
    }
  }

  const response = await api.post<ApiResponse<RegistrationData>>(
    '/ric/register',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  return response.data;
};

export const useRegisterRIC = () => {
  const clearDraft = useRegistrationStore((state) => state.clearDraft);
  const setErrorMessage = useRegistrationStore(
    (state) => state.setErrorMessage,
  );

  return useMutation({
    mutationFn: registerRIC,
    onSuccess: () => {
      clearDraft();
    },
    onError: (error: AxiosError<ApiError>) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Terjadi kesalahan jaringan. Silakan coba lagi.';
      setErrorMessage(message);
    },
  });
};
