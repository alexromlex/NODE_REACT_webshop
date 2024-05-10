import { useEffect, useState } from 'react';
import { getPrivacyCondSettings } from '../api/settingsApi';
import HtmlPageComponent from '../components/HtmlPage';

const PrivacyPolicyPage = () => {
    const [data, setData] = useState('');
    useEffect(() => {
        getPrivacyCondSettings().then(({ data }) => {
            setData(data);
        });
    }, []);
    return <HtmlPageComponent title="Privacy Policy and Right of Withdrawal Policy" data={data} />;
};

export default PrivacyPolicyPage;
