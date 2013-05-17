HTML Tape Player component thing.
Takes this html:
```html
<!-- tape container -->
<div class="tape">
    <!-- tapes background image -->
    <img class="tape-cover" alt="Album Cover" title="Haute f'Aurts" src="records/HauteFaurts/cover-hautefaurts.jpg" />
    <!-- tapes title -->
    <h1 class="tape-name">Haute f'Aurts</h1>
    <!-- tapes sub title -->
    <h3 class="tape-date">August 2012</h3>
    <!-- list of mp3 tracks -->
    <ol class="tape-tracks">
        <li><a href="records/HauteFaurts/Vicidomini-Hautef'Aurts_05.mp3" type="audio/mp3">Like Chicken Night In Turkey</a></li>
        <li><a href="records/HauteFaurts/Vicidomini-Hautef'Aurts_04.mp3" type="audio/mp3">Which Door Leads To The Safe?</a></li>
        <li><a href="records/HauteFaurts/Vicidomini-Hautef'Aurts_03.mp3" type="audio/mp3">When In Doubt, Get The Fuck Out</a></li>
        <li><a href="records/HauteFaurts/Vicidomini-Hautef'Aurts_01.mp3" type="audio/mp3">Good Junk</a></li>
    </ol>
</div>
```
wraps some elements round it to look like a cassette player with a track listing.
wheels spin and make "tape sounds" while buffering the audio element.
seems fitting, since we have to wait for a song to buffer anyway.

still some things to do:
- [ ] remove jquery dependancy
- [ ] remove sound.js dependancy
- [ ] add support for multiple audio formats (like ogg)

