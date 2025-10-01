# AI + BMAD Integration Guide

This document outlines how to use the AI tools with the BMAD (BMad Method) AI prompts and workflows in the EarthquakeApp project.

## Documentation Structure

Project documentation is organized in the `docs/` directory with the following structure:

- `prs/` - Pull request documentation and tracking
- `architecture/` - System architecture and design documents
- `implementation/` - Implementation plans and technical documentation
- `api/` - API specifications and documentation
- `guides/` - How-to guides and tutorials

See [docs/README.md](docs/README.md) for detailed documentation guidelines and standards.

## Setup

The integration is already configured with the following settings:

- BMAD core path: `.bmad-core/`
- Default workflow: `brownfield-fullstack`
- Configuration directory: `.ai/config`
- Templates directory: `.bmad-core/templates`
- Workflows directory: `.bmad-core/workflows`
- Agent teams directory: `.bmad-core/agent-teams`

## Using AI Tools with BMAD

1. **Start a new task**: Use the BMAD workflows to guide development
   ```bash
   # In your IDE or terminal, use the appropriate command for your AI tool
   # Example:
   ai start --workflow=brownfield-fullstack
   ```

2. **Available Workflows**:
   - `brownfield-fullstack.yaml` - Full-stack development for existing projects
   - `brownfield-service.yaml` - Backend service development
   - `brownfield-ui.yaml` - Frontend development
   - `greenfield-*` - For new projects (not recommended for this project)

3. **Agent Teams**:
   - `team-all.yaml` - All available agents
   - `team-fullstack.yaml` - Full-stack focused team
   - `team-ide-minimal.yaml` - Minimal IDE integration
   - `team-no-ui.yaml` - Backend focused team

## Configuration

Customize the integration by editing `.ai/config/settings.json`.

## Development Workflow

1. Review the BMAD documentation in `.bmad-core/user-guide.md`
2. Use the appropriate workflow for your task
3. Follow the BMAD development methodology for consistent results

## Troubleshooting

- If the AI tools don't recognize BMAD prompts, verify the `.ai/config/settings.json` paths
- Check `.ai/logs/` for detailed error messages
- Ensure all required BMAD files are present in `.bmad-core/`

## Learn More

- [BMad Method Documentation](.bmad-core/user-guide.md)
- [Working in the Brownfield](.bmad-core/working-in-the-brownfield.md)
- [Enhanced IDE Workflow](.bmad-core/enhanced-ide-development-workflow.md)
