export const houseImages = {
  1: require('@/assets/images/house-1.jpg'),
  2: require('@/assets/images/house-2.jpg'),
  3: require('@/assets/images/house-3.jpg'),
};

export const getHouseImage = (id: string) => {
  // Use the last character of the ID to determine the image (1, 2, or 3)
  const imageIndex = (parseInt(id.slice(-1)) % 3 + 1) as keyof typeof houseImages;
  return houseImages[imageIndex];
}; 