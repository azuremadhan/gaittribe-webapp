# Voice Creative Iteration Skill

## Overview
Process voice notes from Maddy to iterate on creative work (websites, videos, articles). Transcribe, understand intent, make changes, and report back.

## How It Works

1. **Receive Voice Note** - Maddy sends voice note via Telegram/WhatsApp/Signal
2. **Transcribe** - Use `process_voice.py` to convert speech to text
3. **Understand Intent** - Analyze transcript for changes needed
4. **Execute Changes** - Modify the relevant project (gaittribe-webapp, etc.)
5. **Report Back** - Send results or ask clarifying questions via message

## Tools

### Transcribe Voice
```bash
python3 ~/.openclaw/workspace/scripts/process_voice.py <audio_file> --model base
```

### Process Flow

When Maddy sends a voice note:
1. Download audio from the message
2. Run transcription
3. Parse the intent:
   - Website changes → gaittribe-webapp
   - Video edits → check for video project
   - Article/writing → check for docs/content
4. Make the changes
5. Report back with summary

## Voice Processing Script

Location: `~/.openclaw/workspace/scripts/process_voice.py`

Usage:
```bash
python3 ~/.openclaw/workspace/scripts/process_voice.py /path/to/audio.ogg --model base
```

Output includes:
- Full transcript text
- Language detection
- Timestamped segments

## Current Project Context

- **Primary**: gaittribe-webapp (Next.js sports event platform)
- **Branch**: feature/v2-improvements
- **Location**: ~/.openclaw/workspace/gaittribe-webapp/

## Response Template

After processing voice note:

**Transcribed:**
> "..."

**Intent:**
> [What change was requested]

**Actions Taken:**
> [What was modified]

**Result:**
> [Status + any questions for clarification]
