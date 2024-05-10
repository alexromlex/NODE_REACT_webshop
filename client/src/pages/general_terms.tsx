import { useEffect, useState } from 'react';
import { getGenTermsSettings } from '../api/settingsApi';
import HtmlPageComponent from '../components/HtmlPage';

const TermsConditionsPage = () => {
    const [data, setData] = useState('');
    useEffect(() => {
        getGenTermsSettings().then(({ data }) => {
            setData(data);
        });
    }, []);
    return <HtmlPageComponent title="General Terms and Conditions" data={data} />;
};

export default TermsConditionsPage;
