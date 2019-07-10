module.exports = {
  moduleFileExtensions: ["js"],
  setupFiles: [
    "<rootDir>/jest.init.js"
   ],
  transform: {
    "^.+\\.js$": "babel-jest"
  },
  testMatch: ["**/*.(test|spec).(js)"],
  modulePaths: ["node_modules", "client"],
  coveragePathIgnorePatterns: ["/node_modules/", ".history"],
  testEnvironment: "node"
};