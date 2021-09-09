import React, { useState } from 'react';
import Head from 'next/head'
import styles from '../../styles/Home.module.scss'
import Select from 'react-select'
import metadata2020 from '../../data/metadata-2020.json';
import metadata2021 from '../../data/metadata-2021.json';
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic';

const DevMain = dynamic(() => import('../../components/dev-main/dev-main'));

export default function DevPage(props) {
  const router = useRouter()
  const { dev } = router.query

  const DATA_FILES_META = {'2020': metadata2020, '2021': metadata2021 };
  const [selectedSource, setSource] = useState({ value: DATA_FILES_META['2021'].year, label: DATA_FILES_META['2021'].year, meta: DATA_FILES_META['2021'] });
  const options = Object.keys(DATA_FILES_META).map(year => (
    { value: year, label: year, meta: DATA_FILES_META[year] }
  ));

  return (
    <div className={styles.container}>
      <Head>
        <title>Vizzuality frontend skills</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main} >
        <h1 className={styles.title}>Vizzuality Frontend skills</h1>
        <div className={styles.date}>
          <p>Data registered on {selectedSource?.meta?.date}</p>
          <Select options={options} onChange={setSource} className={styles.dropdown} value={selectedSource} />
        </div>
        {dev}
        <DevMain source={selectedSource} dev={dev}/>
      </div>
    </div>
  );
}
