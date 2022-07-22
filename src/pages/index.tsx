import type { NextPage } from "next";
import Head from "next/head";
import { StageArea } from "../components/StageArea";

const Home: NextPage = () => {

  return (
    <>
      <Head>
        <title>Pokemon Battle</title>
        <meta name="description" content="A Simple Game for Battle Between Pokemon" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex flex-col items-center justify-center h-screen p-4">
        <StageArea />
      </main>
    </>
  );
};


export default Home;
