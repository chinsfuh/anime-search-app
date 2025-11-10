# Claude Code Configuration

This directory contains Claude Code configuration for the anime-search-app project.

## Available Commands

### `/log-prompt`
Manually triggers logging of the current conversation to PROMPTS.md.

**Usage:**
```
/log-prompt
```

This command will:
- Append the recent conversation to PROMPTS.md
- Add timestamp and proper formatting
- Increment prompt numbers automatically
- Update the "Last Updated" field

## Automated Prompt Logging Options

### Option A: Manual by Claude (Active in Conversation)
During our conversation, I (Claude) automatically update PROMPTS.md with our exchanges.

### Option B: PowerShell Script
Use the `append_prompt.ps1` script for manual logging:

```powershell
# Interactive mode
.\append_prompt.ps1

# With parameters
.\append_prompt.ps1 -PromptText "Your question" -ResponseText "Claude's answer"
```

### Option C: Slash Command
Use the `/log-prompt` command during a Claude Code session to trigger logging.

## File Structure

```
.claude/
├── README.md           # This file
└── commands/
    └── log-prompt.md   # Slash command for prompt logging
```

## Notes

- PROMPTS.md is maintained in the project root
- All logging methods use the same markdown format
- Timestamps are in 24-hour format
- Prompt numbers auto-increment
