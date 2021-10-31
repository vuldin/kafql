import Head from 'next/head'

import Building from '../components/Building'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Kafkql Dashboard</title>
        <meta name="description" content="Kafka, GraphQL, Kubernetes, NextJS, React" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Building />
      </main>
    </div>
  )
}
