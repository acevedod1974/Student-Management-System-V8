import fs from "fs";
import path from "path";

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

    const jsonString = JSON.stringify(logData, this.circularReplacer(), 2);
    fs.writeFileSync(logFilePath, jsonString);
    console.log(`Test results saved to ${logFilePath}`);
  }

  circularReplacer() {
    const seen = new WeakSet();
    return (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      return value;
    };
  }
}

export default CustomReporter;
