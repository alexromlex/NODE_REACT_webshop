import sequelize from './connect.js';
import SettingsService from '../services/settingsService.js';
import UserService from '../services/userService.js';

const defaultSettings = [
  { name: 'general_terms', value: '' },
  { name: 'privacy_policy', value: '' },
  { name: 'header_img', value: '/b-logo.gif' },
  { name: 'header_name', value: 'WEBSHOP' },
  { name: 'billing_fullname', value: '' },
  { name: 'billing_country', value: '' },
  { name: 'billing_index', value: '' },
  { name: 'billing_city', value: '' },
  { name: 'billing_street', value: '' },
  { name: 'billing_tax', value: '' },
  { name: 'billing_bank_name', value: '' },
  { name: 'billing_bank_account', value: '' },
  { name: 'billing_bank_info', value: '' },
];

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('>>> DB authenticated');
    
    await sequelize.sync();
    console.log('>>> DB synced');

    await new SettingsService().createSettings(defaultSettings);
    console.log('>>> Default settings created');

    await new UserService().create(process.env.ADMIN_USER_EMAIL!, process.env.ADMIN_USER_PASS!, 'ADMIN');
    console.log('>>> Admin user created');
    
    console.log('>>> Database seeded');
    process.exit(0);
  } catch (error) {
    console.error('>>> Seeding failed:', error);
    process.exit(1);
  }
}

seed();