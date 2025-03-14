module.exports = {
  verbose: true,
  preset: "ts-jest",
  testEnvironment: "./delta-receiver.js",
  testSequencer: "./testSequencer.js",
  snapshotResolver: "./snapshotResolver.js",
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
};
