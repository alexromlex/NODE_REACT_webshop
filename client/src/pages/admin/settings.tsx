import { useEffect, useRef, useState } from 'react';
import { Button, Card, Container, Form, InputGroup } from 'react-bootstrap';
import { Editor } from '@tinymce/tinymce-react';
import adminStore from '../../stores/adminStore';
import { observer } from 'mobx-react-lite';
import mainStore from '../../stores/mainStore';
import { updateSettings } from '../../api/settingsApi';
import { uuid4 } from '../../common/utils';
import userStore from '../../stores/userStore';

const SettingsPage = () => {
  const general_termsRef = useRef(null);
  const privacy_policyRef = useRef(null);
  const [settings, setSettings] = useState(adminStore.settings);

  const tynimceItinsettings = {
    height: 500,
    menubar: true,
    license_key: 'gpl',
    plugins: [
      'accordion',
      'advlist',
      'anchor',
      'autolink',
      'autoresize',
      'charmap',
      'code',
      'lists',
      'link',
      'image',
      'preview',
      'anchor',
      'searchreplace',
      'visualblocks',
      'code',
      'fullscreen',
      'insertdatetime',
      'table',
    ],
    toolbar:
      'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify  | table | bullist numlist outdent indent | removeformat',
    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
  };

  const SaveHandler = () => {
    const toUpdate: {
      name: string;
      value: string;
    }[] = [];
    for (const [key, val] of Object.entries(settings)) {
      if (val !== adminStore.settings.key) {
        toUpdate.push({ name: key, value: String(val) });
      }
    }
    if (settings.privacy_policy !== privacy_policyRef.current!.value)
      toUpdate.push({ name: 'privacy_policy', value: privacy_policyRef.current!.getContent() });
    if (settings.general_terms !== general_termsRef.current!.value)
      toUpdate.push({ name: 'general_terms', value: general_termsRef.current!.getContent() });

    updateSettings(toUpdate)
      .then(() => {
        userStore.addToast({
          id: uuid4(),
          style: 'success',
          delay: 1500,
          title: 'SUCCESS',
          body: 'Settings Hase been saved!',
        });
      })
      .catch((error) => {
        console.error(error);
        userStore.addToast({
          id: uuid4(),
          style: 'warning',
          delay: 1500,
          title: 'ERROR',
          body: `Can't save settings!, See logs...`,
        });
      });
  };
  useEffect(() => {
    adminStore.getSettings().then((resp) => {
      adminStore.setSettings(Object.fromEntries(resp.data.settings.map(({ name, value }) => [name, value])));
      setSettings(Object.fromEntries(resp.data.settings.map(({ name, value }) => [name, value])));
    });
  }, []);

  const setValueHandler = (key: string, value: string | number) => {
    const a = {};
    a[key] = String(value);
    setSettings({ ...settings, ...a });
  };

  return (
    <>
      {Object.keys(settings).length === 0 ? (
        <Container fluid className="p-3 m-0">
          No settings!
        </Container>
      ) : (
        <>
          <h4>Settings</h4>
          <Card className="p-0 m-0 mb-3">
            <Card.Header className="fw-bold">Website Header</Card.Header>
            <Card.Body>
              <InputGroup className="mb-3">
                <InputGroup.Text>Image header URL:</InputGroup.Text>
                <Form.Control
                  type="text"
                  value={settings.header_img ? settings.header_img : ''}
                  onChange={(e) => {
                    setValueHandler('header_img', e.target.value);
                  }}
                  maxLength={300}
                />
              </InputGroup>
              <InputGroup className="mb-3">
                <InputGroup.Text>Header name:</InputGroup.Text>
                <Form.Control
                  required
                  type="text"
                  maxLength={30}
                  value={settings.header_name ? settings.header_name : ''}
                  onChange={(e) => {
                    setValueHandler('header_name', e.target.value);
                    mainStore.setHeaderName(e.target.value);
                  }}
                />
              </InputGroup>
            </Card.Body>
          </Card>
          <Card className="p-0 m-0 mb-3">
            <Card.Header className="fw-bold">Billing data</Card.Header>
            <Card.Body>
              <InputGroup className="mb-3">
                <InputGroup.Text>Company name:</InputGroup.Text>
                <Form.Control
                  onChange={(e) => {
                    setValueHandler('billing_fullname', e.target.value);
                  }}
                  value={settings.billing_fullname ? settings.billing_fullname : ''}
                  required
                  type="text"
                  maxLength={300}
                />
              </InputGroup>
              <InputGroup className="mb-3">
                <InputGroup.Text>Country:</InputGroup.Text>
                <Form.Control
                  onChange={(e) => {
                    setValueHandler('billing_country', e.target.value);
                  }}
                  value={settings.billing_country ? settings?.billing_country : ''}
                  required
                  type="text"
                  maxLength={300}
                />
              </InputGroup>
              <InputGroup className="mb-3">
                <InputGroup.Text>Zip code (index):</InputGroup.Text>
                <Form.Control
                  onChange={(e) => {
                    setValueHandler('billing_index', e.target.value);
                  }}
                  value={settings.billing_index ? settings.billing_index : ''}
                  required
                  type="text"
                  maxLength={300}
                />
              </InputGroup>
              <InputGroup className="mb-3">
                <InputGroup.Text>City / Town:</InputGroup.Text>
                <Form.Control
                  onChange={(e) => {
                    setValueHandler('billing_city', e.target.value);
                  }}
                  value={settings.billing_city ? settings.billing_city : ''}
                  required
                  type="text"
                  maxLength={300}
                />
              </InputGroup>
              <InputGroup className="mb-3">
                <InputGroup.Text>Street & number:</InputGroup.Text>
                <Form.Control
                  onChange={(e) => {
                    setValueHandler('billing_street', e.target.value);
                  }}
                  value={settings.billing_street ? settings?.billing_street : ''}
                  required
                  type="text"
                  maxLength={300}
                />
              </InputGroup>
              <InputGroup className="mb-3">
                <InputGroup.Text>Tax number:</InputGroup.Text>
                <Form.Control
                  onChange={(e) => {
                    setValueHandler('billing_tax', e.target.value);
                  }}
                  value={settings.billing_tax ? settings.billing_tax : ''}
                  required
                  type="text"
                  maxLength={300}
                />
              </InputGroup>
            </Card.Body>
          </Card>
          <Card className="p-0 m-0 mb-3">
            <Card.Header className="fw-bold">Bank information</Card.Header>
            <Card.Body>
              <InputGroup className="mb-3">
                <InputGroup.Text>Bank name:</InputGroup.Text>
                <Form.Control
                  onChange={(e) => {
                    setValueHandler('billing_bank_name', e.target.value);
                  }}
                  value={settings.billing_bank_name ? settings.billing_bank_name : ''}
                  required
                  type="text"
                  maxLength={300}
                />
              </InputGroup>
              <InputGroup className="mb-3">
                <InputGroup.Text>Bank account number:</InputGroup.Text>
                <Form.Control
                  onChange={(e) => {
                    setValueHandler('billing_bank_account', e.target.value);
                  }}
                  value={settings.billing_bank_account ? settings.billing_bank_account : ''}
                  required
                  type="text"
                  maxLength={300}
                />
              </InputGroup>
              <InputGroup className="mb-3">
                <InputGroup.Text>Bank addition info:</InputGroup.Text>
                <Form.Control
                  onChange={(e) => {
                    setValueHandler('billing_bank_info', e.target.value);
                  }}
                  value={settings.billing_bank_info ? settings.billing_bank_info : ''}
                  as="textarea"
                  maxLength={600}
                />
              </InputGroup>
            </Card.Body>
          </Card>
          <Card className="p-0 m-0 mb-3">
            <Card.Header className="fw-bold">Privacy & Data Protection</Card.Header>
            <Card.Body>
              <Editor
                tinymceScriptSrc={'/tinymce/tinymce.min.js'}
                onInit={(evt, editor) => (privacy_policyRef.current = editor)}
                initialValue={settings?.privacy_policy}
                init={tynimceItinsettings}
              />
            </Card.Body>
          </Card>
          <Card className="p-0 m-0 mb-3">
            <Card.Header className="fw-bold">General Terms and Conditions</Card.Header>
            <Card.Body>
              <Editor
                tinymceScriptSrc={'/tinymce/tinymce.min.js'}
                onInit={(evt, editor) => (general_termsRef.current = editor)}
                initialValue={settings?.general_terms}
                init={tynimceItinsettings}
              />
            </Card.Body>
          </Card>
          <div className="d-grid gap-2 d-sm-flex justify-content-sm-end">
            <Button onClick={SaveHandler} className="align-end">
              Save changes
            </Button>
          </div>
        </>
      )}
    </>
  );
};

export default observer(SettingsPage);
