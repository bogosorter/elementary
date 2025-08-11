# Markdown Math Guide

Many flavors of Markdown support LaTeX-style math syntax for inline and block equations. These are easy to understand but can be used for incredibly complex formulas. If you're new to LaTeX and LaTeX in markdown, this guide will help you get started. In no time you'll refuse to use anything else ;)

## Basics

Use single dollar signs `$...$` to create inline math expressions. `$x^3$`, for instance, renders as $x^3$.

Use double dollar signs to create centered mathematical expressions on their own line. Einstein's famous equation, for instance, can be written like this:

```
$$
E = mc^2
$$
```

$$
E = mc^2
$$

## Elements

LaTeX enables you to represent pretty much any math symbol. Some examples are Greek letters ($\alpha$, $\beta$, etc.), infinity ($\infty$), and not equal ($\neq$). I'll provide a short list of useful commands below. If you want something that's not here, just search for it online or ask ChatGPT.

- Superscripts: $e^{-x}$
- Subscripts: $a_{n+1}$
- Fractions: $\frac{x^2 + 2x + 1}{x^2 - 1}$
- Roots: $\sqrt{x}$ or $\sqrt[n]{x}$
- Logarithms: $\log_2(8)$
- Summations: $\sum_{i=1}^{n} i$
- Products: $\prod_{i=1}^{n} i$
- Integrals: $\int_{0}^{1} x^2 dx$
- Trigonometric functions: $\sin(x)$, $\cos(x)$, etc.
- Limits: $\lim_{x \to \infty} \frac{1}{x} = 0$
- Vectors: $\vec{v} = \begin{pmatrix} a & b & c \end{pmatrix}$
- Matrices:
$$
A = \begin{pmatrix}
a & b & c \\
d & e & f \\
g & h & i
\end{pmatrix}
$$
