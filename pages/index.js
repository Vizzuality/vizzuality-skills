import React, { useState } from 'react';
import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import dynamic from 'next/dynamic';
import Select from 'react-select'

const Main = dynamic(() => import('../components/main/main'));

export default function Home() {
  const DATA_FILES_YEARS = ['2020', '2021'];
  const [selectedSource, setSource] = useState(DATA_FILES_YEARS[DATA_FILES_YEARS.length - 1]);
  const options = DATA_FILES_YEARS.map(year => (
    { value: year, label: year }
  ));
  return (
    <div className={styles.container}>
      <Head>
        <title>Vizzuality frontend skills</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main} >
        <h1 className={styles.title}>Vizzuality Frontend skills</h1>
        <p>Data registered on {selectedSource}</p>
        <Select options={options} onChange={(s) => setSource(s.value)} className={styles.dropdown} value={{ label: selectedSource, value: selectedSource }} />
        <Main source={selectedSource}/>
      </div>
    </div>
  );
}
