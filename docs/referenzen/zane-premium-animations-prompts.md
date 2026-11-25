# Zane Hoyer: «Premium Animations» (Original-Prompts, unverändert)

Quelle: Google Doc «Premium Animations Zane Hoyer» (https://docs.google.com/document/d/1HmqYlYnAoW2mLAmz779YwM4K91ZQjF0Vh2UhfOi7KpM), gesichert am 25.11.2026.
Der Text unterhalb der Linie ist 1:1 aus dem Dokument übernommen (Original, englisch). Was davon in unseren Ablauf eingeflossen ist, steht im Skill `reel-produktion` (Abschnitt «Aus Zanes Prompts übernommen»).

---

Premium Animations Zane Hoyer

3D products Animation

ROLE

You are a senior motion designer, 3D artist and creative technologist. Turn my attached reference images into a premium, "$1M launch film" quality software ad: real 3D objects, glass UI, bouncy interactions, all rendered in code.

[FILL IN] Brand / product: auto   (auto = invent an original fictional brand; never use real brands, logos or trademarks)

[FILL IN] Length & format: ~30 s, 3840x2160, 30 fps, H.264 MP4

[FILL IN] Theme / story: auto   (auto = choose one that fits the references)

=== PHASE 1: ANALYZE (no code yet) ===

Study every reference and write a short style bible:

- palettes (hex), lighting (soft studio light, softbox highlights, rim light)

- materials (matte titanium, frosted glass, glossy ceramic, iridescent pearl, liquid chrome)

- camera language (tilted 3/4 angles, floating objects, soft contact shadows)

- typography (one grotesk family, tight tracking at display sizes)

- composition patterns (floating devices, glass chips and pills, cards fanned in depth, huge background type)

- what specifically makes each reference feel expensive

Then plan a 6-scene story that uses the strongest idea from each reference. Design ONE original logo mark (a simple geometric 3D form) that recurs across scenes. Invent all names, UI copy and content; never copy text, logos or characters from the references.

=== PHASE 2: STORYBOARD (stop for approval) ===

Render six key frames at full 3840x2160, one per scene, at the moment with the most on screen. Inspect every frame yourself at full size, including detail crops, and fix problems before sending: clipping, blown highlights, washed-out color, overlapping text, objects too big or too small, stray template text. Send the six frames plus a labeled contact sheet with one line per scene, then WAIT for my approval. If you cannot reach this quality, tell me which external assets would help.

=== PHASE 3: ANIMATE (only after I approve) ===

Spend most of your effort here. Nothing may simply slide in. Write a beat sheet with timings for every scene before coding it.

Motion language (time-based and deterministic):

- Springs instead of linear tweens. Closed-form damped spring: x(t) = 1 - e^(-z*w*t) * (cos(wd*t) + (z*w/wd) * sin(wd*t)). Heavy objects: f 0.9-1.2 Hz, damping 0.55-0.8. UI pops: f 2.0-2.6 Hz, damping 0.38-0.5 (visible overshoot).

- Pop-in: scale from 0.3-0.6 with spring overshoot, opacity in over 0.2 s, blur 10 px to 0, plus a small settling rotation or offset.

- Text: split into words or characters; each rises 0.4-0.6 em, fades in and un-blurs from 8-22 px, ease-out-expo ~0.9 s, stagger 30-90 ms. Exits reverse with blur.

- Notifications and toasts drop in on a bouncy spring, the icon pops a beat later, the lines cascade in. Give the device a tiny haptic wiggle when one arrives.

- At least one simulated touch per scene: a translucent touch circle appears, presses (squish), emits a ripple ring, and the UI visibly responds (button squish + state morph, toggle flips, swatch recolors the product, heart fills with a particle burst, card swipes away, widget opens like an app).

- Live UI: counters count up, progress bars fill with a moving shine, EQ bars and waveforms move, ECG lines scroll, timers tick.

- Nothing is ever dead: idle drift on every object (sum of slow sines), a slow camera push or orbit, marquee background type, breathing glows, animated film grain (offset the grain texture every frame).

- Real motion blur on 3D: render several shutter samples per frame (180-degree shutter) and average them. Pick the sample count from on-screen speed: 1 pass when slow, up to 6-7 when fast.

- Scenes run 5-6.5 s. Transitions are designed match cuts, never plain crossfades between unrelated shots. Proven examples: an iris reveal through the hole of a ring flying through the camera (alpha cut-out composite); a push into a phone screen whose app-opening panel matches the next scene's background; a whip pan with horizontal directional blur peaking at the cut; a tap ripple that floods to black into a dark scene; a bloom to white into a bright finale.

=== TECHNICAL APPROACH (proven, follow it) ===

- Build each scene as an HTML page: HTML/CSS for UI, text and glass; a WebGL2 canvas for 3D. Render it in headless Chrome via Playwright at 1920x1080 CSS with deviceScaleFactor 2 (= 4K). Expose window.SCENE.frame(t) that sets every style and 3D transform purely from time t, so any frame renders exactly. Serve files from a local HTTP server (file:// breaks WebGL textures).

- For animation, write a small WebGL2 triangle rasterizer, not a raymarcher (software raymarching is ~10x too slow for ~1000 frames; it is fine for stills). Mesh generators: rounded slab (rounded-rect outline swept with a rounded edge profile: phones, glass tiles, cards), torus and torus arc, sphere, lathe (cylinders, ear cups, lenses, capsules).

- Shade with an analytic studio environment: sky/ground gradient plus 2-3 rectangular softboxes (key, strip fill, rim) used for diffuse light and Fresnel reflections; roughness widens the softbox edges; add a clear-coat layer; iridescence = cosine palette driven by view angle; glass = refraction into an analytic background color plus bright edges. Use 4x MSAA.

- Phone screens and widget faces: design each screen as its own HTML page with setT(t), screenshot it every frame and upload it as a texture (emissive, under a glass reflection layer). Phone model: titanium frame, curved black glass edge, bezel, dynamic island drawn in the UI, camera plateau with lenses, polished logo on frosted back glass.

- Contact shadows: blurred radial-gradient divs under objects, scaled and faded with object height.

- Pitfalls to avoid: software GL executes every branch of an uber-shader, so compile one program per material; triangle fans are very slow, so triangulate faces as grids; stacked CSS 3D layers (preserve-3d plus backdrop-filter) tear and z-fight, so never build 3D objects from CSS layers; when a canvas changes size, convert focal length correctly (it is relative to image height); text-splitting helpers must not destroy child elements you still reference.

- Art inside screens (wallpapers, cover art) can be raymarched once per page load.

=== QUALITY CONTROL ===

- Before any full render, render every scene at 1/4 resolution sampling every ~0.4 s, build contact sheets, and review timing, framing and transitions. Fix and re-check.

- Spot-check full-resolution crops for edges, text crispness and materials.

- Render scenes to JPEG frames (PNG with alpha only where a transition needs it). Assemble in ONE pass: composite transitions in numpy/OpenCV and pipe raw frames to ffmpeg (libx264, -preset medium, -crf 15, yuv420p, +faststart, 30 fps). Write to a temp name and rename on success.

- Verify the final file with ffprobe and sample frames around every transition.

=== DELIVERABLES ===

1. Phase 2: six 4K storyboard frames + a labeled contact sheet, then wait for my approval.

2. Phase 3: the final 3840x2160 30 fps MP4, a 1080p preview copy, and a short beat-by-beat summary of the motion and transitions.

Keep messages short: show results, not process. Tell me up front roughly how long rendering will take.

3D SAAS Green Animation

Create a 4K (3840×2160), 30 fps motion graphics promo video for a software product called [PRODUCT NAME]. [One line on what it does, e.g. "an AI that sorts out your life, creates personal challenges, searches the web for you, and has live globe features."]

I've attached reference images. Study them first and pull out the palette, typography, materials, lighting and layout. Then design an original piece in that spirit.

LOOK

- Near-black background tinted with one brand colour (e.g. #2EF28B neon green), a pale highlight tint, and colour used sparingly.

- Real 3D objects that are actually rendered with lighting, not flat icons: a glass orb with a glowing neural network inside, a dotted-continent globe with a bright atmospheric edge, a glossy 3D star on a glowing pedestal, thin orbit rings with light travelling along them.

- Frosted-glass UI cards and chips with bright edges and slight thickness, neon light cables, soft bloom, subtle film grain, drifting particles.

- Clean modern fonts: a large display sans for headlines (silver gradient with the accent colour on key words), a crisp UI sans for labels, and a wordmark of light weight plus bold weight in the accent colour.

- Minimal and centred: the 3D object is the hero of every scene, with one short headline at most. No paragraphs, no clutter.

STORYBOARD (about 44 s, six scenes)

1. Ignition: a neon line draws itself in and hits a glass core. The core flashes, its neural network lights up node by node, orbit rings spring into place, HUD numbers count up, and the camera pushes through the core.

2. Hero: a dotted globe rises from below and spins. The product name assembles letter by letter, gliding up out of a blur. City-to-city arcs draw across the globe. Feature chips pop in with a spring bounce. A cursor clicks the call-to-action button.

3. Feature 1: task cards pop in out of order, then physically re-sort themselves. The cursor ticks one and it flips to the accent colour with a check.

4. Feature 2: a 3D star drops in spinning, bounces onto a pedestal, and a progress ring fills, then ticks up with a spark burst.

5. Feature 3: a search query types itself into a glass search bar over the globe. On click, light beams fly from the globe to result chips that pop in as each beam arrives.

6. Outro: a planet horizon rises, the core rises over it like a sun, the wordmark assembles, call-to-action buttons pop in, the cursor clicks, and everything fades to black.

MOTION RULES

- Something is always moving, but nothing is frantic. Use eased curves only, never linear motion.

- Text glides up out of a blur, staggered word by word or letter by letter.

- Widgets pop in with damped-spring overshoot, then float gently.

- The camera always slowly drifts or orbits so the 3D objects show real depth.

- The cursor moves in curved, eased paths. The interface reacts with hover lifts, press-in, ripples and state changes, so it feels interactive.

- Transitions push forward: the camera zooms into one scene with blur, and the next resolves out of it.

PROCESS

1. Break down my references and write the storyboard.

2. Render six full-resolution 4K style frames, one per scene, and stop for my approval before animating.

3. After I approve, animate. Before the full render, check full-size frames at the busiest moments.

4. Render each scene to its own video file, join them losslessly, and give me the 4K master plus a 1080p preview.

TECHNICAL NOTES (if you're rendering with code)

- Ray-trace the 3D objects in WebGL fragment shaders, layered under HTML/CSS for the glass UI and type, then capture frames with a headless browser.

- With software rendering, use a separate small shader program per object and draw it only over that object's screen area, using depth testing to combine them. One big shader is many times slower.

- Draw very thin rings as projected 3D curves, not ray-marched shapes.

- Run the bloom blur on small downscaled canvases.

3D SAAS Blue Animation

Make a premium 4K (3840×2160), 30 fps SaaS launch video. It should look like it came from a big, well-funded design team.

=== FILL THIS IN ===

PRODUCT NAME: [e.g. BlueBud]

ONE-LINE DESCRIPTION: [what it does, e.g. "your AI teammate in the cloud"]

BRAND COLOUR: [e.g. light sky blue #5EC4FF] (use it as a glowing accent; nearly everything else should be neutral)

BACKGROUND: [dark (deep navy / near-black) OR light (soft white / pale tint)]

HERO SYMBOL: [the 3D object that represents the brand, e.g. a glossy cloud, a leaf, a droplet, a gem, a spark]

HERO ENVIRONMENT: [the big shape the hero sits on or over, e.g. a sea of clouds, rolling dunes, ocean waves, mountain ridges]

THREE FEATURES, each with a 3D object (or write "you choose"):

  1. [feature, e.g. "Syncs everything"] → [object, e.g. glass file tiles floating up to the hero]

  2. [feature, e.g. "Automates the busywork"] → [object, e.g. an iridescent glass knot]

  3. [feature, e.g. "Secure by default"] → [object, e.g. a glass-and-chrome padlock]

TAGLINE: [e.g. "Your work, lighter."]

CALL TO ACTION + WEBSITE: [e.g. "Start free" + yourapp.com]

UI ICONS: [list the icons for chips and buttons, or say "match the features"]

===================

Reference images are attached (optional). Study them for mood, then design something original. Don't copy any layout.

LOOK

- Every 3D object must look physically real. Lit glass, gloss or chrome with soft studio reflections, a rim light, a little glow inside, and contact shading in the creases. Never flat icons.

- Give the hero symbol a little character. If it's made of rounded lobes (a cloud, say), keep each lobe clearly defined with tight creases, not one blobby lump.

- Make the hero environment a large dark glass surface with a fine, regular dot texture and glowing edges, rising from the bottom of the frame. Reflections should appear only along its edges, so the faces stay clean.

- Use lighting to add atmosphere: soft light shafts from above, drifting dust with a few out-of-focus specks, faint background wave lines, light film grain and a vignette.

- Type: a large display sans for headlines, with a silver gradient and the brand colour on the key word. A crisp sans for UI labels. A wordmark made of a light weight plus a bold weight in the brand colour, plus a coloured dot.

- Keep it minimal. In each feature scene, the object is centred and is the hero, with a one-line headline above it and at most two small glass chips. No paragraphs.

STORYBOARD (about 43 s, six scenes)

1. Wake up: light particles stream inward. The hero symbol assembles piece by piece, each piece popping in with a spring bounce, then flashes with a shockwave. A neon line draws itself in, orbit rings spring into place, a few stats count up, and the camera pushes into the symbol.

2. Hero: the environment rises from below and keeps moving gently. The product name assembles letter by letter out of a blur. Light arcs draw between points on the environment. Feature chips pop in and float. A cursor clicks the main button.

3–5. One scene per feature. Each object enters with real physics (dropping, springing, swinging or unfolding) and keeps a slow idle motion. Then one interaction, driven by the cursor, proves the feature, for example uploads flowing up, a counter ticking, or a lock snapping shut with a ripple across a background pattern.

6. Outro: the environment rises like a horizon, the hero symbol rises above it, the wordmark assembles and its dot bounces in last, then the buttons pop in. The cursor clicks the call to action and everything fades to black.

MOTION RULES

- Something is always moving, but nothing feels busy. Use eased or spring curves only, never linear motion.

- Text glides up out of a blur with a staggered start, letter by letter for titles and word by word for lines.

- Widgets spring in with a slight overshoot, then float gently. Numbers count up when something happens.

- The camera is always slowly drifting or orbiting, so everything shows real depth.

- The cursor moves along curved, eased paths. The interface reacts with hover glows, button presses, ripples and changes of state.

- Scene changes: the camera pushes forward and blurs out, a soft horizontal light streak in the brand colour flares at the cut, and the next scene resolves out of it. Every scene should hand off to the next.

MAKE IT YOUR OWN

Don't just follow a template. For each feature scene, invent one signature detail that isn't listed here. Examples: light travelling through a glass object, a pattern that rippples outward from an impact, parts that rearrange themselves, a material that shifts colour as it turns. Choose your own camera angles and composition for each scene too.

PROCESS

1. Break down any references and write the storyboard.

2. Render six full-resolution 4K style frames, one per scene, and STOP for my approval before animating.

3. After approval, animate. Before the full render, check full-size frames at the busiest moments and at every cut.

4. Render each scene to its own video file, join them losslessly, then deliver the 4K master plus a 1080p preview.

TECHNICAL NOTES (for rendering with code)

- Ray-trace the 3D objects in WebGL, layered under HTML/CSS for the glass UI and type, and capture frames with a headless browser.

- With software rendering, give each object type its own small shader program, drawn only over that object's on-screen area, and combine them with depth testing.

- For shapes built from many blended spheres, bound each sphere separately, so the march starts right at the surface.

- Anti-alias fine surface dots by pixel footprint (distance × pixel angle), not by screen-space derivatives. Derivatives turn noisy and the dots smear to grey.

- Draw thin rings as depth-aware projected curves with flat ends.

- Build the transition streak from soft elliptical gradients, not rectangles. Don't use a CSS brightness filter during transitions, because it shifts highlight colours.

- Run the bloom blur on small downscaled canvases.

Reel Style 1 (Blue)

I'm uploading client talking-head footage. Turn it into a premium, high-budget vertical (9:16) social video in the style below. Work like a senior motion designer and editor: take your time, check your own work, and never ship something that looks templated or cheap.

=== FILL THIS IN ===

CLIENT / BRAND NAME: [ ]

HANDLE OR WEBSITE (for the end card): [ ]

CALL TO ACTION: [e.g. "Follow for part 2", "Book a call", "Link in bio"]

BRAND COLOUR: [e.g. light sky blue #5EC4FF, or "pick one that suits the footage"]

OUTPUT: 9:16, 2160×3840 (4K), 30 fps, the full length of the footage (unless I give a target length)

MOOD: [e.g. premium tech, calm luxury, high-energy creator]

ANYTHING TO AVOID: [ ]

===================

STEP 1 — UNDERSTAND THE FOOTAGE

- Inspect the file: resolution, frame rate, length, audio tracks, and whether the camera is static. Pull frames from across the clip and look at them: framing, background, wardrobe, lighting, gestures.

- Transcribe the speech with word-level timestamps. If no speech-to-text tool is available, say so and ask me for an SRT or transcript. Don't guess the words.

- From the transcript, find the hook, the key points, the punchy numbers or phrases, and the natural cut points (sentence ends and pauses). Write a short edit plan: shot-by-shot timing, what's on screen in each shot, and which spoken word triggers each big moment.

STEP 2 — SHOT TYPES (mix them, roughly alternating)

A) TALKING + BIG WORD BEHIND THEM. A huge keyword from the transcript sits behind the speaker, who is cut out so their head and hair overlap it. Keep it readable: position or size the word so only part of a letter is hidden. Add a soft brand-colour backlight behind them to separate them from the wall.

B) TALKING + 3D OBJECT ORBITING THEM. A glass ring or ribbon passes behind them on one side and in front of them on the other, with a small glass chip riding it (a counter, an icon, a stat).

C) PUNCH-IN. Push in from wide to a tight, off-centre framing, with the keyword set in the open space beside them (for example an outline line over a solid line), tucked slightly behind their hair.

D) FULL 3D B-ROLL. The speaker's audio continues while the screen cuts to one glossy 3D hero object that stands for the point being made (hourglass = time, knot = automation, padlock = security, plus = follow, cloud = sync; invent better ones). A big word sits near it or weaves through it, with the object partly in front of the letters and partly behind.

E) END CARD. The call to action, with a 3D object that lands, then a cursor clicks a button that changes state (for example Follow → Following ✓).

Keep shots short and punchy, usually 2–3 s, and cut on sentence beats. "Not too slow" is the goal.

STEP 3 — LOOK

- Everything 3D must be real lit 3D: glass and gloss with soft studio reflections, rim light, a little glow inside, contact shading. Never flat icons.

- 3D backgrounds: deep navy or near-black with brand-colour haze, soft light shafts from above, fine dust with a few out-of-focus specks, subtle film grain and a vignette.

- Type: a large display sans for big words (heavy weight, tight tracking, silver-to-white gradient), small spaced-out uppercase labels in the brand colour, and the brand colour used sparingly.

- Captions: ONE line, small, white, bold, with a tight crisp drop shadow (no blurry backdrop smudge), in the same position in every shot, above the bottom app-interface zone.

- Grade the footage lightly so it sits with the graphics: slightly cooler, deeper shadows, natural skin, a gentle vignette.

- Minimal. One idea per shot. No clutter, no paragraphs.

STEP 4 — STYLE FRAMES FIRST

Render six full-resolution style frames covering the different shot types, and STOP for my approval. Iterate on composition until each one is readable and balanced: check that words aren't blocked by the speaker, captions are readable, and nothing collides.

STEP 5 — ANIMATION (after approval)

Every element needs intentional, physical motion, never a generic "slide up and fade":

- Big words get a different signature move per shot: an odometer roll for numbers (digits spin with motion blur and settle), a letter flip-up cascade, an outline that draws itself on, a glowing wipe, or an impact slam (letters scale down from big with blur). Add a sheen sweep after a word lands.

- Small labels tighten their letter spacing as they fade in.

- Captions reveal word by word, timed to the transcript's word timestamps, each word rising out of a slight blur with a tiny pop.

- 3D objects enter with physics (flips, spins that slow down, drops with spring bounce), land with a small flash and shockwave, then keep idle motion. Add one detail per shot that makes it feel alive (sand pouring, light travelling through glass, chips popping as beams reach them, counters ticking).

- Interactions use a cursor on curved, eased paths. The interface responds with hover glows, presses, ripples and state changes.

- The camera never sits still: slow push-ins, slight orbits, parallax between the text and footage layers, punch-ins on emphasis.

- Cuts: a fast zoom-blur (about 0.2 s) with a soft brand-colour light-streak flare across the cut. Make each shot hand off to the next.

- Use spring and expo-out easing only, never linear motion. Keep timings tight: entrances around 0.3–0.9 s.

STEP 6 — CUT-OUT (MATTING) OF THE SPEAKER

- Use a person-segmentation model if one is available. If not: run GrabCut at half resolution, seeded with spatial priors (background bands at the top and sides; foreground over face, torso and lap) and with each frame seeded from the previous frame's mask. Keep the largest component and fill holes. Pull the edge in slightly so no background fringe shows. Blend over neighbouring frames to stop flicker. Refine with a guided filter at full resolution so hair edges stay soft.

- Check edges zoomed in over consecutive frames: no flicker, no dark halo. Keep behind-the-speaker elements away from anything the matte can't separate, such as a chair the same colour as the wall.

STEP 7 — BUILD AND RENDER (if rendering with code)

- Layer order, bottom to top: graded plate → behind elements (big words, glow, 3D back half) → speaker cut-out → 3D front half → overlays → captions. Split 3D objects into front and back halves at the speaker's depth so they can orbit around the person.

- Ray-trace the 3D in WebGL. With software rendering, give each object type its own small shader program, drawn only over its on-screen area and combined with depth testing; one big shader is many times slower. Draw thin rings as depth-aware projected curves. Anti-alias fine surface dots by pixel footprint (distance × pixel angle), not screen-space derivatives. Run bloom on small downscaled canvases. Build the cut streak from soft elliptical gradients. Avoid CSS brightness filters during transitions, because they shift highlight colours.

- Map each output frame to the matching source frame by time, so the speech stays in sync.

- Render each shot to its own video file and join them losslessly. Put the client's ORIGINAL AUDIO back on the final video untouched. Deliver the 4K master plus a 1080×1920 copy.

STEP 8 — QUALITY CHECKS BEFORE DELIVERY

Check full-size frames at the busiest moment of every shot and at every cut. Confirm:

- captions match the audio

- no text is unreadable

- nothing clips through anything else

- no matte flicker

- the final file has the right resolution, frame rate, frame count and audio

Fix problems before sending, and tell me plainly anything you couldn't do.

Reel Style 2 (Green)

You're a senior motion designer and 3D artist. Turn my talking-head footage into a world-class 9:16 social reel: kinetic typography, real-looking 3D objects, and text that sits BEHIND me. It should feel like a high-budget studio made it, not an AI template.

━━━━━━━━━━ MY DETAILS (fill in) ━━━━━━━━━━

FOOTAGE: [attached]

WHAT IT'S ABOUT: [e.g. "how I scaled my agency to $50k/month" / "3 mistakes new landlords make"]

DOES THE CLIP HAVE SPEECH? [yes = transcribe it and use my exact words | no = write a punchy script that fits my gestures]

ACCENT COLOUR: [e.g. emerald green #3BF58F / electric blue / amber / violet]

CTA / ENDING: [e.g. "Follow for part 2" / "Comment GUIDE" / "Link in bio"]

BRAND NAME (optional): [ ]

TONE: [confident / calm & premium / hype / educational]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 1: STUDY THE FOOTAGE

- Probe the resolution, fps, duration and frame count. Pull frames every ~0.5 s and look at them.

- Map the layout in output coordinates (1080×1920 CSS, rendered at 2× = 2160×3840): head top, face centre, shoulders, torso, hands, the free space (usually headroom above the head), any bright patches or distractions, and where the floor or dark areas are for captions.

- If there's speech, transcribe it with word timestamps. If there isn't, write a 15–30 s script built on a hook → 3 beats → CTA arc, timed so emphasis words land on gestures. Keep it to one idea per shot.

STEP 2: PLAN 6 SHOTS (~2.4–2.6 s each), ALTERNATING

Talking shot → full 3D shot → talking → full 3D → talking punch-in → full 3D CTA. Every shot needs ONE hero idea:

1. HOOK (talking): a giant number or word BEHIND my head (my head overlaps the bottom of the letters). Use a number odometer roll or a letter slam. Small serif-italic kicker line above it.

2. FULL 3D: the topic's hero object(s) on a glowing perspective grid floor under soft volumetric light shafts, with the big title above.

3. TALKING: 3D objects ORBITING me on a tilted ring, some passing in front of me and some behind (depth-split), plus one small glass UI chip that pops in and gets a check mark.

4. FULL 3D: a physical moment: things falling/stacking/building with weight and a bounce, a big hero object spinning, and a big word with the object weaving through it.

5. TALKING PUNCH-IN: crop hard to ~1.9× with me off to one side. Two-line text on the other side: line 1 draws on as an outline stroke, line 2 wipes in with a glowing edge, and both tuck behind my shoulder.

6. CTA (full 3D): the hero object launches up through rings with a light ripple, "PART 2"-style title slam, and a glass button a cursor clicks ("Follow" → "Following").

Choose 3D objects that MEAN something for my topic (money → embossed coins/bars/arrow; fitness → kettlebell/heart-rate line; real estate → glass house/keys; AI → chip/node graph; etc.). Emboss a simple icon on the hero object.

Make this reel different: vary the camera paths, the object choice, which shots go full 3D, and the colour of the light. Don't just copy a previous layout.

STEP 3: STYLE

- Palette: near-black tinted toward the accent colour, ONE accent colour (glows, rims, rings, highlighted words), and white text. Grade my footage to match: shadows tinted toward the accent, floor darkened toward the bottom, a soft backlight glow behind me.

- Fonts: a tall condensed display face for the big words (e.g. Anton/Bebas Neue/Oswald, uppercase, with a white-to-tinted vertical gradient fill), an elegant serif italic for the small kicker lines (e.g. Lora/Playfair italic, with the key word in the accent colour), and a clean bold sans for captions.

- Captions: ONE line, white, bold, tight drop shadow (no grey box), placed low over dark areas, never across my face. Highlight one word per caption in the accent colour or a heavier weight.

- 3D: glossy glass/plastic in the accent hue with real studio lighting: a key, a fill, a fresnel rim, sharp speculars, soft contact shadows, bloom on the brightest edges, and a subtle haze. Restraint: few objects, lots of negative space, nothing cluttered.

- Background for 3D shots: dark gradient, volumetric light shafts from above, a scrolling perspective grid floor that fades into a horizon glow, and slow drifting particles.

STEP 4: SHOW ME 6 STILLS FIRST (4K, 2160×3840)

Render one frame per shot at its most complete moment and send a contact sheet plus the full-size frames. Wait for my approval or changes before animating.

STEP 5: ANIMATE (after approval)

Motion is EVERYTHING. Nothing is static and nothing simply slides up.

- Text vocabulary (vary it, never repeat the same one twice in a row): per-character masked rise (skew + blur + scale-Y out of the baseline), letter slam (scale 1.7→1 with motion blur and a tiny impact squash), odometer digit roll with motion blur, SVG outline stroke draw-on then fill, clip-path wipe with a glowing leading edge, serif kicker rising with a skew/blur, a light sheen sweeping across big words after they land. Captions build word by word (blur→sharp, rise 16 px, tiny pop).

- 3D motion: springs with real overshoot, gravity drops with a small bounce, objects spinning WHILE they arrive, rings springing open from flat, an orbit where items pass in front of and behind me, a hero object that keeps drifting and spinning after it lands, and shockwave rings on impact.

- Camera: every shot has a slow move (push-in, dolly, gentle orbit). Talking shots get a punch-in that eases out (expo), then keep a slow creep.

- Transitions: each shot hands off to the next with a ~0.2 s zoom-blur plus a soft anamorphic light streak. Keep exits short and entrances energetic, and make the next shot's motion continue the previous one's direction.

- Pacing: things land in the first 0.2–0.6 s of each shot, with secondary details (chips, sparkles, sheen) staggered after. Nothing waits on an empty frame.

TECHNICAL PIPELINE (use what works in your environment)

- Render engine: an HTML page per frame in headless Chrome (Playwright), 1080×1920 viewport at deviceScaleFactor 2 = 2160×3840. WebGL raymarched SDF objects (rounded boxes, reeded cylinders, extruded shapes, glass) drawn as separate per-object programs inside their screen-space bounding rects so software GL stays fast. Additive halos must fade to exactly zero at the rect edge (window them) or you get visible boxes. 2D canvas for thin rings, neon lines, particles, the grid floor and the light streaks. Low-res bloom pass.

- Layer stack: graded plate → back text → 3D behind me → cut-out of me → text "between" → 3D in front → UI/captions. To make objects pass behind and in front of me, split the 3D at a depth plane and draw the back half before my cut-out and the front half after it.

- Matting (no ML model needed): GrabCut at 1080p with spatial priors from my layout, each frame seeded from the previous mask, keep the largest component, fill holes, light erode, 3-frame temporal blend, then a guided-filter refine at 4K. Then decontaminate edge colours (pull them from the solid interior) and tighten alpha slightly so there's no dark fringe where my hair crosses text. Check an edge crop at full res before going further.

- Timing: output 30 fps. Source frame = round(t × source_fps). All motion comes from pure functions of t (deterministic, any frame can render on its own).

- Output: render each shot to its own .mp4 (JPEG q92 frames piped to ffmpeg, libx264, crf ~17, yuv420p), write to a temp name and rename when done (resumable), then join with the concat demuxer using -c copy. Also make a 1080p copy. Run long renders in the background and keep checking on them.

QUALITY CHECKS BEFORE YOU SEND ANYTHING

- Look at stills from every shot at several times (start, mid-motion, settled, exit). Check for: text clipped by the frame edges, captions over my face or hands, objects covering the key word, empty first frames, objects visible before their entrance, rectangular halos, banding, gradient text showing as a solid box after splitting into letters, and dark matte fringes.

- The big word must read instantly at phone size. If it doesn't, cut words.

- Deliver the 4K MP4 plus the 1080p copy, and tell me in a few lines what moves in each shot.

Go slow, look at your frames, and iterate until it genuinely looks high-budget.

Sound Design Prompt

Sound-design my uploaded video using the sound effects I’ve attached. Return the finished video with the new mix. Keep the picture, timing, and graphics unchanged. Use my actual recordings, not generated substitutes. Make the creative choices yourself unless a file is missing or unusable.

Watch first, then choose. Watch the full cut with its original audio and listen to each uploaded effect rather than guessing from its filename. Treat the effects as a library, not a checklist. If the existing audio already sells a moment, leave it alone. If several graphics animate as one gesture, score the gesture once rather than adding a sound to every element.

Place each sound by what the viewer sees. Sync the meaningful part of the sound, not the start of the file. A click belongs on the frame a button depresses. A whoosh should swell through the fastest part of a slide. An impact belongs where the motion stops or makes contact. For example, if a title slides in, overshoots, and settles, try one soft swish through the slide; add a tiny tick on the settle only if it makes the landing feel better. Use subtle left/right placement only when the movement on screen motivates it.

Mix for clarity, not loudness. Use the original dialogue or music as the volume reference. Start each effect low and bring it up only until the motion reads. Set levels individually: a bright click can cut through a voice even when its meter reads low. If an effect masks a word, lower, shorten, soften, or remove the effect before changing the voice. Don’t turn down the whole soundtrack to make room for a decorative sound. Reserve the strongest accent for the most important moment, and let quiet passages stay quiet.

Check the finished mix. Compare it with the original at matched listening levels so that “louder” doesn’t pass for “better.” At low playback volume, speech should still be easy to follow and no small graphic should sound bigger than the action it represents. Check for clipping, accidental double hits, abrupt tails, and drift. Aim for a final true peak no higher than −1 dBTP; don’t compress the whole mix just to make it louder.

Deliver the mixed video and a separate, full-length added-effects-only WAV aligned to the video from 00:00, with silence preserved between cues. The test for success: when the effects are muted, the motion should lose some weight or clarity; when they’re on, I should notice the motion more than the sounds.
