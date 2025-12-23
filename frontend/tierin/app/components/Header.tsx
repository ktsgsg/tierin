"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
// CSS Modulesをインポート
import styles from './Header.module.css';
import { GetEmailHeader } from './headerAction';
import { logoutAction } from './logoutAction';

interface NavItem {
    name: string;
    href: string;
}

const navItems: NavItem[] = [
    { name: 'ホーム', href: '/' },
    { name: '詳細検索', href: '/search' },
    { name: '投稿', href: '/post' },
    { name: 'アカウント', href: '/accounts' },
    { name: 'FAQ', href: '/faq' },
];

interface HeaderProps {
    userEmail?: string;
}

export const Header = ({ userEmail = "ユーザー" }: HeaderProps) => {

    //emailの状態管理
    const [email, setEmail] = useState<string>(userEmail);
    const [searchTitle, setSearchTitle] = useState<string>("");
    const router = useRouter();

    useEffect(() => {
        const fetchEmail = async () => {
            //console.log('Fetching email from headers...');
            const fetchedEmail = await GetEmailHeader();
            //console.log('Fetched email:', fetchedEmail);
            if (fetchedEmail) {
                setEmail(fetchedEmail);
            }
        }
        fetchEmail();
    }, []);

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchTitle.trim()) {
            router.push(`/search?title=${encodeURIComponent(searchTitle)}`);
        }
    };

    const handleLogout = async () => {
        await logoutAction();
        router.push('/login');
    };

    return (
        // ナビゲーションバー全体にクラスを適用
        <header className={styles.headerContainer}>
            <div className={styles.headerTop}>
                <div className={styles.logoArea}>
                    <div className={styles.logo}>
                        <img src="/favicon.ico" alt="Tierin" className={styles.logoIcon} />
                        Tierin
                    </div>
                    <div className={styles.user_id}>
                        {email} ログイン中
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className={styles.logoutButton}
                >
                    ログアウト
                </button>
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
                        placeholder="タイトルを入力"
                        className={styles.searchInput}
                        value={searchTitle}
                        onChange={(e) => setSearchTitle(e.target.value)}
                        onKeyDown={handleSearchKeyDown}
                    />
                </div>
            </div>
        </header>
    );
};
export default Header;