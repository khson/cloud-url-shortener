import { findUrlByShortCode } from "../../lib/db";
import { recordClick } from "../../lib/stats";

export async function GET(request, { params }) {
  const { shortCode } = await params;

  const originalUrl = await findUrlByShortCode(shortCode);

  // 존재하지 않는 shortCode → 404 + 운영 로그
  if (!originalUrl) {
    console.warn("Short URL not found", { shortCode });
    return new Response("Not Found", {
      status: 404,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  }

  // 원본 URL을 찾은 경우에만 클릭 기록
  // 기록에 실패해도 Redirect는 계속합니다.
  try {
    await recordClick(shortCode);
  } catch (error) {
    console.error("Failed to record click", { shortCode });
  }

  return new Response(null, {
    status: 307,
    headers: {
      Location: originalUrl,
      "Cache-Control": "no-store",
    },
  });
}
