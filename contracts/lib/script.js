/**
 * DESCRIPTION
 */

var NS = 'org.acme.model';

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
	emitAccessRightEvent(newAccessRight, CreateAccessRight);
     });
}

/**
 * 	
 */
function emitAccessRightEvent(newAR, CreateAR) {
    var factory = getFactory();
    let accessRightEvent = factory.newEvent(NS, 'AccessRightEvent');
  	accessRightEvent.accessRightHash = newAR.accessRightHash;
  	accessRightEvent.prosumerID = newAR.dataOwner.prosumerID;
  	accessRightEvent.retailerID = newAR.dataHolder.retailerID;
    accessRightEvent.expiryDate = newAR.expiryDate;
    accessRightEvent.accessRightStatus = "PENDING";
    accessRightEvent.dataSource = CreateAR.dataSource;
    accessRightEvent.creator = CreateAR.creator;
  	emit(accessRightEvent); 
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
  let retailerRegistry = await getParticipantRegistry(NS + '.Retailer');
  let retailer = factory.newResource(NS, 'Retailer', '2');
  await retailerRegistry.addAll([retailer]);
  let proSumerRegistry = await getParticipantRegistry(NS + '.ProSumer');
  let proSumer = factory.newResource(NS, 'ProSumer', '2');
  await proSumerRegistry.addAll([proSumer]);
  createAccessRightAssets(proSumer, retailer);
}

/**
 * 	
 */
async function createAccessRightAssets(pro, ret){
  let factory = getFactory();
  let accessRightRegistry = await getAssetRegistry(NS + '.AccessRight');
  let accessRight = factory.newResource(NS, 'AccessRight', '2');
  accessRight.accessCount = 0;
  accessRight.accessRightStatus = "APPROVED";
  accessRight.dataHolder = ret;
  accessRight.dataOwner = pro;
  accessRight.creator = pro;
  accessRight.dataSource = "P1";
  accessRight.expiryDate = "hello";
  await accessRightRegistry.addAll([accessRight]);
}

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





