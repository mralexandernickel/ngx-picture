const placeimgCategories = ['animals', 'arch', 'nature', 'people', 'tech'];
const svgImages = ['components', 'augury', 'animations', 'cli', 'compiler'];
const sizes = ['xs', 'sm', 'md', 'lg', 'xl'];
const widths = [200, 300, 400, 500, 600];

export function getRandomArrayItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function generateSvgUrl(image: string): string {
  return `https://angular.io/generated/images/marketing/concept-icons/${image}.svg`;
}

export function generatePlaceimgUrl(
  width: number,
  height: number,
  category: string
): string {
  return `https://placeimg.com/${width}/${height}/${category}`;
}

export function calculateHeight(width: number, ratio: string = '4:3'): number {
  return Math.round(width * 0.75);
}

export function createImages(numImages: number = 20): any[] {
  const images = [];
  let i = 0;
  while (i < numImages) {
    const data = {};

    for (let index = 0; index < sizes.length; index++) {
      const size = sizes[index];
      const width = widths[index];
      const placeimgCategory = getRandomArrayItem(placeimgCategories);
      const svgImage = svgImages[index];
      data[size] = {
        hiRes: {
          src: generatePlaceimgUrl(
            width,
            calculateHeight(width),
            placeimgCategory
          )
        },
        lowRes: {
          src: generateSvgUrl(svgImage),
          width: width
        }
      };
    }
    images.push(data);
    i++;
  }

  return images;
}
