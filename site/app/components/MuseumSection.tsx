import MuseumCarousel from "./MuseumCarousel";

const PHOTOS = [
  "/api/drive-image?id=17BHab8cPQFn7xGyEa_EbNdN_sb4fa_Xj&w=800",
  "/api/drive-image?id=1Q8TUFSdoFD9DoLjHx0J8XMhXwY3VfDO7&w=800",
  "/api/drive-image?id=1OOVFUAxA6pi2C8jvOQwAhwPzUk7q4g7V&w=800",
  "/api/drive-image?id=1wTI0_0pCDxY_gFtib5Yg1Smt8N3BtX4y&w=800",
  "/api/drive-image?id=1NBPXaytyJc38qD8r50msxZSfXGpevxcU&w=800",
  "/api/drive-image?id=1ryMIYeXb2y141C2SJwWHWdjFZXh8KZpw&w=800",
  "/api/drive-image?id=1STeoE-KkKEDUAH-iXMi1ji4Mx3bld13j&w=800",
  "/api/drive-image?id=1hTnWcAswalUHSqv1ejd1tTK_5m2aywYd&w=800",
  "/api/drive-image?id=1_ljJfCR98KnqI3zEKSTh6-I6UaP5Wd-y&w=800",
  "/api/drive-image?id=1eBz9aphNGMl5W7oJMOvSjS-eww1lsMzJ&w=800",
  "/api/drive-image?id=1fRjY91eU43n4QyuS9wGloRVioggXC9up&w=800",
];

// Desktop pede fotos maiores (galeria quase full-width) — mesmos IDs, só
// troca a largura pedida ao proxy (1200 já está em ALLOWED_WIDTHS, então
// não exige nenhuma mudança em app/api/drive-image/route.ts).
const PHOTOS_DESKTOP = PHOTOS.map((url) => url.replace("w=800", "w=1200"));

export default function MuseumSection() {
  return (
    <section id="museu" className="mx-auto w-full px-6 py-24 sm:py-32">
      <MuseumCarousel photosMobile={PHOTOS} photosDesktop={PHOTOS_DESKTOP} />
    </section>
  );
}
