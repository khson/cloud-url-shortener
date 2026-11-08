# Cloud URL Shortener

Next.js + Neon Postgres 로 만든 URL Shortener.

- `POST /api/shorten` — URL 단축 (새로 만들면 201, 이미 있으면 기존 shortCode를 200으로 반환, 자기 서비스 URL은 400)
- `GET /{shortCode}` — 307 Redirect (`Cache-Control: no-store`), 없으면 404
- `/admin`, `/api/stats` — Basic 인증 (`admin` / `ADMIN_PASSWORD`)

## 환경변수

`DATABASE_URL` (Neon pooled), `ADMIN_PASSWORD` — `.env.local` 과 Vercel 프로젝트 설정에 둔다. 커밋하지 않는다.

## DB 스키마

```sql
CREATE TABLE IF NOT EXISTS urls (
  short_code VARCHAR(6) PRIMARY KEY,
  original_url VARCHAR(2048) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  click_count BIGINT NOT NULL DEFAULT 0,
  last_clicked_at TIMESTAMPTZ
);
```
