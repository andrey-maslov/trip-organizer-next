This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Dependencies update
    !!! be careful with eslint and dependent packages
- install **npm-check-updates** globally ``npm install -g npm-check-updates``
- check updates ``ncu`` or with grouping ``ncu --format group``
- upgrade package.json ``ncu -u``
- install new versions ``yarn``
  [Documentation](https://github.com/raineorshine/npm-check-updates)

### TipTap editor
- Example: [Codepen](https://codesandbox.io/p/sandbox/tiptap-0sqm3i?file=%2Fsrc%2Fcomponents%2FToolbar.tsx%3A45%2C1-48%2C7) 

### Date Time picker
- [Documentation](https://react-day-picker.js.org/start)

### Date formatting
- [Tempo](https://tempo.formkit.com/)
- [Adobe internationalized](https://react-spectrum.adobe.com/internationalized/date/ZonedDateTime.html) to work with NextUI calendars

### Places and address finder
- [React Google Places Autocomplete](https://tintef.github.io/react-google-places-autocomplete/docs/)
- [Google places](https://developers.google.com/maps/documentation/javascript/examples/rgm-autocomplete)

### Authentication Clerk
- [Docs]()
- [Code examples](https://github.com/clerk/clerk-nextjs-demo-app-router)
- [API routes](https://clerk.com/docs/references/nextjs/route-handlers)
