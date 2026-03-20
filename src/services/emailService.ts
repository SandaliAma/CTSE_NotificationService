export const sendEmail = async (
  toEmail: string,
  type: string,
  message: string
): Promise<boolean> => {
  console.log(`[EMAIL LOG] to: ${toEmail} | type: ${type} | message: ${message}`);
  return true;
};
