/**
 * DESCRIPTION
 */

/**
 * @param {org.acme.model.CreateIntent} CreateIntent
 * @transaction
 */

var NS = 'org.acme.model';

function createIntent(CreateIntent){
  return getAssetRegistry('org.acme.model.Intent')
    .then(function(result) {
        console.log('Create new intent asset');
    	var factory = getFactory();
    	var newIntent = factory.newResource('org.acme.model', 'Intent', CreateIntent.intentHash);
    	newIntent.dataOwner = CreateIntent.dataOwner;
   		newIntent.dataHolder = CreateIntent.dataHolder;
        newIntent.intentStatus = "EXPRESSED";
  		let intentEvent = factory.newEvent('org.acme.model', 'IntentEvent');
  		intentEvent.intentHash = newIntent.intentHash;
  		intentEvent.prosumerID = newIntent.dataOwner.prosumerID;
  		intentEvent.retailerID = newIntent.dataHolder.retailerID;
        intentEvent.intentStatus = "EXPRESSED";
  		emit(intentEvent);
        return result.add(newIntent);
     });
}

/**
 * @param {org.acme.model.ApproveIntent} ApproveIntent
 * @transaction
 */
async function approveIntent(ApproveIntent){
  let intentRegistry = await getAssetRegistry('org.acme.model.Intent');
  let intent = await intentRegistry.get(ApproveIntent.intentHash);
  let factory = getFactory();
  let intentEvent = factory.newEvent('org.acme.model', 'IntentEvent');
  intentEvent.intentHash = ApproveIntent.intentHash;
  intentEvent.prosumerID = ApproveIntent.dataOwner.prosumerID;
  intentEvent.retailerID = ApproveIntent.dataHolder.retailerID;
  intentEvent.intentStatus = "APPROVED";
  emit(intentEvent);
  intent.intentStatus = "APPROVED";
  await intentRegistry.update(intent);
}

/**
*  Build basic system
* @param {org.acme.model.Initialize} tx - the transaction
* @transaction
*/
async function initialize(tx) {
  let factory = getFactory();
  let retailerRegistry = await getParticipantRegistry(NS + '.Retailer');
  let retailer = factory.newResource(NS, 'Retailer', 'ret#1');
  let proSumerRegistry = await getParticipantRegistry(NS + '.ProSumer');
  let proSumer = factory.newResource(NS, 'ProSumer', 'pro#1');
  await retailerRegistry.addAll([retailer]);
  await proSumerRegistry.addAll([proSumer]);
  
  // add accessright
  let accessRightRegistry = await getAssetRegistry(NS + '.AccessRight');
  let accessRight = factory.newResource(NS, 'AccessRight', 'ar#1');
  accessRight.accessCount = 0;
  accessRight.dataHolder = retailer;
  accessRight.dataOwner = proSumer;
  await accessRightRegistry.addAll([accessRight]);
};



/**
*  Track a access event
* @param {org.acme.model.TrackAccess} tx - the transaction
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
    evt.prosumerID = accessRight.dataOwner.prosumerID;
    evt.retailerID = accessRight.dataHolder.retailerID;
    evt.accessRightId = accessRight.Id;
    emit(evt);
  })
}





