import Document, { Head, Html, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta charSet='utf-8' />
          <meta name='title' content='Todolist' />
          <meta
            name='description'
            content='Realtime todolist with smooth animation using Next.js, Firebase and Framer Motion.'
          />
          <meta name='keywords' content='nextjs, firebase, todolist, realtime, framermotion, animation' />
          <meta name='robots' content='index, follow' />
          <meta http-equiv='Content-Type' content='text/html; charset=utf-8' />
          <meta name='language' content='English' />
          <meta name='author' content='PainterHalver' />
          {/* Open Graph / Facebook  */}
          <meta property='og:type' content='website' />
          <meta property='og:title' content='Todolist' />
          <meta property='og:site_name' content='Todolist' />
          <meta
            property='og:description'
            content='Realtime todolist with smooth animation using Next.js, Firebase and Framer Motion.'
          />
          {/* Twitter */}
          <meta property='twitter:card' content='summary_large_image' />
          <meta property='twitter:title' content='Todolist' />
          <meta
            property='twitter:description'
            content='Realtime todolist with smooth animation using Next.js, Firebase and Framer Motion.'
          />

          <link
            rel='icon'
            href='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📝</text></svg>'></link>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
