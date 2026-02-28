#!/usr/bin/env python3
"""
Voice Note Processor for OpenClaw
- Downloads voice notes from Telegram
- Transcribes using faster-whisper
- Returns transcript for agent processing
"""

import argparse
import json
import os
import sys
from pathlib import Path
from faster_whisper import WhisperModel


def transcribe_audio(audio_path: str, model_size: str = "base") -> dict:
    """Transcribe audio file and return structured result."""
    
    print(f"Loading Whisper {model_size} model...", file=sys.stderr)
    model = WhisperModel(model_size, compute_type="int8")
    
    print(f"Transcribing {audio_path}...", file=sys.stderr)
    segments, info = model.transcribe(audio_path, language=None)
    
    full_text = ""
    segment_list = []
    
    for segment in segments:
        text = segment.text.strip()
        if text:
            full_text += " " + text
            segment_list.append({
                "start": segment.start,
                "end": segment.end,
                "text": text
            })
    
    result = {
        "language": info.language,
        "language_probability": info.language_probability,
        "text": full_text.strip(),
        "segments": segment_list
    }
    
    return result


def main():
    parser = argparse.ArgumentParser(description='Process voice notes for OpenClaw')
    parser.add_argument('input', help='Input audio file path')
    parser.add_argument('--model', default='base', 
                       choices=['tiny', 'base', 'small', 'medium', 'large-v3'],
                       help='Whisper model size')
    parser.add_argument('--output-json', action='store_true', 
                       help='Output as JSON')
    
    args = parser.parse_args()
    
    if not os.path.exists(args.input):
        print(f"Error: File not found: {args.input}", file=sys.stderr)
        sys.exit(1)
    
    result = transcribe_audio(args.input, args.model)
    
    if args.output_json:
        print(json.dumps(result, indent=2, ensure_ascii=False))
    else:
        print(result["text"])
    
    # Also save to a known location for agent to read
    output_dir = Path.home() / ".openclaw" / "voice-processing"
    output_dir.mkdir(parents=True, exist_ok=True)
    
    transcript_file = output_dir / "latest_transcript.json"
    with open(transcript_file, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)
    
    print(f"Transcript saved to {transcript_file}", file=sys.stderr)


if __name__ == '__main__':
    main()
