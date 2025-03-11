
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.studybuddy.mobile',
  appName: 'StudyBuddy',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    // For development only - remove for production
    url: 'http://localhost:8080',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#F9FAFB",
      splashFullScreen: true,
      splashImmersive: true
    }
  }
};

export default config;
