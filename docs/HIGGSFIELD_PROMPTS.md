# Higgsfield asset prompts — Villa Ops Response System

All new photo/video assets for this site are generated via Higgsfield (standing
directive). This file holds the exact prompts so every shot matches the site's
"tropical editorial luxe" system on the first try.

**Palette to match:** warm charcoal/ink base `#161210`, ivory `#f4eee2`,
2700K amber `#d59a4a` / `#eec489`, terracotta `#9c4a25`. Dusk light only —
no midday blue skies, no neon, no purple.

**Hard rules for every asset:** no people's faces, no readable logos or brand
names, no text in frame, photorealistic (not illustration), 16:9 landscape.

---

## Photo pauses (slots already live on the page)

Drop each finished image into `assets/` with the exact filename, then add
inside the matching `.pause` div (before the `<p>`):
`<img src="assets/pause-N.jpg" alt="" loading="lazy" decoding="async">`
Parallax and the amber/ink overlay gradients activate automatically.

### `assets/pause-1.jpg` — after "The core mechanism"
Line on top of it: *"Inquiries don't keep office hours."*

> Luxury Bali villa at night seen from the garden, warm 2700K amber light
> glowing from inside through open shutters, private pool reflecting the lit
> villa, dark tropical foliage framing the edges, deep charcoal dusk sky,
> cinematic editorial photography, shallow depth, film grain, no people,
> 16:9.

### `assets/pause-2.jpg` — before "Proof & trust"
Line on top of it: *"Every answer starts from what you approved."*

> Close editorial still-life on a teak desk in a Bali villa office at dusk:
> an open linen-bound notebook and a ceramic cup, warm amber lamp glow from
> the left, terracotta wall softly out of focus behind, moody shadows,
> cinematic 2700K palette, film grain, no people, no readable text, 16:9.

### `assets/pause-3.jpg` — before the final CTA
Line on top of it: *"Yours to keep: the accounts, the documentation, the proof."*

> Wide dusk shot over Bali rice terraces toward a distant villa rooftop with
> a single warm light on, last amber band of sunset on the horizon, dark
> teal-charcoal sky above, palms in silhouette, calm and quiet mood,
> cinematic editorial landscape photography, film grain, no people, 16:9.

---

## Hero video replacement (pending)

Current `assets/hero.mp4` is 12MB (interaction-deferred, so it costs nothing
on load metrics — but a lighter loop is better for guests' data).

Target: **≤4MB, 8–12s seamless loop, 1920×1080, H.264, no audio.**

> Slow cinematic drift across a luxury Bali villa pool at dusk, warm 2700K
> amber light from the villa windows, gentle ripples reflecting the glow,
> palm silhouettes against a deep charcoal-amber sky, subtle film grain,
> seamless loop, no people, no text, 16:9.

Poster stays as-is (`assets/hero-poster.jpg` route in `index.html`); if the
new clip's first frame differs a lot, regenerate the poster from that frame.
