## Vic3 Builder UI

Access at [http://vic3.connerpsmith.net](http://vic3.connerpsmith.net)

This project contains scripts for transforming Vic3 files into usable JSON objects. There is a simple
UI for selecting which building you wish to construct. The resulting build chain will be displayed.
There is a setting page that allows you to adjust which projection methods are in effect for each building.

The UI can be launched with the `index.html` in the `/ui/out` directory.

## TODO

* Handle multiple build paths (particularly with synthetics/fertilizer)
* Handle worker count calculations
* Make prettier names

## Getting Started

This is a [Next.js](https://nextjs.org/) project bootstrapped
with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/index.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions
are welcome!
