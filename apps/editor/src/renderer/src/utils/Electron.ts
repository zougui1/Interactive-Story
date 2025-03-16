import type zod from 'zod';

class ElectronClass {
  debug = false;

  get isAvailable(): boolean {
    return Boolean(window.electron)
  }

  request = async <TParams extends zod.ZodType, TResponse extends zod.ZodType>(
    definition: RouteDefinition<TParams, TResponse>,
    data: zod.infer<TParams>,
  ): Promise<ElectronResponse<zod.infer<TResponse>>> => {
    const { nanoid } = await import('nanoid');

    return new Promise((resolve, reject) => {
      if (!this.isAvailable) {
        return reject(new Error('No electron process'));
      }

      const request: ElectronRequest = {
        headers: { id: nanoid() },
        body: data,
      };

      const offSuccess = window.electron?.on(`${definition.fullPath}.success`, async (event, response) => {
        if (response.headers.id === request.headers.id) {
          if (this.debug) {
            console.log(`electron: on ${definition.fullPath}.success`);
          }

          try {
            const data = await definition.response.parseAsync(response.body);

            resolve({
              ...response,
              data,
            });
          } catch (error) {
            console.error(error);
            reject(error);
          } finally {
            cleanup();
          }
        }
      });

      const offError = window.electron?.on(`${definition.fullPath}.error`, (event, response) => {
        if (response.headers.id === request.headers.id) {
          if (this.debug) {
            console.log(`electron: on ${definition.fullPath}.error`, response.body);
          }

          cleanup();
          reject(response.body);
        }
      });

      const cleanup = () => {
        offSuccess?.();
        offError?.();
      }

      if (this.debug) {
        console.log(`electron: send ${definition.fullPath}`);
      }

      window.electron?.send(definition.fullPath, request);
    });
  }
}

export const Electron = new ElectronClass();

export interface ElectronResponse<T> extends Omit<ElectronRequest<T>, 'body'> {
  data: T;
}
