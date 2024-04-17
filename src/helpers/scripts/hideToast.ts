import Toast from 'react-native-root-toast';

export const hideToast = (toast: any) => {
  return setTimeout(() => {Toast.hide(toast);}, 3000);
}