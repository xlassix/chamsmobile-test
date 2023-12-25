import { createStore, persist } from 'easy-peasy';
// import { dataModel } from './sampleModel';
import { userModel } from './userModel';

export const stores = createStore({
  user: persist(userModel),
});
