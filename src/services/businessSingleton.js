// BusinessDataSingleton.js
class BusinessDataSingleton {
  static instance = null;
  businessData = null;

  constructor() {
    if (BusinessDataSingleton.instance) {
      return BusinessDataSingleton.instance;
    }
    BusinessDataSingleton.instance = this;
  }

  setBusinessData(data) {
    this.businessData = data;
  }

  getBusinessData() {
    return this.businessData;
  }
}

export default new BusinessDataSingleton();
