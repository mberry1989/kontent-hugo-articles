const KenticoContent = require('@kentico/kontent-delivery');
require('dotenv').config()

const deliveryClient = new KenticoContent.DeliveryClient({
    projectId: process.env.PROJECT_ID,
});

exports.deliveryClient = deliveryClient;