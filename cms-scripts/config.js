const KenticoContent = require('@kentico/kontent-delivery');

const deliveryClient = new KenticoContent.DeliveryClient({
    projectId: '<your_project_id>',
});

exports.deliveryClient = deliveryClient;