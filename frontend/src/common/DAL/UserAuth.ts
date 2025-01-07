import { UserRole } from '../../types/enums';

export default class UserAuth {
  dal: any;

  constructor(dal: any) {
    this.dal = dal;
  }

  checkStatus = async (userRole: UserRole) => {
    const response = await this.dal.get(`api/${userRole}/check-status`);
    return response.data;
  };

  logout = async (userRole: UserRole) => {
    const response = await this.dal.post(`api/${userRole}/logout`);
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_type');
    return response.data;
  };

  login = async (userCreds: { email: string, password: string }, role: UserRole) => {
    const response = await this.dal.post(`api/${role}/login`, userCreds);
    return response.data;
  };
}
