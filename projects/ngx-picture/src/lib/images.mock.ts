const IMAGES = ['components', 'augury', 'animations', 'cli', 'compiler'];
const sizes = ['xs', 'sm', 'md', 'lg', 'xl'];
const widths = [200, 300, 400, 500, 600];

export function createImages(numImages: number = 20): any[] {
  const images = [];
  let i = 0;
  while (i < numImages) {
    const data = {};

    for (let index = 0; index < sizes.length; index++) {
      const size = sizes[index];
      data[size] = {
        url: `https://angular.io/generated/images/marketing/concept-icons/${
          IMAGES[index]
        }.svg`,
        width: widths[index]
      };
    }
    images.push(data);
    i++;
  }

  return images;
}
