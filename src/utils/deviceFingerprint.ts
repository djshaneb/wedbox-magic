// We'll create a simple device fingerprint based on available browser information
export const getDeviceFingerprint = () => {
  const { userAgent, language, platform } = navigator;
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;
  const colorDepth = window.screen.colorDepth;
  
  // Combine these values into a string and hash it
  const deviceInfo = `${userAgent}-${language}-${platform}-${screenWidth}x${screenHeight}-${colorDepth}`;
  return btoa(deviceInfo); // Base64 encode the string for a cleaner fingerprint
};