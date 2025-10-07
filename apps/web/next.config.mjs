/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { forceSwcTransforms: true },
  transpilePackages: ["react-native", "@ui", "@game-core", "@animations"],
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "react-native$": "react-native-web"
    };
    return config;
  }
};
export default nextConfig;
