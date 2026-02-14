// pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html data-wf-page="69609fa59981877e64bec950" data-wf-site="69609fa39981877e64bec91e">
      <Head>
        <meta charSet="utf-8" />
        <meta content="Webflow" name="generator" />

        {/* CSS - Ensure these files are in /public/css/ */}
        <link href="/css/normalize.css" rel="stylesheet" type="text/css" />
        <link href="/css/webflow.css" rel="stylesheet" type="text/css" />
        <link href="/css/mabocore.webflow.css" rel="stylesheet" type="text/css" />

        {/* <link href="https://fonts.googleapis.com" rel="preconnect" /> */}
        {/* <link href="https://fonts.gstatic.com" rel="preconnect" crossOrigin="anonymous" /> */}

        {/* Webfont Loader */}
        {/* <script src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js" type="text/javascript" /> */}
        {/* <script dangerouslySetInnerHTML={{
          __html: `WebFont.load({ google: { families: ["Roboto:100,200,300,regular,500,600,700,800,900"] }});`
        }} /> */}

        {/* Webflow Touch Detection Script */}
        <script dangerouslySetInnerHTML={{
          __html: `!function(o,c){var n=c.documentElement,t=" w-mod-";n.className+=t+"js",("ontouchstart"in o||o.DocumentTouch&&c instanceof DocumentTouch)&&(n.className+=t+"touch")}(window,document);`
        }} />

        <link href="/images/favicon.ico" rel="shortcut icon" type="image/x-icon" />
        <link href="/images/webclip.png" rel="apple-touch-icon" />
      </Head>
      <body className="">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}