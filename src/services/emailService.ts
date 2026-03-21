export const sendEmail = async (
  _toEmail: string,
  type: string,
  _message: string
): Promise<boolean> => {
  console.log(`[EMAIL LOG] type: ${type} | status: sent`);
  return true;
};
