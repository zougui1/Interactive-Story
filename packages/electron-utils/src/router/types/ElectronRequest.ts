export interface ElectronRequest<T = unknown> {
  headers: { id: string };
  body: T;
}
