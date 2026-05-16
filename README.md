Best approach for your case: use short looping videos on the cards, not GIFs.

Why:

GIF looks soft for gradients/text and gets very heavy fast.
MP4/WebM gives much better quality at a fraction of the size.
You can still keep the card experience clean and fast with poster images + lazy loading.
What to do for index.html:

Keep normal image cards for static projects.
For motion-heavy projects like Interactive Identity for X-Journal II, replace the card image with a muted loop video preview.
Keep click behavior the same so card still opens the project page.
Use hover/focus to play on desktop, and keep paused by default for mobile unless you want autoplay in-view.
Respect reduced motion users by not auto-playing when reduced motion is enabled.
Recommended media spec:

Duration: 3 to 6 seconds, seamless loop.
Resolution: 960x540 or 1280x720.
Frame rate: 24 or 30 fps.
No audio track.
Formats:
MP4 (H.264) for broad support.
WebM (VP9) as higher-efficiency source when available.
Include a poster JPG for instant first paint.
Quality/performance targets per card:

MP4: around 1 to 2.5 MB for a short loop.
WebM: often smaller for same quality.
Poster image: 80 to 200 KB.
Preload: metadata only (not full auto-download for all cards).
Encoding settings you should use:

MP4:
ffmpeg -i input.mov -vf scale=960:-2,fps=30,format=yuv420p -c:v libx264 -crf 21 -preset slow -movflags +faststart -an output.mp4
WebM:
ffmpeg -i input.mov -vf scale=960:-2,fps=30 -c:v libvpx-vp9 -crf 32 -b:v 0 -row-mt 1 -an output.webm
Poster:
ffmpeg -i input.mov -ss 00:00:01 -vframes 1 -q:v 2 poster.jpg
Where to wire it:

Card markup is in index.html inside each project-row block.
Card visual sizing behavior is in site.css under the landing page project thumb styles.
My recommendation for your site specifically:

Use video previews for:
Interactive Identity for X-Journal I
Interactive Identity for X-Journal II
Generative Designs
Hierarchy
Keep publication and most photography cards as static images.
On each project page, keep the full interactive work as the main experience. Card should tease, not replace interaction.