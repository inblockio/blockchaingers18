/**
 * DESCRIPTION
 */

const NS = 'org.acme.model';

async function removeAllByResource(ns, func) {
 	let reg = await func(ns);
  	let items = await reg.getAll();
  	console.log("removeAll:items: ", items)
  	await reg.removeAll(items);
}
     
/**
 * 	
 */
async function removeAll() {
  await removeAllByResource(NS+'.AccessRight', getAssetRegistry);
  await removeAllByResource(NS+'.ProSumer', getParticipantRegistry);
  await removeAllByResource(NS+'.Retailer', getParticipantRegistry);
}

/**
 * @param {org.acme.model.RevokeAccessRight} RevokeAccessRight
 * @transaction
 */
async function RevokeAccessRight(RevokeAccessRight){
  let factory = getFactory();
  let accessRight = RevokeAccessRight.accessRight;
  accessRight.accessRightStatus = "REVOKED";
  let accessRightRegistry = await getAssetRegistry(NS+'.AccessRight');
  await accessRightRegistry.update(accessRight);
   
  let accessRightEvent = factory.newEvent(NS, 'AccessRightEvent');
  accessRightEvent.accessRightHash = accessRight.accessRightHash;
  accessRightEvent.prosumerID = accessRight.dataOwner.prosumerID;
  accessRightEvent.retailerID = accessRight.dataHolder.retailerID;
  accessRightEvent.expiryDate = accessRight.expiryDate;
  accessRightEvent.accessRightStatus = "REVOKED";
  accessRightEvent.dataSource = accessRight.dataSource;
  accessRightEvent.creator = accessRight.creator;
  emit(accessRightEvent);
}

/**
 * @param {org.acme.model.CreateAccessRight} CreateAccessRight
 * @transaction
 */
function createAccessRight(CreateAccessRight){
  return getAssetRegistry(NS+'.AccessRight')
    .then(function(result) {
    	var factory = getFactory();
    
    	var newAccessRight = factory.newResource(NS, 'AccessRight', CreateAccessRight.accessRightHash);
    	newAccessRight.dataOwner = CreateAccessRight.dataOwner;
   		newAccessRight.dataHolder = CreateAccessRight.dataHolder;
        newAccessRight.accessRightStatus = "PENDING";
        newAccessRight.expiryDate = CreateAccessRight.expiryDate;
        newAccessRight.creator = CreateAccessRight.creator;
    	newAccessRight.dataSource = CreateAccessRight.dataSource;
		result.add(newAccessRight);
    
  		let accessRightEvent = factory.newEvent(NS, 'AccessRightEvent');
  		accessRightEvent.accessRightHash = newAccessRight.accessRightHash;
  		accessRightEvent.prosumerID = newAccessRight.dataOwner.prosumerID;
  		accessRightEvent.retailerID = newAccessRight.dataHolder.retailerID;
        accessRightEvent.expiryDate = newAccessRight.expiryDate;
        accessRightEvent.accessRightStatus = "PENDING";
    	accessRightEvent.dataSource = CreateAccessRight.dataSource;
        accessRightEvent.creator = CreateAccessRight.creator;
  		emit(accessRightEvent);
        
     });
}

/**
 * @param {org.acme.model.RespondAccessRight} RespondAccessRight
 * @transaction
 */
async function respondAccessRight(RespondAccessRight){
  let accessRightRegistry = await getAssetRegistry(NS+'.AccessRight');
  let accessRight = await accessRightRegistry.get(RespondAccessRight.accessRightHash);
  let factory = getFactory();
  let accessRightEvent = factory.newEvent(NS, 'AccessRightEvent');
  accessRightEvent.accessRightHash = RespondAccessRight.accessRightHash;
  accessRightEvent.prosumerID = RespondAccessRight.dataOwner.prosumerID;
  accessRightEvent.retailerID = RespondAccessRight.dataHolder.retailerID;
  accessRightEvent.accessRightStatus = RespondAccessRight.status;
  accessRightEvent.expiryDate = accessRight.expiryDate;
  accessRightEvent.creator = RespondAccessRight.creator;
  accessRightEvent.dataSource = accessRight.dataSource;
  emit(accessRightEvent);
  
  accessRight.accessRightStatus = RespondAccessRight.status;
  await accessRightRegistry.update(accessRight);
}

/**
*  Build basic system
* @param {org.acme.model.Initialize} tx - the transaction
* @transaction
*/
async function initialize(tx) {
  await removeAll();
  let factory = getFactory();
  
  console.log("Retailer");
  let retailerRegistry = await getParticipantRegistry(NS + '.Retailer');
  let retailer = factory.newResource(NS, 'Retailer', '2');
  await retailerRegistry.addAll([retailer]);
  
  console.log("ProSumer");
  let proSumerRegistry = await getParticipantRegistry(NS + '.ProSumer');
  let proSumer = factory.newResource(NS, 'ProSumer', '2');
  await proSumerRegistry.addAll([proSumer]);
  
  // add accessright
  console.log("AccessRight");
  let accessRightRegistry = await getAssetRegistry(NS + '.AccessRight');
  let accessRight = factory.newResource(NS, 'AccessRight', '2');
  accessRight.accessCount = 0;
  accessRight.accessRightStatus = "APPROVED";
  accessRight.dataHolder = retailer;
  accessRight.dataOwner = proSumer;
  accessRight.creator = proSumer;
  accessRight.dataSource = "P1";
  accessRight.expiryDate = "hello";
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
  	return accessRightRegistry.update(accessRight);})
  .then(function() {
    let factory = getFactory();
    let evt = factory.newEvent(NS, 'AccessEvent');
    evt.prosumerID = accessRight.dataOwner.prosumerID;
    evt.retailerID = accessRight.dataHolder.retailerID;
    evt.accessRightHash = accessRight.Id;
    // @todo add access right hash
    emit(evt);
  })
}





