const fs = require('fs');
const { isDuringWorkingHours } = require('./lib/utils');

//if db folder does not exist, ensure to create it before loading anything else
if (!fs.existsSync('./db')) {
  fs.mkdirSync('./db');
}

const path = './lib/provider';
const provider = fs.readdirSync(path).filter((file) => file.endsWith('.js'));
const config = require('./conf/config.json');

const jobStorage = require('./lib/services/storage/jobStorage');
const { setLastJobExecution } = require('./lib/services/storage/listingsStorage');
const FredyRuntime = require('./lib/FredyRuntime');

//starting the api service
require('./lib/api/api');

//assuming interval is always in minutes
const INTERVAL = config.interval * 60 * 1000;

/* eslint-disable no-console */
console.log(`Started Fredy successfully. Ui can be accessed via http://localhost:${config.port}`);
/* eslint-enable no-console */
setInterval(
  (function exec() {
    config.lastRun = Date.now();
    jobStorage
      .getJobs()
      .filter((job) => job.enabled && isDuringWorkingHours(job))
      .forEach((job) => {
        const providerIds = job.provider.map((provider) => provider.id);

        provider
          .filter((provider) => provider.endsWith('.js'))
          .map((pro) => require(`${path}/${pro}`))
          .filter((provider) => providerIds.indexOf(provider.metaInformation.id) !== -1)
          .forEach(async (pro) => {
            const providerId = pro.metaInformation.id;
            if (providerId == null || providerId.length === 0) {
              throw new Error('Provider id must not be empty. => ' + pro);
            }
            const providerConfig = job.provider.find((jobProvider) => jobProvider.id === providerId);
            if (providerConfig == null) {
              throw new Error(`Provider Config for provider with id ${providerId} not found.`);
            }
            pro.init(providerConfig, job.blacklist);
            await new FredyRuntime(pro.config, job.notificationAdapter, providerId, job.id).execute();
            setLastJobExecution(job.id);
          });
      });
    return exec;
  })(),
  INTERVAL
);
