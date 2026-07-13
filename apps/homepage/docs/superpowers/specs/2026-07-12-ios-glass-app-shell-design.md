# Hongmin Li iOS Glass App Shell Design

**Date:** 2026-07-12

**Status:** Approved for direct implementation

**Supersedes:** The page-level hero-to-editorial transition in `2026-07-11-cinematic-research-portfolio-design.md`

## 1. Goal

Turn the existing cinematic research portfolio into a stable, single-screen web app rather than a conventional scrolling webpage.

The experience begins as a full-screen cinematic launch view. The cloud-island video plays once and remains on its final frame. The user's wheel, trackpad, or touch gesture then raises one continuous macOS/iOS-style glass surface from the bottom of the screen. All research content scrolls inside that surface while the browser viewport itself remains fixed.

## 2. Experience Contract

### 2.1 Launch state

- The viewport is exactly one visible app screen (`100dvh` with safe-area handling).
- The cloud-island media fills the stable background.
- The existing name, research statement, compact navigation, and call to action remain visible as the launch interface.
- The video uses `autoplay`, `muted`, and `playsinline`, but not `loop`.
- When playback ends, the video remains on its final frame. No replay, jump, cross-fade, or seek to the beginning is allowed.

### 2.2 Scroll transition

- The document body does not scroll.
- A full-viewport internal scroll container receives wheel, trackpad, keyboard, and touch scrolling.
- Its first screen is the interactive launch identity. The glass content surface starts immediately below that screen.
- As the internal container scrolls, the surface rises naturally from below the viewport. The motion comes from native scrolling rather than a scripted scroll animation.
- The old black-to-paper gradient band is removed.
- The hero text fades and lifts slightly as the glass surface approaches, preventing type from showing through the first translucent content block.

### 2.3 Glass app surface

- All content belongs to one continuous surface, not a wall of disconnected cards.
- The surface begins with large rounded top corners, a subtle grabber, a one-pixel light border, inner highlight, soft upward shadow, and warm off-white tint.
- The first content region is approximately 60% opaque with 24–28px backdrop blur and increased saturation.
- Opacity gradually increases through a static surface gradient to approximately 82% for long-form reading. The stopped cloud image remains perceptible throughout.
- On smaller or lower-power devices, blur is reduced and opacity is increased slightly for performance and legibility.
- If `backdrop-filter` is unavailable, the surface falls back to an approximately 94% opaque warm background.

### 2.4 App-style information architecture

- A compact sticky glass toolbar remains at the top of the internal app surface.
- The toolbar uses a restrained iOS-inspired capsule treatment and contains the H/L identity plus anchor navigation for Overview, Research, Papers, and Contact.
- Existing research content and verified profile data remain unchanged in substance.
- Sections are restyled as app views: compact titles, grouped records, inset rows, metadata chips, and clear touch targets.
- Editorial typography may remain for major research statements, but oversized webpage headlines and large empty page gaps are reduced.
- The current black contact block is converted into the same continuous glass app surface so it does not hide the cloud backdrop or reintroduce a webpage-style footer break.
- Internal anchor navigation scrolls the app container, not the browser document.

## 3. Component Boundaries

### `AppViewport`

Owns the stable `100dvh` application frame, locks document scrolling, and layers background, launch interface, and internal scroller.

### `HeroBackdrop`

Owns the fixed poster/video layer, responsive media policy, video failure fallback, and one-shot playback contract. It sits below the internal scroller and remains visible after the launch identity scrolls away.

### `Hero`

Owns only the interactive launch identity, statement, navigation, and call to action. It is the first screen inside the internal scroller, so its links remain directly clickable while wheel, keyboard, and touch input use the same native scroll surface.

### `GlassAppScroller`

Owns the launch screen, rising glass surface, scroll progress updates, internal navigation behavior, and app-surface accessibility label.

### `AppToolbar`

Provides the sticky iOS-style identity and section navigation inside the glass surface.

### Existing content components

`ResearchVision`, `ResearchAreas`, `SelectedWork`, `Publications`, `Recognition`, and `Contact` keep their data responsibilities. Their markup changes only where needed for the app grouping and navigation semantics; their factual content must not be rewritten as part of this visual change.

## 4. State and Data Flow

1. `useHeroMedia` tells `HeroBackdrop` whether the desktop video should load.
2. The backdrop video plays once. Native ended-state behavior preserves its final decoded frame.
3. `GlassAppScroller` receives native scroll input while the launch `Hero` remains its first interactive screen.
4. A request-animation-frame-throttled handler converts `scrollTop / viewportHeight` into a clamped launch progress value from 0 to 1.
5. The progress is written as a CSS custom property on the app viewport. CSS uses it to fade and translate the hero copy.
6. The content itself remains ordinary semantic HTML and does not rerender on every scroll frame.

## 5. Responsive and Accessibility Behavior

- Desktop and tablet use the full cinematic video when allowed by the current media gate.
- Narrow screens, reduced-motion users, and video failures use a static poster without downloading or displaying the video. The poster must match the video's final composition; regenerate it from the final frame if the current asset does not.
- Touch scrolling uses momentum scrolling and `overscroll-behavior` containment.
- The internal scroller is keyboard focusable, has an accessible label, and exposes visible focus styling.
- Navigation targets use `scroll-margin-top` to clear the sticky toolbar.
- Text and interactive elements must meet readable contrast against the most transparent supported glass state.
- Tap targets remain at least 44px where practical.
- Safe-area insets protect the toolbar and bottom content on iPhone hardware.

## 6. Failure and Performance Handling

- Video error: hide the failed video and retain the poster.
- Reduced motion: retain a static launch screen and disable nonessential fades while preserving native content scrolling.
- Missing blur support: switch to the warm opaque fallback without changing layout.
- Scroll work must be limited to one CSS custom-property write per animation frame; no React state update on every wheel event.
- Only one full-screen backdrop blur layer may be active. Nested content cards use translucent fills without additional expensive full-area blur.
- Existing media loading boundaries remain in place so mobile clients do not fetch the hero video.

## 7. Verification

### Automated

- Assert the hero video does not have the `loop` attribute and retains `autoplay`, `muted`, and `playsinline`.
- Assert the app viewport and internal labeled scroller render.
- Unit-test scroll-progress clamping at negative, zero, partial, full, and over-full positions.
- Assert navigation targets remain present and existing content tests continue to pass.
- Run the full unit test suite and production builds for both GitHub Pages and Sites.

### Browser

- Confirm the video reaches `ended === true` and remains at approximately its duration without restarting.
- Confirm the document scroll position remains zero while the internal app scroller changes.
- Confirm the glass surface rises from below the viewport and progresses visually from roughly 60% to 82% opacity.
- Confirm sticky toolbar navigation scrolls the internal surface to the expected sections.
- Check desktop Chrome/Safari-like rendering, a narrow mobile viewport, touch-sized targets, reduced motion, and poster fallback.
- Confirm no visible gray seam, horizontal overflow, layout jump, or console error.

## 8. Non-goals

- No native iOS application package.
- No fabricated phone status bar, fake system time, or novelty device frame.
- No content-management system, routing rewrite, or profile-data rewrite.
- No scroll-scrubbed video playback and no replay control.
- No separate glass card for every item.
