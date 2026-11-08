import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

/*
 * saveUrl()
 *
 * 새 URL 매핑을 저장합니다.
 * 같은 short_code 또는 같은 original_url이 이미 있으면
 * 오류를 내지 않고 저장을 건너뜁니다(ON CONFLICT DO NOTHING).
 *
 * 반환값: 새로 저장했으면 true, 이미 있어서 건너뛰었으면 false
 */
export async function saveUrl(shortCode, originalUrl) {
  const rows = await sql`
    INSERT INTO urls (short_code, original_url)
    VALUES (${shortCode}, ${originalUrl})
    ON CONFLICT DO NOTHING
    RETURNING short_code
  `;

  return rows.length > 0;
}

// shortCode로 원본 URL을 찾습니다.
export async function findUrlByShortCode(shortCode) {
  const rows = await sql`
    SELECT original_url
    FROM urls
    WHERE short_code = ${shortCode}
    LIMIT 1
  `;

  return rows[0]?.original_url ?? null;
}

// 원본 URL로 이미 저장된 shortCode를 찾습니다. (중복 처리)
export async function findShortCodeByOriginalUrl(originalUrl) {
  const rows = await sql`
    SELECT short_code
    FROM urls
    WHERE original_url = ${originalUrl}
    LIMIT 1
  `;

  return rows[0]?.short_code ?? null;
}
