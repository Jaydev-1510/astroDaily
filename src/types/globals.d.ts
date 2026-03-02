export {};

declare global {
  interface APODItem {
    date: string;
    title: string;
    url: string;
    hdurl?: string | null;
  }

  interface Window {
    BOOTSTRAP_DATA?: APODItem[];
  }
}
