const fs = require("fs");
const path = require("path");

class CustomReporter {
  onInit(context) {
    this.context = context;
  }

  onFinished(results) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const logFileName = `test-results-${timestamp}.log`;
    const logFilePath = path.join(__dirname, logFileName);

    const logData = results.map((result) => ({
      file: result.file,
      name: result.name,
      status: result.status,
      duration: result.duration,
      error: result.error ? result.error.message : null,
    }));

    fs.writeFileSync(logFilePath, JSON.stringify(logData, null, 2));
    console.log(`Test results saved to ${logFilePath}`);
  }
}

module.exports = CustomReporter;
