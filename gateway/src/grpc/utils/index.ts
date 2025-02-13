export function grpcPromise<TRequest, TResponse>(
  method: (req: TRequest, callback: (err: Error | null, response: TResponse) => void) => void,
  request: TRequest
): Promise<TResponse> {
  return new Promise((resolve, reject) => {
    method(request, (err, response) => {
      if (err) {
        return reject(err);
      }
      resolve(response);
    });
  });
};
