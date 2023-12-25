import { action, computed, thunk, Computed, Action, Thunk } from 'easy-peasy';
import { login } from '../shared/api';

export interface UserModel {
  data: any;
  isLoading: boolean;
  isAuthenticated: boolean;
  loginError: string[];
  setIsAuthenticated: Action<UserModel, boolean>;
  setLoading: Action<UserModel, boolean>;
  loginFailed: Action<UserModel, string[]>;
  performLogin: Thunk<UserModel, any>;
  saveLoginData: Action<UserModel, any>;
  performLogout: Action<UserModel>;
  logout: Thunk<UserModel>;
}

export const userModel: UserModel = {
  data: {},
  loginError: [],
  isLoading: false,
  isAuthenticated: false,
  saveLoginData: action((state: any, data) => {
    state.data = data;
    state.lastPing = Date.now();
  }),
  setIsAuthenticated: action((state: any, data) => {
    state.isAuthenticated = data;
  }),
  setLoading: action((state: any, data: boolean) => {
    state.isLoading = data;
  }),
  loginFailed: action((state: any, data) => {
    state.loginError = data;
  }),
  performLogin: thunk(async (actions, payload) => {
    actions.setLoading(true);
    try {
      const response = await login(payload);
      actions.setLoading(false);
      if (response?.data?.StatusCode !== 200) {
        return [response?.data?.Message];
      } else if (response?.data?.StatusCode === 200) {
        const data = response?.data?.data;
        actions.saveLoginData(data);
        actions.loginFailed([]);
      }
    } catch (err) {
      console.log(err);
      actions.setLoading(false);
      return ['Something went wrong, try again.'];
    }
  }),

  performLogout: action((state: any) => {
    state.data = {};
    state.loginError = [];
    state.isAuthenticated = false;
    state.selectedWarehouse = {};
    state.lastPing = 0;
  }),
  logout: thunk(async (actions, payload, helpers) => {
    sessionStorage.removeItem('token');
    actions.performLogout();
  }),
};
