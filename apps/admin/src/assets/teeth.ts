export interface Teeth {
  position: "top" | "bottom";
  items: TeethItem[];
}

export interface TeethItem {
  position: "left" | "right";
  values: Tooth[];
}

export interface Tooth {
  tooth: number;
  image: string;
}

const teeth: Teeth[] = [
  {
    position: "top",
    items: [
      {
        position: "left",
        values: [
          { tooth: 18, image: "/images/teeth/18.png" },
          { tooth: 17, image: "/images/teeth/17.png" },
          { tooth: 16, image: "/images/teeth/16.png" },
          { tooth: 15, image: "/images/teeth/15.png" },
          { tooth: 14, image: "/images/teeth/14.png" },
          { tooth: 13, image: "/images/teeth/13.png" },
          { tooth: 12, image: "/images/teeth/12.png" },
          { tooth: 11, image: "/images/teeth/11.png" },
        ],
      },
      {
        position: "right",
        values: [
          { tooth: 21, image: "/images/teeth/21.png" },
          { tooth: 22, image: "/images/teeth/22.png" },
          { tooth: 23, image: "/images/teeth/23.png" },
          { tooth: 24, image: "/images/teeth/24.png" },
          { tooth: 25, image: "/images/teeth/25.png" },
          { tooth: 26, image: "/images/teeth/26.png" },
          { tooth: 27, image: "/images/teeth/27.png" },
          { tooth: 28, image: "/images/teeth/28.png" },
        ],
      },
    ],
  },
  {
    position: "bottom",
    items: [
      {
        position: "left",
        values: [
          { tooth: 48, image: "/images/teeth/48.png" },
          { tooth: 47, image: "/images/teeth/47.png" },
          { tooth: 46, image: "/images/teeth/46.png" },
          { tooth: 45, image: "/images/teeth/45.png" },
          { tooth: 44, image: "/images/teeth/44.png" },
          { tooth: 43, image: "/images/teeth/43.png" },
          { tooth: 42, image: "/images/teeth/42.png" },
          { tooth: 41, image: "/images/teeth/41.png" },
        ],
      },
      {
        position: "right",
        values: [
          { tooth: 31, image: "/images/teeth/31.png" },
          { tooth: 32, image: "/images/teeth/32.png" },
          { tooth: 33, image: "/images/teeth/33.png" },
          { tooth: 34, image: "/images/teeth/34.png" },
          { tooth: 35, image: "/images/teeth/35.png" },
          { tooth: 36, image: "/images/teeth/36.png" },
          { tooth: 37, image: "/images/teeth/37.png" },
          { tooth: 38, image: "/images/teeth/38.png" },
        ],
      },
    ],
  },
];

export default teeth;
