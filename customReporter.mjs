import fs from "fs";
import path from "path";

class CustomReporter {
  onInit(context) {
    this.context = context;
  }

  onFinished(results) {
    console.log("Results:", results); // Add this line to inspect the results object

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const logFileName = `test-results-${timestamp}.log`;
    const logDir = path.join(__dirname, "logs");
    const logFilePath = path.join(logDir, logFileName);

    // Create the logs directory if it doesn't exist
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir);
    }

    const logData = results.flatMap((result) => {
      return result.tasks.map((task) => ({
        file: result.filepath,
        name: task.name,
        status: task.result?.state,
        duration: task.result?.duration,
        error: task.result?.error ? task.result.error.message : null,
      }));
    });

    const logString = logData
      .map((result) => {
        return `
Test File: ${result.file}
Test Name: ${result.name}
Status: ${result.status}
Duration: ${result.duration}ms
${result.error ? `Error: ${result.error}` : ""}
      `.trim();
      })
      .join("\n\n");

    fs.writeFileSync(logFilePath, logString);
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
