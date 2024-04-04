// Match the device top with pointer 0° degree. (By default 0° starts from the right of the device.)
export const getDegree = (magnetometer: any) => {
  return magnetometer - 90 >= 0 ? magnetometer - 90 : magnetometer + 271;
};