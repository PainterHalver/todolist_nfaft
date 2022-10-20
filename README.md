#

1. Login form with antd's [Form](https://ant.design/components/form/).
2. Rerun `prisma generate` after every change in the Prisma schema.
3. Prisma middleware should only be called when a new Prisma client is created ([discussion](https://github.com/prisma/prisma/discussions/15848)).
4. Next.js's Link generally go with `<a>` tags.
5. Orchestrate component's transition (children) with page transition (parent): Have to remove the `initial`,`animate` and `exit` props from the children elements and just set them in their variant. ([stackoverflow](https://stackoverflow.com/questions/58980261/transition-when-doesnt-work-in-framer-motion))
