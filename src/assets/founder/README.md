# Founder photos

Drop files here with these exact base names (.png, .jpg, .jpeg or .webp). Each
placement appears on its own when its file exists; no layout changes needed.

| File | Orientation | Appears on |
| --- | --- | --- |
| `founder-portrait` | portrait 3:4 | `/about` hero, beside the intro |
| `founder-office` | landscape 3:2 | Homepage "Who you work with" band |
| `founder-desk` | landscape 3:2 | `/about` story section (video poster; only used with the video) |
| `founder-client` | landscape 3:2 | `/about` final section, beside the call to action |
| `founder-phone` | portrait 3:4 | `/contact`, small photo with the line "Your message comes to Brent, not a ticket queue." |

Video: the `/about` story loop needs both `founder-desk` and
`public/video/founder/founder-desk-broll.mp4`. Files in `public/` cannot be
detected automatically, so after adding the mp4 set
`FOUNDER_DESK_VIDEO_AVAILABLE = true` in `src/components/founder/founder-assets.ts`.
