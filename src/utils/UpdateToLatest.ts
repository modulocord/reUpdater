import { Worker } from "worker_threads";
import path from "path";
import crypto from "crypto";
import * as fs from "fs";

import moduleVersion from "../classes/details/moduleVersion.js";
import { SQLiteDB } from "../classes/database.js";
import errorMessage from "../classes/messages/errorMessage.js";
import hostVersion from "../classes/details/hostVersion.js";

function runThread(
  workerScriptPath: string | URL,
  workerData: {
    type: string;
    version: {
      host: {
        name: string;
        release_channel: any;
        platform: any;
        arch: string;
      };
      version: any;
    };
    from_version: any;
    package_sha256: any;
    url: any;
    root_path: any;
  },
  response_handler: (arg0: string) => void,
  request: any[],
) {
  return new Promise<void>((resolve, reject) => {
    const worker = new Worker(workerScriptPath, { workerData });

    worker.on("message", (message) => {
      console.log(JSON.stringify([request[0], { TaskProgress: message }]));
      response_handler(JSON.stringify([request[0], { TaskProgress: message }]));
      if (message.includes("Complete")) {
        resolve();
      }
    });

    worker.on("error", (error) => {
      reject(error);
    });

    worker.on("exit", (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
}

function folderExists(path: string, response_handler: any, request: any) {
  try {
    const stats = fs.statSync(path);

    if (stats.isDirectory()) {
      return true;
    } else {
      return false;
    }
  } catch (error: any) {
    if (error.code === "ENOENT") {
      return false;
    } else {
      response_handler(
        JSON.stringify([
          request[0],
          new errorMessage("Other", error, "Default").formatted(),
        ])
      );
      return "error";
    }
  }
}

async function UpdateToLatest(
  response_handler: any,
  request: any,
  {
    release_channel,
    platform,
    repository_url,
    root_path,
    db,
    arch,
    install_id = null,
  }: {
    release_channel: any;
    platform: any;
    repository_url: any;
    root_path: any;
    db: SQLiteDB;
    arch: any;
    install_id: any;
  },
  updateFinished: any
) {
  if (!(await install_id)) {
    install_id = crypto.randomUUID();
    try {
      await db.runQuery(`
          INSERT INTO key_values (key, value)
          VALUES ("install_id", '"${install_id}"')
        `);
      console.log('[Updater] Row "install_id" has been inserted successfully');
    } catch (error) {
      response_handler(
        JSON.stringify([
          request[0],
          new errorMessage("Other", error, "Default").formatted(),
        ])
      );
    }
  } else {
    install_id = await install_id;
  }

  const fetchedData = await fetch(
    `${repository_url}distributions/app/manifests/latest?install_id=${install_id}&channel=${release_channel}&platform=${platform}&arch=${arch}`
  );
  const response = await fetchedData.json();

  if (!updateFinished) {
    const workerScriptPath = path.join(
      __dirname,
      "..",
      "workers",
      "downloadAndInstall.js"
    );

    // Delta updates require one version up, but tbh downloading full versions seems enough for now

    /*

    let hostVersion;

    try {
      const result = await db.runQuery(
        `SELECT value FROM key_values WHERE key = "host/app/${release_channel}/${platform}/${arch}"`
      );
      hostVersion = JSON.parse(result[0].value)[0].host_version;
    } catch (error) {
      response_handler(
        JSON.stringify([
          request[0],
          new errorMessage("Other", error, "Default").formatted(),
        ])
      );
    }

    console.log(hostVersion)

    if (!hostVersion) {
      response_handler(
        JSON.stringify([
          request[0],
          new errorMessage("Other", "No hostVersion", "Default").formatted(),
        ])
      );
      return
    }

    */

    const newHostVersionDetails = new hostVersion(
      release_channel,
      platform,
      arch,
      response.full.host_version
    ).formatted();

    let tasks: [[any], [any]] = [
      [
        {
          type: "HostDownload",
          version: {
            ...newHostVersionDetails,
          },
          from_version: null,
          package_sha256: response.full.package_sha256,
          url: response.full.url,
        },
      ],
      [
        {
          type: "HostInstall",
          version: {
            ...newHostVersionDetails,
          },
          from_version: null,
          package_sha256: response.full.package_sha256,
          url: response.full.url,
        },
      ],
    ];

    for (const module of response.required_modules) {
      const moduleData = response.modules[module].full;
      tasks[0].push({
        type: "ModuleDownload",
        version: new moduleVersion(
          newHostVersionDetails,
          module,
          moduleData.module_version
        ).formatted(),
        from_version: null,
        package_sha256: moduleData.package_sha256,
        url: moduleData.url,
      });
      tasks[1].push({
        type: "ModuleInstall",
        version: new moduleVersion(
          newHostVersionDetails,
          module,
          moduleData.module_version
        ).formatted(),
        from_version: null,
        package_sha256: moduleData.package_sha256,
        url: moduleData.url,
      });
    }

    async function processTasks() {
      for (const task of tasks) {
        const taskPromises = task.map(
          (task: {
            type: string;
            version: {
              host: {
                name: string;
                release_channel: any;
                platform: any;
                arch: string;
              };
              version: any;
            };
            from_version: any;
            package_sha256: any;
            url: any;
          }) =>
            runThread(
              workerScriptPath,
              {...task, root_path: root_path},
              response_handler,
              request
            )
        );
        await Promise.all(taskPromises);
      }
    }

    const downloadFolder = `${root_path}\\download`;
    const incomingFolder = `${root_path}\\download\\incoming`;

    switch (folderExists(downloadFolder, response_handler, request)) {
      case false: {
        fs.mkdirSync(downloadFolder);
        fs.mkdirSync(incomingFolder);
        break;
      }
      case true: {
        fs.rmSync(downloadFolder, {force: true, recursive: true});
        fs.mkdirSync(downloadFolder);
        fs.mkdirSync(incomingFolder);
        break;
      }
      case 'error': {
        return
      }
    }

    try {
      await processTasks();
      response_handler(
        JSON.stringify([request[0], { ManifestInfo: { ...fetchedData } }])
      );
    } catch (error) {
      response_handler(
        JSON.stringify([
          request[0],
          new errorMessage("Other", error, "Default").formatted(),
        ])
      );
    }
  } else {
    response_handler(
      JSON.stringify([request[0], { ManifestInfo: { ...fetchedData } }])
    );
  }

  //db.close();
}

export = UpdateToLatest;
