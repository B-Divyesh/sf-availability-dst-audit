# Availability DST Audit — visual thesis

## Direction

**Time Boundary Console** uses a pixel/demoscene language because this product is a test instrument: it inspects the invisible seam where civil time changes rules. The interface borrows the precision of a raster debugger, not the nostalgia of an arcade. A generated pixel-art timezone observatory establishes the world; crisp stepped borders, one-pixel grid lines, terse status labels, and tabular numerals carry that language into the working UI.

The product is intentionally single-mode and dark. It is used for concentrated inspection, and the near-black field makes green “expected” intervals and amber DST boundaries legible without turning the tool into a generic dashboard.

## Palette

All colors are encoded as CSS tokens.

- `ink-950` `#090d12`: page background, like an unlit terminal bezel.
- `ink-900` `#101720`: primary work surface.
- `ink-850` `#17212c`: raised controls and table headers.
- `paper` `#f4f5df`: primary text; warm rather than sterile white.
- `mist` `#adb9b7`: secondary text (7.5:1 on `ink-950`).
- `signal` `#8df0a6`: action and verified state; “clock signal” green.
- `signal-ink` `#06110a`: text on signal.
- `boundary` `#ffc857`: DST transition/warning amber.
- `danger` `#ff7a90`: invalid or missing local time.
- `scanline` `#243340`: rules and grid.
- `cyan` `#74d7ec`: comparison-zone detail.

Color is never the only status carrier: every state includes an icon/word and table flags.

## Type and scale

No runtime font requests. The display face is the local/system monospace stack (`ui-monospace`, `SFMono-Regular`, `Cascadia Code`, `Liberation Mono`) for the inspection-console voice and unambiguous tabular figures. Body copy uses the system humanist sans stack (`Inter` when installed, `Segoe UI`, `Roboto`, sans-serif) for sustained reading.

Scale: 12px micro labels, 14px metadata, 16px body/forms, 20px section title, fluid 38–68px hero title. Body leading is 1.55. Long copy is capped at 68 characters.

## Spacing and shape

Spacing follows a 4/8px base: 4, 8, 12, 16, 24, 32, 48, 64. Controls are at least 44px tall. Corners use 0–4px radii; clipped corners and one-pixel outlines preserve the pixel instrument character. Major panels use proximity and whitespace before borders.

Desktop uses a two-column setup bench (configuration / interpretation), then a full-width results matrix. At 390px everything stacks; decorative hero telemetry compresses, table results become horizontally scrollable, and export actions remain normal-flow rather than sticky.

## Interaction grammar

- The primary sequence is numbered: **01 Define hours → 02 Choose test window → Run audit**.
- Changes after a run mark results “out of date” until rerun; no hidden auto-computation.
- Weekdays contain explicit, repeatable window controls. Split days stay visually grouped, and empty days mean unavailable.
- Results expose three layers: verdict, boundary summary, then auditable daily rows.
- Focus is a two-pixel signal-green outline with offset. Buttons depress by 1px. Errors appear beside their cause and in an assertive live region.

## Motion policy

Only state change moves: result panels enter with a 180ms stepped opacity/translate transition, and buttons depress over 80ms. The hero illustration has no continuous animation. Under `prefers-reduced-motion: reduce`, all transforms and smooth scrolling are removed and state changes are instantaneous.

## Asset plan and provenance

### Hero illustration

- File family: `src/assets/time-boundary-observatory.{webp,png}` (optimized WebP used at runtime; PNG retained as source provenance).
- Use case: stylized-concept, explanatory landing-page hero.
- Prompt: “A wide pixel-art demoscene illustration of a timezone observatory at night: two precise digital clock towers on opposite sides of a glowing stepped world-time grid, a bright amber daylight-saving boundary slicing through the grid, small green schedule blocks remaining aligned across it, deep ink-black and navy background, warm ivory highlights, signal green, boundary amber and icy cyan accents, crisp 1990s 16-bit pixel clusters, ordered dithering, technical yet humane, no people, no interface screenshot. Wide composition, quiet negative space, no text, no numbers, no logos, no watermark.”
- Negative list: gradients that look like a SaaS hero, illegible glyphs, brands, people, photorealism, blurry antialiasing, fake UI copy.
- Model/tool: Factory Azure image deployment via `/opt/fleet/lib/gen-image.sh`.
- License/provenance: generated specifically for this product on 2026-08-27; original project asset, distributed under the repository MIT license. AI-generation is disclosed in the footer.

Authored UI icons are small inline SVGs made from geometric primitives and use `currentColor`; they are original project assets.

## Why this fits

DST failures are discontinuities hidden inside familiar calendar rows. The stepped raster boundary makes the discontinuity visible, while the console-like data surface supports proof, export, and careful review. It feels purpose-built for testing civil-time rules rather than like another booking product.
