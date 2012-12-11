var fileutil = {};

fileutil = new function() {
	
	this.onMediaFolderArraySuccess = function(folders) {
		console.log('Folders found...');
		var mediaSource = tizen.mediacontent.getLocalMediaSource();
		//IMAGE
	    for ( var i in folders) {
	       console.log('Folder name: ' + folders[i].title);
	       console.log('Folder URI: ' + folders[i].folderURI);
	       console.log('Folder TYPE: ' + folders[i].storageType );
	       try {
	            mediaSource.findItems( browseItemsInFolder, this.onError, folders[i].id);
	         } catch(error) {
	            this.onError(error);
	         }
	    }
		
	};
	
	this.imageItems;
	
	this.onError = function(e){
		console.log('Error: ' + e.message);
	};
	
	this.getAllImages = function(){
		console.log("getAllImages() called");
		imageItems = new Array();
		var source = null;

		try {
			source = tizen.mediacontent.getLocalMediaSource();
		} catch (exc) {
			console.log('tizen.mediacontent.getLocalMediaSource() exception:'
					+ exc.message);
			return;
		}
 
		console.log('Searching for all folders...');
		try {
			source.getFolders(this.onMediaFolderArraySuccess, this.onError);
		} catch (exc) {
			console.log('getFolders() exception:' + exc.message);
		}
		
		return imageItems;
	};

	this.getFoldersList = function() {
		var source = null;

		try {
			source = tizen.mediacontent.getLocalMediaSource();
		} catch (exc) {
			console.log('tizen.mediacontent.getLocalMediaSource() exception:'
					+ exc.message);
			return;
		}
 
		console.log('Searching for all folders...');
		try {
			source.getFolders(this.onMediaFolderArraySuccess, this.onError);
		} catch (exc) {
			console.log('getFolders() exception:' + exc.message);
		}
	};
	
	this.inspectImage = function(item) {
		try {
			console.log('Item width: ' + item.width);
			console.log('Item height: ' + item.height);
			console.log('Item location, latitude: ' + item.geolocation.latitude);
			console.log('Item location, longitude: ' + item.geolocation.longitude);
	        } catch (e) {
			this.onError(e);
		}
	}
	
	
	function getSelectedItemDetails() {
	    try {
	        mediaSource = tizen.mediacontent.getLocalMediaSource();
	        console.log('Searching for item...');
	        mediaSource.findItems(onMediaItemArraySuccess, this.onError);
	    } catch (e) {
	        this.onError(e);
	    }
	}
	
	function browseItemsInFolder(items) {
		console.log('Looking for items in a folder');
	    items.forEach(print);
	}
	
	function print(item) {
		if("IMAGE"==item.type)
			imageItems.push(item);
		console.log('=======================================================');
		console.log('Item name: ' + item.title);
        console.log('Item URI: ' + item.itemURI);
        console.log('Item thumbnailURIs: ' + item.thumbnailURIs);
        
        console.log('Item type: ' + item.type);
        console.log('Item identifier: ' + item.id);
        console.log('Item mimeType: ' + item.mimeType);
        console.log('Item releaseDate: ' + item.releaseDate);
        console.log('Item modifiedDate: ' + item.modifiedDate);
        console.log('Item description: ' + item.description);
        console.log('Item rating: ' + item.rating);
	} 

};