export const isRegistrationClosed = (
  deadline?: Date | string | null,
): boolean => {
  if (!deadline) return false;
  const now = new Date();
  const deadlineDate = new Date(deadline);
  return now > deadlineDate;
};
