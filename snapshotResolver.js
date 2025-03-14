const path = require("path");

module.exports = {
  // resolves from test to snapshot path
  resolveSnapshotPath: (testPath, snapshotExtension) => {
    const testDirectory = path.dirname(testPath);
    const testFilename = path.basename(testPath);
    const result = `${testDirectory}/snapshots/${testFilename}${snapshotExtension}`;
    return result;
  },
  // resolves from snapshot to test path
  resolveTestPath: (snapshotFilePath, snapshotExtension) => {
    const testSourceFile = snapshotFilePath
      .replace(`/snapshots`, "")
      .replace(snapshotExtension, "");

    return testSourceFile;
  },
  // Example test path, used for preflight consistency check of the implementation above
  testPathForConsistencyCheck: "dist/some-path/example.test.js",
};
