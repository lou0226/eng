declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_DICTIONARY_API_KEY: string;
      // Add other environment variables here
    }
  }
}

// Ensure this file is treated as a module
export {};