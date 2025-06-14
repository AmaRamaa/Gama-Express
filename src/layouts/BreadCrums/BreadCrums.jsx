import { Link, useLocation } from 'react-router-dom';

const breadcrumbNameMap = {
    '/': 'Home',
    '/catalog': 'Catalog',
    '/catalog/:manufacturer': 'Manufacturer',
    '/catalog/:category/:subcategory/:product': 'Product Details',
    '/testing': 'Testing',
};

function getBreadcrumbs(location) {
    const pathnames = location.pathname.split('/').filter(x => x);
    if (pathnames.length === 0) {
        return [{ name: 'Home', url: '/' }];
    }
    const crumbs = pathnames.map((_, idx) => {
        const url = '/' + pathnames.slice(0, idx + 1).join('/');
        return {
            name: breadcrumbNameMap[url] || decodeURIComponent(pathnames[idx]),
            url,
        };
    });
    return [ ...crumbs];
}

export default function Breadcrumbs() {
    const location = useLocation();
    const breadcrumbs = getBreadcrumbs(location);

    return (
        <nav
            style={{
                padding: '16px 24px',
                background: '#f8f9fa',
                borderRadius: '8px',
                fontFamily: 'Segoe UI, Arial, sans-serif',
                fontSize: '1rem',
                margin: '16px 0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                display: 'flex',
                alignItems: 'center',
            }}
            aria-label="breadcrumb"
        >
            {breadcrumbs.map((crumb, idx) => {
                const isLast = idx === breadcrumbs.length - 1;
                let displayName = crumb.name;

                // If this is the model breadcrumb (e.g. /catalog/AUDI/A3-2017-2020-ALLROAD)
                if (
                    crumb.url.startsWith('/catalog/') &&
                    idx >= 2 && // 0: catalog, 1: manufacturer, 2: model
                    crumb.name &&
                    crumb.name.includes('-')
                ) {
                    const modelParts = crumb.name.split('-');
                    displayName = modelParts.length > 1
                        ? `${modelParts[0]} (${modelParts.slice(1).join(' ')})`
                        : crumb.name;
                }

                return (
                    <span key={crumb.url} style={{ display: 'flex', alignItems: 'center' }}>
                        {idx > 0 && (
                            <span style={{ margin: '0 8px', color: '#b0b0b0' }}>/</span>
                        )}
                        {isLast ? (
                            <span
                                style={{
                                    color: '#222',
                                    fontWeight: 600,
                                    cursor: 'default',
                                    textDecoration: 'underline',
                                    textUnderlineOffset: '4px',
                                }}
                                aria-current="page"
                            >
                                {displayName}
                            </span>
                        ) : (
                            <Link
                                to={crumb.url}
                                style={{
                                    color: '#888',
                                    textDecoration: 'none',
                                    pointerEvents: 'auto',
                                    transition: 'color 0.2s',
                                }}
                                tabIndex={0}
                            >
                                {displayName}
                            </Link>
                        )}
                    </span>
                );
            })}
        </nav>
    );
}
