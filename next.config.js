module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mcqueen-cucumber.s3.amazonaws.com",
        port: "",
        // pathname: "/mcqueen-cucumber/**",
      },
      {
        protocol: "https",
        hostname: "tecdn.b-cdn.net",
        port: "",
        // pathname: "/my-bucket/**",
      },
    ],
  },
}
