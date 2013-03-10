/**
 * Parser xml
 */
function XMLParser() {
	var self = this;

	self.ppEntityMinItemVO = function(Title, Text) {
		this.Title = Title;
		this.Text = Text;
	};

	self.ppEntityAttributes = function(EvaluationAndImprovementPage,
			IdentifyingAndSolvingPage, AboutPage, Local, WebAppUnlocked,
			Difficulty, Price, Icon, Bought) {
		this.EvaluationAndImprovementPage = EvaluationAndImprovementPage;
		this.IdentifyingAndSolvingPage = IdentifyingAndSolvingPage;
		this.AboutPage = AboutPage;
		this.Local = Local;
		this.WebAppUnlocked = WebAppUnlocked;
		this.Difficulty = Difficulty;
		this.Price = Price;
		this.Icon = Icon;
		this.Bought = Bought;
	};

	self.ppEntityData = function(PackageSetName, ProblemSets) {
		this.PackageSetName = PackageSetName;
		this.ProblemSets = ProblemSets;
	};

	self.ppEntityName = function(ProblemSetName, ExamSectionName, ExamName) {
		this.ProblemSetName = ProblemSetName;
		this.ExamSectionName = ExamSectionName;
		this.ExamName = ExamName;
	};

	self.problempackages = new Array();

	self.problempackageEntity = function(Attributes, Data, Name) {
		this.Attributes = Attributes;
		this.Data = Data;
		this.Name = Name;
	};

	self.examEntity = function() {
	};

	self.information = new Array();
	self.informationEntity = function(name, content) {
		this.name = name;
		this.content = content;
	};

	self.moduleinfo = function(examType, examSection, resetPassURL, ServerURL,
			SecureServerURL, appCode, moduleColor, mainMenu, websiteName,
			websiteURL, IntroPage,Developer) {
		this.examType = examType;
		this.examSection = examSection;
		this.resetPassURL = resetPassURL;
		this.ServerURL = ServerURL;
		this.SecureServerURL = SecureServerURL;
		this.appCode = appCode;
		this.moduleColor = moduleColor;
		this.mainMenu = mainMenu;
		this.websiteName = websiteName;
		this.websiteURL = websiteURL;
		this.IntroPage = IntroPage;
		this.Developer = Developer;
	};

	self.getProblemPackages = function(callback) {
		self.problempackages = new Array();
		
//		if (self.problempackages.length == 0) {
		if (0 == 0) {
			$.ajax({
				url : "active/problempackages.plist",
				type : 'GET',
				dataType : 'xml',
				success : function(xml) {
					var index=0;	
					
					$(xml).find("array").each(
							function() {
								if(index!=0)return;
								$(this).children().each(function(){
									var Attributes, Data, Name;
									$(this).children().each(function() {
										var node = $(this).text();
										if(node=="Attributes"){
											var EvaluationAndImprovementPage, IdentifyingAndSolvingPage, AboutPage, Local, WebAppUnlocked, Difficulty, Price, Icon, Bought;
											$(this).next().children().each(function(){
												var inode = $(this).text();
												if(inode=="EvaluationAndImprovementPage"){
													var title,text;
													$(this).next().children().each(function(){
														if($(this).text()=="Title"){
															title = $(this).next().text();
														}else if($(this).text()=="Text"){
															text = $(this).next().text();
														} 
													});
													EvaluationAndImprovementPage = new self.ppEntityMinItemVO(title,text);
												}else if(inode=="IdentifyingAndSolvingPage"){
													var title,text;
													$(this).next().children().each(function(){
														if($(this).text()=="Title"){
															title = $(this).next().text();
														}else if($(this).text()=="Text"){
															text = $(this).next().text();
														} 
													});
													IdentifyingAndSolvingPage = new self.ppEntityMinItemVO(title,text);
												}else if(inode=="AboutPage"){
													var title,text;
													$(this).next().children().each(function(){
														if($(this).text()=="Title"){
															title = $(this).next().text();
															
														}else if($(this).text()=="Text"){
															text = $(this).next().text();
														} 
													});
													AboutPage = new self.ppEntityMinItemVO(title,text);
												}else if(inode=="Local"){
													Local = $(this).next()[0].tagName; 
												}else if(inode=="WebAppUnlocked"){
													WebAppUnlocked = $(this).next()[0].tagName; 
												}else if(inode=="Difficulty"){
													Difficulty = $(this).next().text();
												}else if(inode=="Price"){
													Price = $(this).next().text();
												}else if(inode=="Icon"){
													Icon = $(this).next().text();
												}else if(inode=="Bought"){
													Bought = $(this).next()[0].tagName; 
												}
											});
											
											Attributes = new self.ppEntityAttributes(EvaluationAndImprovementPage, IdentifyingAndSolvingPage, AboutPage, Local, WebAppUnlocked, Difficulty, Price, Icon, Bought);
										}else if(node=="Data"){
											var PackageSetName,ProblemSets = new Array();
											
											$(this).next().children().each(function(){
												if($(this).text()=="PackageSetName"){
													PackageSetName = $(this).next().text();
												}else if($(this).text()=="ProblemSets"){
													$(this).next().children().each(function(){
														ProblemSets.push($(this).text());
													});
												} 
											});
											Data = new self.ppEntityData(PackageSetName, ProblemSets);
										}else if(node=="Name"){
											var ProblemSetName, ExamSectionName, ExamName;
											$(this).next().children().each(function(){
												if($(this).text()=="ProblemSetName"){
													ProblemSetName = $(this).next().text();
												}else if($(this).text()=="ExamSectionName"){
													ExamSectionName = $(this).next().text();
												}else if($(this).text()=="ExamName"){
													ExamName = $(this).next().text();
												} 
											});
											Name = new self.ppEntityName(ProblemSetName, ExamSectionName, ExamName);
										}
									});

									self.problempackages
											.push(new self.problempackageEntity(Attributes, Data, Name));
								});
								
								index++;
							});
					callback(self.problempackages);
				},
				error:function(XMLHttpRequest, textStatus, errorThrown){
					callback(self.problempackages);
				}
			});
		} else {
			callback(self.problempackages);
		}

	};

	/***************************************************************************
	 * var parser = new XMLParser(); parser.getmoduleinfo(function(moduleinfo) {
	 * var c = moduleinfo.examSection.length; for ( var i = 0; i < c; i++) { var
	 * vo = moduleinfo.examSection[i]; alert(vo.secName + ";" + vo.secNameShort +
	 * ";" + vo.secFile); }
	 * alert(moduleinfo.examType+"-"+moduleinfo.websiteURL+"::"+moduleinfo.examSection.length);
	 * });
	 */
	self.getmoduleinfo = function(callback) {

		if (self.moduleinfo) {
			$
					.ajax({
						url : "active/moduleinfo.plist",
						type : 'GET',
						dataType : 'xml',
						success : function(xml) {
							var c = 0;
							$(xml)
									.find("dict")
									.each(
											function() {
												if (c != 0)
													return;
												var examType, examSection, resetPassURL, ServerURL, SecureServerURL, appCode, moduleColor, mainMenu, websiteName, websiteURL, IntroPage;
												$(this)
														.children()
														.each(
																function() {
																	var nowTxt = $(
																			this)
																			.text();
																	if (nowTxt == "examType") {
																		examType = $(
																				this)
																				.next()
																				.text();
																	} else if (nowTxt == "resetPassURL") {
																		resetPassURL = $(
																				this)
																				.next()
																				.text();
																	} else if (nowTxt == "ServerURL") {
																		ServerURL = $(
																				this)
																				.next()
																				.text();
																	} else if (nowTxt == "SecureServerURL") {
																		SecureServerURL = $(
																				this)
																				.next()
																				.text();
																	} else if (nowTxt == "appCode") {
																		appCode = $(
																				this)
																				.next()
																				.text();
																	} else if (nowTxt == "websiteName") {
																		websiteName = $(
																				this)
																				.next()
																				.text();
																	} else if (nowTxt == "websiteURL") {
																		websiteURL = $(
																				this)
																				.next()
																				.text();
																	} else if (nowTxt == "IntroPage") {
																		IntroPage = $(
																				this)
																				.next()
																				.text();
																	}else if (nowTxt == "Developer") {
																		Developer = $(
																				this)
																				.next()
																				.text();
																	} else if (nowTxt == "examSection") {
																		examSection = new Array();
																		$(this)
																				.next()
																				.children()
																				.each(
																						function() {
																							var entity = new self.examEntity();
																							$(
																									this)
																									.children()
																									.each(
																											function() {
																												var txtType = $(
																														this)
																														.text();
																												// alert(txtType);
																												if (txtType == "secName") {
																													entity.secName = $(
																															this)
																															.next()
																															.text();
																												} else if (txtType == "secNameShort") {
																													entity.secNameShort = $(
																															this)
																															.next()
																															.text();
																												} else if (txtType == "secFile") {
																													entity.secFile = $(
																															this)
																															.next()
																															.text();
																												}
																											});
																							examSection
																									.push(entity);
																						});
																		// alert($(this).next().text());
																		// $(this).next().children().find("dict").each(function(){
																		// alert($(this).text());
																		// });
																	}
																});

												c++;
												self.moduleinfo = new self.moduleinfo(
														examType, examSection,
														resetPassURL,
														ServerURL,
														SecureServerURL,
														appCode, moduleColor,
														mainMenu, websiteName,
														websiteURL, IntroPage);

											});
							callback(self.moduleinfo);
						}
					});
		} else {
			callback(self.moduleinfo);
		}

	};

	/***************************************************************************
	 * Usage: var parser = new XMLParser();
	 * parser.getInformation(function(array) { for ( var i = 0; i <
	 * array.length; i++) alert(array[i].name); });
	 * 
	 * @param callback
	 */
	self.getInformation = function(callback) {
		if (self.information.length == 0) {
			$.ajax({
				url : "active/information.plist",
				type : 'GET',
				dataType : 'xml',
				success : function(xml) {

					$(xml).find("dict").each(
							function() {
								var name, content;
								var index = 0;
								$(this).find("string").each(function() {
									if (index == 0) {
										content = $(this).text();
									} else {
										name = $(this).text();
									}
									index++;
								});

								self.information
										.push(new self.informationEntity(name,
												content));

							});
					callback(self.information);
				}
			});
		} else {
			callback(self.information);
		}

	};

	return self;
}