import Link from 'next/link';
// CSS Modulesをインポート
import styles from './Header.module.css';

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

type HeaderProps = {
    user_id: string;
};

export const Header = ({user_id}: HeaderProps) => {
    return (
        // ナビゲーションバー全体にクラスを適用
        <header className={styles.headerContainer}>
            <div className={styles.navItem}>
                <div className={styles.logoArea}>
                    <div className={styles.logo}>
                        🔗 Tierin
                    </div>
                    <div className={styles.user_id}>
                        {user_id} ログイン中
                    </div>
                </div>
            </div>


            {navItems.map((item) => (
                <Link
                    key={item.name}
                    href={item.href}
                    className={`${styles.navItem} ${styles.linkItem}`}
                >
                    {item.name}
                </Link>
            ))}

            <div className={`${styles.navItem} ${styles.searchBar}`}>
                <span className={styles.searchIcon}>🔍</span>
                <input
                    type="text"
                    placeholder="タグ、またはキーワードを入力"
                    className={styles.searchInput}
                />
            </div>
        </header>
    );
};
export default Header;