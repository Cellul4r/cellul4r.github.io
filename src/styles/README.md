# Interaction feedback

`interactions.css` defines the shared hover, focus, and pressed states.

- Use `data-feedback="action"` on a real link or button. It gets a small lift, border emphasis, shadow, visible keyboard focus, and press feedback. Disabled buttons are excluded.
- Use `data-feedback="surface"` on an informational card. It gets a quieter border and shadow emphasis, with no lift, extra tab stop, or pointer cursor. Keyboard focus on links inside it also highlights the card.
- Keep colors and layout in component styles. Override `--feedback-border`, `--feedback-shadow`, or `--feedback-lift` when necessary.
- Project cards use one stretched case-study link; do not add another interactive element under that link’s overlay.
- Hover-only effects require a fine pointer. Reduced motion disables movement while retaining color/focus feedback. Individual `translate` is used so feedback does not replace Framer Motion entrance transforms.
