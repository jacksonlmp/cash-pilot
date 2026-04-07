# Design System Specification: Editorial Fintech
 
## 1. Overview & Creative North Star: "The Kinetic Vault"
This design system moves away from the static, "boxy" nature of traditional banking. Our Creative North Star is **The Kinetic Vault**—an experience that feels as secure as a private bank but as fluid as modern wealth. We reject the "template" look of standard fintech by utilizing **intentional asymmetry, deep tonal layering, and an editorial typographic scale.** 
 
The goal is to move the user’s eye through data visualization using "breathing room" (negative space) rather than lines. We treat the interface not as a flat screen, but as a series of physical, high-end materials—frosted glass, matte polymers, and layered paper—that react to the user’s touch.
 
---
 
## 2. Colors & Surface Philosophy
 
### The "No-Line" Rule
**Strict Mandate:** Designers are prohibited from using 1px solid borders to section content. Structure is defined exclusively through background color shifts. To separate a transaction list from a header, transition from `surface` to `surface-container-low`. 
 
### Surface Hierarchy & Nesting
We use Material 3 tonal tiers to create organic depth. Instead of drop shadows, we use **Nesting**:
*   **Base Layer:** `surface` (#f8f9fa)
*   **Sectioning:** `surface-container-low` (#f3f4f5) for large background blocks.
*   **Card Elements:** `surface-container-lowest` (#ffffff) to provide a "lifted" feel against the lower tiers.
 
### The "Glass & Gradient" Rule
To elevate the "Premium" feel, floating elements (Modals, FABs, Top Navigation) should utilize **Glassmorphism**:
*   **Fill:** `surface` at 70% opacity.
*   **Effect:** Backdrop blur of 20px–40px.
*   **Signature Gradient:** For primary CTAs and Hero Data Viz, use a linear gradient: `primary` (#230060) to `primary-container` (#3b0096) at a 135-degree angle. This adds "soul" to the deep purples.
 
---
 
## 3. Typography: Editorial Authority
We pair **Manrope** (Display/Headline) with **Inter** (Body/Labels) to create a sophisticated, tech-forward hierarchy.
 
*   **Display (Manrope):** Used for account balances and hero numbers. The large scale (`display-lg` at 3.5rem) creates an authoritative, editorial "magazine" feel.
*   **Body (Inter):** Focused on legibility. We use `body-md` (0.875rem) as the workhorse for transaction details, ensuring high data density without clutter.
*   **Semantic Weight:** Always use `on-surface-variant` (#4c4451) for labels to create a soft contrast against the high-contrast `on-surface` (#191c1d) used for primary data points.
 
---
 
## 4. Elevation & Depth
 
### The Layering Principle
Depth is achieved by stacking. A "Premium Card" should sit as `surface-container-lowest` on top of a `surface-container` background. This creates a soft, natural lift.
 
### Ambient Shadows
Shadows are only permitted for floating action elements (FABs) or triggered overlays.
*   **Value:** Blur: 24px | Spread: -4px | Opacity: 6%.
*   **Color:** Use a tinted shadow derived from `primary` (#230060) rather than pure black to maintain color harmony.
 
### Ghost Borders
If accessibility requirements demand a container boundary, use a **Ghost Border**:
*   **Stroke:** 1px `outline-variant` (#cec3d3).
*   **Opacity:** 20%. 
*   **Rule:** Never use 100% opaque outlines.
 
---
 
## 5. Signature Components
 
### The "Pulse" Floating Action Button (FAB)
The primary transaction trigger.
*   **Color:** `surface-tint` (#6d23f9).
*   **Shape:** `full` (9999px) pill shape.
*   **Shadow:** Large ambient shadow to denote the highest z-index.
 
### Data Visualization Cards
*   **Corner Radius:** `xl` (1.5rem) to lean into the "modern banking" softness.
*   **Interaction:** On hover/tap, the card should scale to 102% rather than changing color.
*   **Positive/Negative Values:** Use `secondary` (#006e2a) for growth and `error` (#ba1a1a) for alerts. Apply these to the text and small "micro-graphs" only; never fill the entire card with these loud colors.
 
### Input Fields
*   **State:** Default state has no border; it is a `surface-container-high` (#e7e8e9) block.
*   **Active State:** Transitions to a `primary` (#230060) ghost border (20% opacity) with a vertical 2px "accent bar" on the left edge.
 
### Lists & Dividers
*   **Forbidden:** Horizontal lines between transactions.
*   **Alternative:** Use `spacing-3` (1rem) vertical gaps and subtle alternating background tints (`surface` vs `surface-container-lowest`) for high-density lists.
 
---
 
## 6. Do’s and Don’ts
 
### Do
*   **DO** use whitespace as a functional tool. If a screen feels "busy," increase spacing using the `spacing-8` (2.75rem) token between sections.
*   **DO** use `secondary_container` (#5cfd80) for success toast backgrounds to ensure the "vibrant green" feels integrated, not distracting.
*   **DO** use asymmetrical layouts for dashboards—e.g., a large balance on the left balanced by a smaller "Quick Actions" cluster on the right.
 
### Don’t
*   **DON'T** use pure black (#000000) for text. Always use `on-surface` (#191c1d) to maintain the premium, soft-touch aesthetic.
*   **DON'T** use "Standard" icons. Use thin-stroke (1.5pt) icons with rounded terminals to match the `roundedness-lg` scale of the components.
*   **DON'T** use harsh animations. Every transition should be a 300ms "Ease-Out" to mimic the fluid nature of the "Kinetic Vault."