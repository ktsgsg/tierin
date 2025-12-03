'use client';

import React from "react";
import Link from "next/link";
import styles from "./Header.module.css";

type HeaderProps = {
    user_id: string;
}

const Header = ({user_id}: HeaderProps) => {
    return (
        <header className={styles.header}>
            <nav>
                <h1 className={styles.title}>Tierin</h1>
                <p className={styles.userId}>{user_id}ログイン中</p>
            </nav>
            <nav className={styles.menuArea}>
                <Link href="/" className={styles.menuBox}>ホーム</Link>
                <Link href="/serach" className={styles.menuBox}>詳細検索</Link>
                <Link href="/post" className={styles.menuBox}>投稿</Link>
                <Link href="faq" className={styles.menuBox}>FAQ</Link>
                <input
                    className={styles.searchBox}
                    placeholder="タグ，またはキーワードを入力"
                />
            </nav>
        </header>
    )
}
export default Header;