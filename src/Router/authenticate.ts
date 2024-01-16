import { useUserStore } from '../Stores/User/user.store';

export const authenticate = async () => {
  const user = await useUserStore().authenticate();

  if (!user) {
    // alert('auth failed!');
  }
};
