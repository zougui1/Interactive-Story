export const wait = (timeoutMillisecond: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeoutMillisecond);
  });
};
