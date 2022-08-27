import Head from 'next/head';
import Sidebar from '../components/Sidebar';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Texting App</title>
        <meta name='description' content='web app para chatear' />
        <meta name='viewport' content='initial-scale=1, width=device-width' />
      </Head>
      <Sidebar />
    </div>
  );
}
