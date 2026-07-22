import { NextRequest } from "next/server";

// Imagens do site ficam no Google Drive (decisão do organizador). Servir o
// link do Drive direto no navegador é instável: sob limite de acesso o Drive
// responde HTML e o Chrome bloqueia (ORB). Esta rota proxia a imagem no
// servidor e deixa a CDN da Vercel cachear, então o Drive é consultado raro.
const ALLOWED_IDS = new Set([
  "1_hmb4Z2o-9wb54lkDmY4PJR5QUaqRm9w", // foto aérea da largada, colorida (não usada atualmente)
  "1tUn87JOijh6U-nnzwiCoGOaPxi9iytfw", // foto aérea da largada, P&B (fundo do hero)
  "1No2iKYxW_5C4XCkVbJza_XRpxwUnnbAc", // lettering "Corrida das Cheetaras"
  "19ISR32JWRHrT4u1u4P-Fhfyw71LEtoYQ", // camiseta do kit oficial 2026
  "1P0Z5S8son1FKHLjtUolab3v_rYfJGIEP", // troféu 2026
  "1D_YfWTZWyAdSzIEFK8Jps0u6OiJuvkoW", // medalha 2026
  "17BHab8cPQFn7xGyEa_EbNdN_sb4fa_Xj", // museu cheetaras — foto 1
  "1NbSpLvCx1CRXEqPJOxVuf8PoAPcAqwQK", // museu cheetaras — foto 2
  "1Q8TUFSdoFD9DoLjHx0J8XMhXwY3VfDO7", // museu cheetaras — foto 3
  "1OOVFUAxA6pi2C8jvOQwAhwPzUk7q4g7V", // museu cheetaras — foto 4
  "1lTcDUy1ySWuWd9Kz5UrjAOtDuW2q1PJE", // museu cheetaras — foto 5
  "1wTI0_0pCDxY_gFtib5Yg1Smt8N3BtX4y", // museu cheetaras — foto 6
  "1iQJr1iNY857BgnCsJEaF7w48OVpIz-fG", // fundo do hero desktop, foto da corrida
  "1ZI1NzWXc09eyG-BhC6xhsMCPH9stvqUz", // fundo do hero mobile, foto da corrida
]);

const ALLOWED_WIDTHS = new Set(["800", "1200", "1920"]);

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id") ?? "";
  const w = request.nextUrl.searchParams.get("w") ?? "1920";
  if (!ALLOWED_IDS.has(id) || !ALLOWED_WIDTHS.has(w)) {
    return new Response("Not found", { status: 404 });
  }

  const upstream = await fetch(
    `https://drive.google.com/thumbnail?id=${id}&sz=w${w}`,
    { redirect: "follow" }
  );
  const contentType = upstream.headers.get("content-type") ?? "";
  if (!upstream.ok || !contentType.startsWith("image/")) {
    return new Response("Upstream error", { status: 502 });
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control":
        "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
