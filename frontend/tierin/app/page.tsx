import React from 'react';
import { Header } from '@/app/components/Header';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Header />
      <h1>Tierinへようこそ！</h1>
      <h1>気になる情報を検索しよう！</h1>
    </div>
  );
}
