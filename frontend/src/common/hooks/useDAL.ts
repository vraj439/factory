import { useEffect } from 'react';
import DAL from '../DAL';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';
const dal = new DAL(API_BASE_URL);

const useDal = (): DAL => {
  useEffect(() => {
    dal.setHeaders();
  }, []);

  return dal;
};

export default useDal;
