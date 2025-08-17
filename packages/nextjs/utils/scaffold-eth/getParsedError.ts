export const getParsedError = (error: any): string => {
  if (typeof error === "string") {
    return error;
  }

  if (error?.message) {
    return error.message;
  }

  if (error?.error?.message) {
    return error.error.message;
  }

  if (error?.reason) {
    return error.reason;
  }

  return "An unknown error occurred";
};
