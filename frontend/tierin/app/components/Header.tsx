"use client";

import { useEffect, useState } from "react";

import Link from 'next/link';
// CSS Modulesをインポート
import styles from './Header.module.css';
import { GetEmailHeader } from './headerAction';

interface NavItem {
    name: string;
    href: string;
}

const navItems: NavItem[] = [
    { name: 'ホーム', href: '/' },
    { name: '詳細検索', href: '/search' },
    { name: '投稿', href: '/post' },
    { name: 'FAQ', href: '/faq' },
];

interface HeaderProps {
    userEmail?: string;
}

export const Header = ({ userEmail = "ユーザー" }: HeaderProps) => {

    //emailの状態管理
    const [email, setEmail] = useState<string>(userEmail);

    useEffect(() => {
        const fetchEmail = async () => {
            console.log('Fetching email from headers...');
            const fetchedEmail = await GetEmailHeader();
            console.log('Fetched email:', fetchedEmail);
            if (fetchedEmail) {
                setEmail(fetchedEmail);
            }
        }
        fetchEmail();
    }, []);

    return (
        // ナビゲーションバー全体にクラスを適用
        <header className={styles.headerContainer}>
            <div className={styles.headerTop}>
                <div className={styles.logoArea}>
                    <div className={styles.logo}>
                        🔗 Tierin
                    </div>
                    <div className={styles.user_id}>
                        {email} ログイン中
                    </div>
                </div>
            </div>
            <div className={styles.headerBottom}>
                <div className={styles.navContainer}>
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`${styles.navItem} ${styles.linkItem}`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>
                <div className={`${styles.navItem} ${styles.searchBar}`}>
                    <span className={styles.searchIcon}>🔍</span>
                    <input
                        type="text"
                        placeholder="タグ、またはキーワードを入力"
                        className={styles.searchInput}
                    />
                </div>
            </div>
        </header>
    );
};
export default Header;