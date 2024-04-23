// src/pages/_document.tsx
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
    render() {
        const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY;
        
        return (
        <Html>
            <Head>
              {googleMapsApiKey && (
                  <script
                      async
                      src={`https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`}
                  />
              )}
            </Head>
            <body>
            <Main />
            <NextScript />
            </body>
        </Html>
        );
    }
}
  
export default MyDocument;