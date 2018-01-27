require('dotenv').config()
const mailer = require('../src/server/mailer').default

let msg = ({ remind, remind_ago }) => ({
  substitutionWrappers: ['<%', '%>'],
  from: {
    email: 'applications@applynowleasing.com',
    name: 'ApplyNowLeasing'
  },
  to: 'juangab31@gmail.com',
  subject: `Lease Application Form ${remind ? 'Reminder' : 'Request'}`,
  templateId: '8213f595-e82a-428a-a220-3498142e528d',
  substitutions: {
    recipient: 'Juan Gabriel',
    sender: 'Tristyn Leos',
    address: '2314 Wickersham Ln 110',
    price: '900',
    application_url: 'https://www.google.com',
    decline_url: 'https://www.facebook.com',
    remind: remind ? 'Just a reminder ' : '',
    remind_ago: remind ? remind_ago : '',
  }
})

mailer.send(msg({ remind: false, remind_ago: ' about 3 days ago' }))