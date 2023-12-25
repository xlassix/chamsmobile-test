import axios from 'axios';

const chamsMobileAPI = axios.create({
  baseURL: process.env.CHAMSMOBIILE_API,
  headers: {
    Authorization: `Bearer ${process.env.CHAMSMOBIILE_ORG_KEY}`,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
    'Content-Type': 'application/json',
  },
});

export default chamsMobileAPI;
