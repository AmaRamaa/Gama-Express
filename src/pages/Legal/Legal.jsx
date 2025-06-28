import React from 'react';
import { useTranslation } from 'react-i18next';
import '../../i18n';

const Legal = () => {
    const { t } = useTranslation();
    return (
        <div style={{ maxWidth: 800, margin: '40px auto', padding: '24px', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <h1>{t('legal.title', 'Legal Disclaimers')}</h1>
            <p>{t('legal.intro', 'The information provided by Gama Express on this website is for general informational purposes only. All information on the site is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.')}</p>
            <h2>{t('legal.noAdvice', 'No Professional Advice')}</h2>
            <p>{t('legal.noAdviceText', 'The site cannot and does not contain legal, financial, or other professional advice. Any information provided is for general informational and educational purposes only and is not a substitute for professional advice.')}</p>
            <h2>{t('legal.externalLinks', 'External Links Disclaimer')}</h2>
            <p>{t('legal.externalLinksText', 'The site may contain (or you may be sent through the site) links to other websites or content belonging to or originating from third parties. We do not investigate, monitor, or check such external links for accuracy, adequacy, validity, reliability, availability, or completeness.')}</p>
            <h2>{t('legal.limitation', 'Limitation of Liability')}</h2>
            <p>{t('legal.limitationText', 'Under no circumstance shall Gama Express have any liability to you for any loss or damage of any kind incurred as a result of the use of the site or reliance on any information provided on the site.')}</p>
            <h2>{t('legal.contact', 'Contact Us')}</h2>
            <p>{t('legal.contactText', 'If you have any questions regarding these disclaimers, please contact us at')} <a href="mailto:gamaexpress18@gama.com">gamaexpress18@gmail.com</a>.</p>
        </div>
    );
};

export default Legal;