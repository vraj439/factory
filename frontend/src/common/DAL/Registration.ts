export default class Registration {
  dal: any;

  constructor(dal: any) {
    this.dal = dal;
  }

  registerSupplier = async (registrationObj: any) => {
    const response = await this.dal.post(
      'api/supplier/signup',
      registrationObj
    );
    return response.data;
  };

  registerCostumer = async (registrationObj: any) => {
    const response = await this.dal.post(
      'api/consumer/signup',
      registrationObj
    );
    return response.data;
  };
}
