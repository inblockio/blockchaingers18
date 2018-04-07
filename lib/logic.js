var NS = 'io.inblock.blockchaingers18';
/**
*  Build basic system
* @param {io.inblock.blockchaingers18.Initialize} tx - the transaction
* @transaction
*/
async function initialize(tx) {
  // add retailer user
  let factory = getFactory();
  let userRegistry = await getParticipantRegistry(NS + '.User');
  let retailer = factory.newResource(NS, 'User', 'ret#1');
  retailer.role = 'retailer';
  
  
  
  let prosumer = factory.newResource(NS, 'User', 'pro#1');
  prosumer.role = 'prosumer';
  await userRegistry.addAll([retailer, prosumer]);
  
  
  
  // add accessright
  let accessRightRegistry = await getAssetRegistry(NS + '.AccessRight');
  let accessRight = factory.newResource(NS, 'AccessRight', 'ar#1');
  accessRight.accessCount = 0;
  accessRight.consumer = retailer;
  accessRight.owner = prosumer;
  await accessRightRegistry.addAll([accessRight]);
};



/**
*  Track a access event
* @param {io.inblock.blockchaingers18.TrackAccess} tx - the transaction
* @transaction
*/
function trackAccess(tx) {
  let accessRight = tx.accessRight;
  accessRight.accessCount++;
  return getAssetRegistry(NS + '.AccessRight')
  .then(function(accessRightRegistry) {
  	return accessRightRegistry.update(accessRight);
  })
  .then(function() {
    let factory = getFactory();
    let evt = factory.newEvent(NS, 'AccessEvent');
    evt.consumerId = accessRight.consumer.id;
    evt.ownerId = accessRight.owner.id;
    evt.accessRightId = accessRight.Id;
    emit(evt);
  })
}


