import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { Tasks } from '../api/tasks.js';

Meteor.startup(() => {

  if (!Tasks.find({}).count()) {
    console.log('Filling collection with documents...');
    const numberOfRecordsToInsert = 50000;
    for(var i = 0; i < numberOfRecordsToInsert; i++) {
      if (i !== 0 && i % 1000 === 0) {
        console.log(`${((i/numberOfRecordsToInsert)*100).toFixed(1)}% complete...`)
      }
      Tasks.insert({});
    }
    console.log('Collection initialized');
  }

  console.log('Finding and iterating all tasks to show cursor not found error...');

  const sleepPerTaskMs = 50;
  const totalNumberOfRecords = Tasks.find({}).count();
  let numberOfRecordsRead = 0;

  try {
    Tasks.find({}).forEach(function(task) {
      Meteor._sleepForMs(sleepPerTaskMs);
      numberOfRecordsRead += 1;

      if (numberOfRecordsRead % 100 === 0) {
        console.log(`${(numberOfRecordsRead*100/totalNumberOfRecords).toFixed(1)}% of tasks processed...`);
      }
    });
  } catch (e) {
    console.log(`Experienced error after reading ${numberOfRecordsRead} records!`);
    throw e;
  }

  console.log('All records read successfully... try running this again.');
});
