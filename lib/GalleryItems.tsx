export type MediaType = "image" | "video";

export type GalleryItem = {
  id: string;
  src: string;
  no: string;
  title: string;
  meta: string;

  // Media kind. Defaults to "image" if omitted, unless the src's
  // extension looks like a video file (mp4/webm/mov/m4v/ogg).
  type?: MediaType;

  // Optional poster frame shown before a video plays / while it loads.
  poster?: string;

  // Desktop
  col: number;
  row: number;

  // Mobile (unused now that mobile is forced to single column,
  // kept for reference / possible future use)
  mobileCol?: number;
  mobileRow?: number;
};

const VIDEO_EXTENSIONS = /\.(mp4|webm|mov|m4v|ogg)$/i;

export function getMediaType(item: GalleryItem): MediaType {
  if (item.type) return item.type;
  return VIDEO_EXTENSIONS.test(item.src) ? "video" : "image";
}

export const galleryItems: GalleryItem[] = [
  {
    id: "01",
    src: "/4.jpg",
    no: "01",
    title: "Haditehrani, Office",
    meta: "Pune, 2023",
    col: 4,
    row: 2,
    mobileCol: 2,
    mobileRow: 2,
  },
  {
    id: "02",
    src: "/2.jpg",
    no: "02",
    title: "Courtyard House",
    meta: "Pune, 2022",
    col: 2,
    row: 1,
    mobileCol: 1,
    mobileRow: 1,
  },
  {
    id: "03",
    src: "/3.jpg",
    no: "03",
    title: "Garden Residence",
    meta: "Pune, 2022",
    col: 2,
    row: 1,
    mobileCol: 1,
    mobileRow: 1,
  },
  {
    id: "04",
    src: "/vid1.mp4",
    type: "video",
    poster: "/1.jpg",
    no: "04",
    title: "Coastal Pavilion",
    meta: "Åland, 2021",
    col: 6,
    row: 1,
    mobileCol: 2,
    mobileRow: 1,
  },
  {
    id: "05",
    src: "/5.jpg",
    no: "05",
    title: "Forest Retreat",
    meta: "Sarek, 2023",
    col: 3,
    row: 1,
    mobileCol: 1,
    mobileRow: 2,
  },
  {
    id: "06",
    src: "/6.jpg",
    no: "06",
    title: "Stone House",
    meta: "Öland, 2020",
    col: 3,
    row: 1,
    mobileCol: 1,
    mobileRow: 1,
  },
  {
    id: "07",
    src: "/7.jpg",
    no: "07",
    title: "Timber Pavilion",
    meta: "Öland, 2020",
    col: 3,
    row: 1,
    mobileCol: 1,
    mobileRow: 1,
  },
  {
    id: "08",
    src: "/8.jpg",
    no: "08",
    title: "Pine Facade",
    meta: "Halland, 2019",
    col: 3,
    row: 1,
    mobileCol: 1,
    mobileRow: 2,
  },
  {
    id: "09",
    src: "/1.jpg",
    no: "09",
    title: "Reflection House",
    meta: "Malmö, 2024",
    col: 6,
    row: 2,
    mobileCol: 2,
    mobileRow: 2,
  },
  {
    id: "10",
    src: "/2.jpg",
    no: "10",
    title: "Brick Residence",
    meta: "Skåne, 2023",
    col: 3,
    row: 1,
    mobileCol: 1,
    mobileRow: 1,
  },
  {
    id: "11",
    src: "/3.jpg",
    no: "11",
    title: "Lake House",
    meta: "Uppsala, 2022",
    col: 3,
    row: 1,
    mobileCol: 2,
    mobileRow: 2,
  },
  {
    id: "12",
    src: "/4.jpg",
    no: "12",
    title: "Boat Jetty",
    meta: "Archipelago, 2021",
    col: 2,
    row: 1,
    mobileCol: 1,
    mobileRow: 1,
  },
  {
    id: "13",
    src: "/5.jpg",
    no: "13",
    title: "Reef Pavilion",
    meta: "Coastal Site, 2024",
    col: 3,
    row: 1,
    mobileCol: 1,
    mobileRow: 1,
  },
  {
    id: "14",
    src: "/6.jpg",
    no: "14",
    title: "Pine Residence",
    meta: "Värmland, 2022",
    col: 3,
    row: 2,
    mobileCol: 1,
    mobileRow: 2,
  },
  {
    id: "15",
    src: "/1.jpg",
    no: "15",
    title: "Reflection House",
    meta: "Lake Site, 2020",
    col: 6,
    row: 1,
    mobileCol: 2,
    mobileRow: 1,
  },
  {
    id: "16",
    src: "/2.jpg",
    no: "16",
    title: "Covered Porch",
    meta: "Dalarna, 2023",
    col: 3,
    row: 2,
    mobileCol: 1,
    mobileRow: 2,
  },
];