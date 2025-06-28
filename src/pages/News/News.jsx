import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../../i18n';

// Mock Facebook posts placeholder
const MOCK_POSTS = [
    {
        id: '1',
        message: 'Welcome to our Facebook page! Stay tuned for updates.',
        created_time: '2024-06-01T10:00:00+0000',
        full_picture: 'https://via.placeholder.com/600x300?text=Facebook+Post+1',
        permalink_url: 'https://facebook.com/',
    },
    {
        id: '2',
        message: 'Exciting news coming soon. Follow us for more!',
        created_time: '2024-06-02T14:30:00+0000',
        full_picture: 'https://via.placeholder.com/600x300?text=Facebook+Post+2',
        permalink_url: 'https://facebook.com/',
    },
];

const News = () => {
    const { t } = useTranslation();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate async fetch with mock data
        setTimeout(() => {
            setPosts(MOCK_POSTS);
            setLoading(false);
        }, 1000);
    }, []);

    return (
        <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
            <h1>{t('news.title', 'Latest News')}</h1>
            {loading ? (
                <p>{t('news.loading', 'Loading news...')}</p>
            ) : posts.length === 0 ? (
                <p>{t('news.noNews', 'No news available.')}</p>
            ) : (
                posts.map((post) => (
                    <div
                        key={post.id}
                        style={{
                            border: '1px solid #ddd',
                            borderRadius: 8,
                            padding: 16,
                            marginBottom: 24,
                            background: '#fff',
                        }}
                    >
                        {post.full_picture && (
                            <img
                                src={post.full_picture}
                                alt={t('news.postVisual', 'Post visual')}
                                style={{ width: '100%', borderRadius: 8, marginBottom: 12 }}
                            />
                        )}
                        <p style={{ fontSize: 18, marginBottom: 8 }}>
                            {post.message || t('news.noContent', 'No content')}
                        </p>
                        <small style={{ color: '#888' }}>
                            {new Date(post.created_time).toLocaleString()}
                        </small>
                        <br />
                        <a
                            href={post.permalink_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#1877f2', textDecoration: 'none', fontWeight: 'bold' }}
                        >
                            View on Facebook
                        </a>
                    </div>
                ))
            )}
        </div>
    );
};

export default News;