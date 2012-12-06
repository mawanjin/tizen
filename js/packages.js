/**
 * 
 * @param _id
 * @param _title
 * @param _text
 * @param _packageSetName
 * @param _problemSets
 *            array of probelmId
 * @param _sectionName
 * @param _price
 * @param _icon
 */
function packageItem(_id, _title, _text, _packageSetName, _problemSets,
		_sectionName, _price, _icon, _difficulty) {
	var self = this;

	self.id = _id;
	self.title = _title;
	self.text = _text;
	self.packageSetName = _packageSetName;
	self.problemSets = _problemSets;
	self.sectionName = _sectionName;
	self.price = _price;
	self.icon = _icon;
	self.difficulty = _difficulty;
	return self;
}
var allPackageItems = new Array();
/**
 * Get all packageItem data for index package list.
 */
function getAllPackageItems(callback) {
	if (allPackageItems.length > 0)
		return result;
	
	var parser = new XMLParser();
	parser
			.getProblemPackages(function(problempackage) {
				
				for ( var i = 0; i < problempackage.length; i++) {
					var o = problempackage[i];
					allPackageItems.push(new packageItem(1,
							o.Attributes.AboutPage.Title,
							o.Attributes.AboutPage.Text, o.Data.PackageSetName,
							o.Data.ProblemSets, o.Name.ExamSectionName,
							o.Attributes.Price,
							o.Attributes.Icon,
							o.Attributes.Difficulty));
				}
				callback(allPackageItems);
			});
}

/**
 * 
 * @param sectionName short section name
 * @returns {Array}
 */
function getPackageItemsBySectionName(sectionName,callback) {
	var resultBySectionName = new Array();
	
	var parser = new XMLParser();
	parser.getProblemPackages(function(problempackage) {

		for ( var i = 0; i < problempackage.length; i++) {
			var o = problempackage[i];
			
			if(o.Name.ExamSectionName==sectionName||o.Name.ExamSectionName=="ALL")
				resultBySectionName.push(new packageItem(1, o.Attributes.AboutPage.Title,
					o.Attributes.AboutPage.Text, o.Data.PackageSetName,
					o.Data.ProblemSets, o.Name.ExamSectionName,
					o.Attributes.AboutPage.Price, o.Attributes.AboutPage.Icon,
					o.Attributes.AboutPage.Difficulty));
		}
		
		callback(resultBySectionName);

	});
}








