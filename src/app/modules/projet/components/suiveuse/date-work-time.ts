import { Work, Recup, Travel } from '@projet/repository/project.interface';

export class DateWorkTime {
  date: Date; 
  works: Work[] = [];
  travels: Travel[] = [];


  constructor(date: Date) {
    this.date = date;
  }

  addWork(work: Work) {
    const idx = this.works.findIndex(e => e['@id'] === work['@id']);

    if (idx !== -1) {
      this.works[idx] = work;
    } else {
      this.works.push(work);
    }
  }

  addTravel(travel: Travel) {
    const idx = this.travels.findIndex(e => e['@id'] === travel['@id']);

    if (idx !== -1) {
      this.travels[idx] = travel;
    } else {
      this.travels.push(travel);
    }
  }

  get work_day() {
    return this.works
                  .filter(work => {return work.isWe === false && work.isNight === false})
                  .map(work => work.duration)
                  .reduce((a, b) => a + b, 0);
  }

  get work_we() {
    return this.works
                  .filter(work => work.isWe === true)
                  .map(work => work.duration)
                  .reduce((a, b) => a + b, 0);
  }

  get work_night() {
    return this.works
                  .filter(work => work.isWe === false && work.isNight === true)
                  .map(work => work.duration)
                  .reduce((a, b) => a + b, 0);
  }

  get workingTime() {
    return this.works
                  .map(work => work.duration * work.timeCoeff)
                  .reduce((a, b) => a + b, 0);
  }

  get travelTime() {
    return this.travels
                  .map(travel => travel.duration)
                  .reduce((a, b) => a + b, 0);
  }

  get totalTime() {
    return this.workingTime + this.travelTime;
  }

  get coeff_we() {
    return this.works
                  .filter(work => work.isWe === true)
                  .map(work => work.timeCoeff)[0];
  }

  get coeff_night() {
    return this.works
                  .filter(work => work.isWe === false && work.isNight === true)
                  .map(work => work.timeCoeff)[0];
  }

};