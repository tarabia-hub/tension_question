# Tension Connection Solver

A lightweight web app for solving factored tensile resistance for a single-angle bolted tension connection.

## What it computes

The app evaluates the three limit states shown in your assignment solution:

1. Cross-section yielding: `Tr = φy * Ag * Fy`
2. Net section fracture:
   - `An = Ag - dh*t`
   - `Ane = U*An`
   - `Tr = φu * Ane * Fu`
3. Block shear:
   - `Lv = e + (n-1)s`
   - `Ant = (b - g - 0.5dh)*t`
   - `Agv = Lv*t`
   - `Tr = φu [ ut*Ant*Fu + 0.6*Agv*(Fy + Fu)/2 ]`

The governing resistance is the minimum of the three values.

## Run

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`.
