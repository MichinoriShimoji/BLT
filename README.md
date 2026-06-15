# BLT — Browser-based Lightweight Toolkit for Editing Field Data

A simple, intuitive toolkit for transcription, annotation, glossing, and conversion.

**BLT** is a single-file, fully client-side browser tool for field linguistics.
Open [`blt.html`](blt.html) in any modern browser — no installation, no server,
no external libraries, and your data never leaves your machine.

🔗 **Live version:** https://michinorishimoji.github.io/mshimoji.com/blt.html

## Features

- Reads raw **WAV** audio and auto-segments it by silence detection (smoothed RMS + auto threshold + hysteresis).
- Waveform-based boundary editing; missed-audio detection.
- **IPA** input palette (vowels / consonants / suprasegmentals / diacritics).
- Interlinear glossing with customizable annotation tiers (text / udl / morph / gloss / pos / trans …).
- Multi-speaker support with overlapping speech (per-speaker lanes).
- Sentence/word boundary coding layers (bdr / wbdr).
- Import and export **ELAN EAF**; export **TSV**, **JSON**, and split-audio **ZIP**.
- Analysis & simple dictionary tab (word/morpheme counts, morpheme list, examples with audio).

## Usage

Download [`blt.html`](blt.html) and open it in a browser, or use the live version linked above.

## Citation

If you use BLT in your research, please cite it. See [`CITATION.cff`](CITATION.cff),
or use the archived release DOI (added after the first Zenodo release).

## License

[MIT](LICENSE) © 2026 Michinori Shimoji
