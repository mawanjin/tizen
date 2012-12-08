/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

/**
 * DBManager class for storing and retrieving data from, and managing, the
 * shopping list application's database.
 */
function DBManager() {
	var self = this;

	// create statement
	self.createIphoneExAppsStatement = 'CREATE TABLE "iphone_ex_apps" ("id" int(11)  DEFAULT "0","section" varchar(255),"subsection" varchar(255),"name" varchar(255) NOT NULL,"date" datetime NOT NULL DEFAULT "0000-00-00 00:00:00","duration" int(5)  DEFAULT "0","solving_title" varchar(255) DEFAULT NULL,"evaluation_title" varchar(255) DEFAULT NULL,"price" double(11,2) DEFAULT NULL,"total_time" int(11) DEFAULT NULL,"difficulty" int(2)  DEFAULT NULL,"video_url" varchar(255) DEFAULT NULL);';
	self.createExAppPages = 'CREATE TABLE "iphone_ex_app_pages" ("id" int(11)  DEFAULT "0","ex_app_id" int(11) ,"content" text,"idx" int(5)  DEFAULT NULL,"date" datetime NOT NULL DEFAULT "0000-00-00 00:00:00","solving" tinyint(1)  DEFAULT "1");';
	self.createQuestionsStatement = 'CREATE TABLE "iphone_questions" ("id" int(11)  DEFAULT "0","ex_app_id" int(11) ,"name" varchar(255) DEFAULT NULL,"difficulty" int(2) DEFAULT NULL,"text_block1a" text,"text_block1b" text,"text_block1c" text,"text_block1d" text,"image" varchar(255) DEFAULT NULL,"question_stem_a" text,"answer1_a" text,"answer2_a" text,"answer3_a" text,"answer4_a" text,"answer5_a" text,"answer6_a" text,"hint1" text,"video2" text,"video1" text,"solution" varchar(50) DEFAULT NULL,"solution_text" text,"solution_text1" text,"solution_text2" text,"solution_text3" text,"solution_text4" text,"solution_text5" text,"date" datetime NOT NULL DEFAULT "0000-00-00 00:00:00","idx" int(5) ,"pt_id" int(11) DEFAULT NULL,"pt_section" tinyint(2) DEFAULT NULL,"pt_qid" tinyint(4) DEFAULT NULL,"pt_group_first" tinyint(4) DEFAULT NULL,PRIMARY KEY ("id"));';
	self.createBookmark = 'CREATE TABLE bookmark( id integer primary key,ex_app_id integer,question_id integer,position integer,title text,date text);';
	self.createExamResultInfo = 'CREATE TABLE exam_result_info( id integer primary key,ex_app_id integer,ex_app_name text,score integer,finish text,progress integer,start_time text,end_time text, question_count text,section text);';
	self.createquestionExamResultInfo = 'CREATE TABLE question_exam_result_info( id integer primary key,ex_app_id integer,question_id integer,choice text,correctChoice text,mark text);';
	// self.createQuestionWorkspaceNotes = 'CREATE TABLE
	// question_workspace_notes( id integer primary key,ex_app_id integer,
	// question_id integer, note text);';

	// insert statement

	self.insertIphoneExAppsStatement = 'insert into iphone_ex_apps values(?,?,?,?,?,?,?,?,?,?,?,?)';
	self.insertIphoneExAppPagesStatement = 'insert into iphone_ex_app_pages values(?,?,?,?,?,?);';
	self.insertIphoneQuestionsStatement = 'insert into iphone_questions values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';

	self.insertBookmarkStatement = "insert into  bookmark(ex_app_id,question_id,position,title,date) values (?,?,?,?,?);";
	self.insertExamResultInfoStatement = 'insert into exam_result_info(ex_app_id,ex_app_name,score,finish,progress,start_time,end_time,question_count,section) values(?,?,?,?,?,?,?,?,?);';
	self.insertquestionExamResultInfoStatement = 'insert into  question_exam_result_info(ex_app_id,question_id,choice,correctChoice,mark) values(?,?,?,?,?);';
	self.insertQuestionWorkSpaceNoteStatement = 'insert into question_workspace_notes (ex_app_id,question_id,note) values(?,?,?);';
	// drop statement
	self.dropIphoneExAppsStatement = 'DROP TABLE iphone_ex_apps';
	self.dropExAppPagesStatement = 'DROP TABLE iphone_ex_app_pages';
	self.dropQuestionsStatement = 'DROP TABLE iphone_questions';
	self.dropBookmarkStatement = 'DROP TABLE bookmark';
	self.dropExamResultInfoStatement = 'DROP TABLE exam_result_info';
	self.dropQuestionExamResultInfoStatement = 'DROP TABLE question_exam_result_info';
	self.dropQuestionExamResultInfoStatement = 'DROP TABLE question_exam_result_info';
	
	//select
	self.selectIphoneExAppsStatement = 'select problemset.id pid, problemset.* from iphone_ex_apps problemset  where problemset.section= ? order by name';
	self.selectMyQuestionSets = '';
	self.selectGetExamResultInfoByExAppIDsStatement='select * from exam_result_info where ex_app_id in (?) order by start_time desc';
	self.selectGetQuestionResultInfoByExAppIDsStatement='select * from question_exam_result_info where ex_app_id in (?)';
	self.selectFindProblemSetIntroductionByExAppId='';
	self.selectFindExAppPageByExAppIDStatement='select * from iphone_ex_app_pages where ex_app_id=?';
	self.getNumOfQuestionsStatement = 'select count(*) as c from iphone_questions where ex_app_id = ?';
	self.selectFindAllBookMark = 'select k.* from bookmark k  order by ?';
	self.selectGetExamResultInfosBySectionStatement = "select o.* from exam_result_info o  where finish='true' and section=? order by start_time desc";
	self.selectGetAverageExamResultInfosBySectionStatement = "select o.ex_app_id ex_app_id ,o.ex_app_name ex_app_name,avg(o.score) score,avg(o.end_time) time, avg(o.end_time)/o.question_count per, o.question_count question_count from exam_result_info o  where finish='true' and section=? group by ex_app_id  order by start_time desc";
	
	// update
	self.updateItemBoughtStatement = "UPDATE items SET bought = ? WHERE _id = ?";
	self.updateItemFavoriteStatement = "UPDATE items SET favorite = ? WHERE _id = ?";

	self.selectAllItemDataStatement = "SELECT '-1' as name, COALESCE(SUM(items.bought), 0) AS boughtcount, COUNT(*) AS totalcount FROM items";
	self.selectAllFavoriteItemDataStatement = "SELECT '-1' as name, COALESCE(SUM(items.favorite), 0) AS totalcount FROM items";

	self.selectItemsFromListStatement = "SELECT * FROM items WHERE list = ? AND items.name LIKE 'pattern%'";

	self.orderItemsByName = " ORDER BY LOWER(items.name)";
	self.orderItemsByStoreThenName = " ORDER BY LOWER(items.store), LOWER(items.name)";
	self.orderItemsByTypeThenName = " ORDER BY LOWER(items.type), LOWER(items.name)";
	self.orderItemsByBoughtThenName = " ORDER BY items.bought, LOWER(items.name)";

	self.onError = function(tx, error) {
		console.log("[ERR] DBmanager: " + error.message);
	};

	self.onSuccess = function(tx, result) {
	};

	self.createTables = function(callback) {
		self.db.transaction(function(tx) {
			tx.executeSql(self.createIphoneExAppsStatement, [], self.onSuccess,
					self.onError);
			tx.executeSql(self.createExAppPages, [], self.onSuccess,
					self.onError);
			tx.executeSql(self.createQuestionsStatement, [], self.onSuccess,
					self.onError);
			tx
					.executeSql(self.createBookmark, [], self.onSuccess,
							self.onError);
			tx.executeSql(self.createExamResultInfo, [], self.onSuccess,
					self.onError);
			tx.executeSql(self.createquestionExamResultInfo, [], callback,
					self.onError);
			// tx.executeSql(self.createQuestionWorkspaceNotes, [],
			// self.onSuccess, self.onError);
		});
	};

	self.insertIphoneQuestions = function(id, ex_app_id, name, difficulty,
			text_block1a, text_block1b, text_block1c, text_block1d, image,
			question_stem_a, answer1_a, answer2_a, answer3_a, answer4_a,
			answer5_a, answer6_a, hint1, video2, video1, solution,
			solution_text, solution_text1, solution_text2, solution_text3,
			solution_text4, solution_text5, date, idx, pt_id, pt_section,
			pt_qid, pt_group_first) {
		self.db.transaction(function(tx) {
			tx.executeSql(self.insertIphoneQuestionsStatement, [ id, ex_app_id,
					name, difficulty, text_block1a, text_block1b, text_block1c,
					text_block1d, image, question_stem_a, answer1_a, answer2_a,
					answer3_a, answer4_a, answer5_a, answer6_a, hint1, video2,
					video1, solution, solution_text, solution_text1,
					solution_text2, solution_text3, solution_text4,
					solution_text5, date, idx, pt_id, pt_section, pt_qid,
					pt_group_first ], self.onSuccess, self.onError);
		});
	};

	self.insertIphoneExAppPages = function(id, ex_app_id, content, idx, date,
			solving) {
		self.db.transaction(function(tx) {
			tx.executeSql(self.insertIphoneExAppPagesStatement, [ id,
					ex_app_id, content, idx, date, solving ], self.onSuccess,
					self.onError);
		});
	};

	self.insertIphoneExApps = function(id, section, subsection, name, date,
			duration, solving_title, evaluation_title, price, total_time,
			difficulty, video_url) {
		self.db.transaction(function(tx) {
			tx.executeSql(self.insertIphoneExAppsStatement,
					[ id, section, subsection, name, date, duration,
							solving_title, evaluation_title, price, total_time,
							difficulty, video_url ], self.onSuccess,
					self.onError);
		});
	};

	self.insertExamResultInfo = function(ex_app_id, ex_app_name, score, finish,
			progress, start_time, end_time, question_count, section) {
		self.db.transaction(function(tx) {
			tx.executeSql(self.insertExamResultInfoStatement, [ ex_app_id,
					ex_app_name, score, finish, progress, start_time, end_time,
					question_count, section ], self.onSuccess, self.onError);
		});
	};

	self.insertBookmark = function(ex_app_id, question_id, position, title,
			date) {
		self.db.transaction(function(tx) {
			tx.executeSql(self.insertBookmarkStatement, [ ex_app_id,
					question_id, position, title, date ], self.onSuccess,
					self.onError);
		});
	};

	self.insertquestionExamResultInfo = function(ex_app_id, question_id,
			choice, correctChoice, mark) {
		self.db.transaction(function(tx) {
			tx.executeSql(self.insertquestionExamResultInfoStatement, [
					ex_app_id, question_id, choice, correctChoice, mark ],
					self.onSuccess, self.onError);
		});
	};

	self.insertQuestionWorkSpaceNote = function(ex_app_id, question_id, note) {
		self.db.transaction(function(tx) {
			tx.executeSql(self.insertQuestionWorkSpaceNoteStatement, [
					ex_app_id, question_id, note ], self.onSuccess,
					self.onError);
		});
	};

	self.selectListData = function(callback) {
		self.db.transaction(function(tx) {
			tx.executeSql(self.selectListDataStatement, [],
					function(tx, result) {
						var dataset = result.rows;
						callback(dataset);
					}, self.onError);
		});
	};
	
	
	
	self.getNumOfQuestions = function(ex_app_id,callback){
			
			self.db.transaction(function(tx) {
				
				tx.executeSql(self.getNumOfQuestionsStatement,[ex_app_id], function(tx,
						result) {
					var dataset = result.rows;
					
					callback(dataset.item(0)['c']);
				}, self.onError);
			});
		};
		
	self.getExamResultInfosBySection = function(sectionName,callback){
				
				self.db.transaction(function(tx) {
					console.log("getExamResultInfosBySection() called");
					tx.executeSql(self.selectGetExamResultInfosBySectionStatement,[sectionName], function(tx,
							result) {
						var rs = new Array();
						var dataset = result.rows;
						for(var i=0;i<dataset.length;i++){
							var o = dataset.item(i);
							rs.push(new self.ExamResultInfo(o['id'], o['section'], o['exAppID'], o['exAppName'], o['score'], o['finish'], o['progress'], o['startTime'], o['endTime'], o['questionCount'], o['QuestionExamStatus']));	
						}
						callback(rs);
					}, self.onError);
				});
			};
	
	self.findExAppsBySection = function(section,callback){
		
		self.db.transaction(function(tx) {
			
			tx.executeSql(self.selectIphoneExAppsStatement,[section], function(tx,
					result) {
				var rs = new Array();
				var dataset = result.rows;
				
				for(var i=0;i<dataset.length;i++){
					var o = dataset.item(i);
					
					if(o['price']==0.0||new UserService().getProfile()>=5||main_moduleinfo.Developer){
						rs.push(new self.ExApps(o['pid'], o['section'], o['subsection'], o['name'], o['date'], o['duration'], o['solving_title'], o['evaluation_title'], o['price'], o['total_time'], o['difficulty'], o['video_url']));
					}
						
				}
				callback(rs);
			}, self.onError);
		});
	};
	
	self.findProblemSetIntroductionByExAppId = function(exAppID,callback){
		
		self.findExAppPageByExAppID(exAppID,function(data){
			var exAppsPages = data;
			var find = false;
			for(var i=0;i<exAppsPages.length;i++){
				
				if(exAppsPages[i].solving==1){
					find = true;
					callback(exAppsPages[i].content);
				}
			}
			if(!find){
				callback(main_moduleinfo.IntroPage);
			}
		});
		
	};
	
	
	self.findExAppPageByExAppID = function(exAppID,callback){
			
			self.db.transaction(function(tx) {
				
				tx.executeSql(self.selectFindExAppPageByExAppIDStatement,[exAppID], function(tx,
						result) {
					var rs = new Array();
					var dataset = result.rows;
					
					for(var i=0;i<dataset.length;i++){
						var o = dataset.item(i);
						rs.push(new self.ExAppsPages(o['id'], exAppID, o['content'], o['idx'], o['date'], o['solving']));
					}
					callback(rs);
				}, self.onError);
			});
		};
		
	
	self.findAllBookMark = function(orderby,callback){
				
				self.db.transaction(function(tx) {
					console.log("findAllBookMark() called");
					tx.executeSql(self.selectFindAllBookMark,[orderby], function(tx,
							result) {
						var rs = new Array();
						var dataset = result.rows;
						rs.push(new self.BookMark("1", "exappid", "questionId", 1, "title", "2012-12-07 19:45:21"));
						for(var i=0;i<dataset.length;i++){
							var o = dataset.item(i);
							rs.push(new self.BookMark(o['id'], o['exappid'], o['questionId'], o['position'], o['title'], o['date']));
						}
						callback(rs);
					}, self.onError);
				});
			};

	self.getTime = function(second){
		var min = parseInt(second/60);
		if(min<10)min="0"+min;
		var sec = parseInt(second % 60);
		if(sec<10)sec="0"+sec;
		var hour = parseInt(min / 60);
		if(hour<10)hour="0"+hour;
		return hour+":"+min+":"+sec;
	};		
			
	self.getAverageExamResultInfosBySection = function(section,callback){
					
					self.db.transaction(function(tx) {
						console.log("getAverageExamResultInfosBySection() called");
						tx.executeSql(self.selectGetAverageExamResultInfosBySectionStatement,[section], function(tx,
								result) {
							var rs = new Array();
							rs.push(new self.ListItemExamStatVO(89, 'Main Point: Intro Set', '20%', self.getTime(126), self.getTime(12), 15));
							var dataset = result.rows;
							for(var i=0;i<dataset.length;i++){
								var o = dataset.item(i);
								rs.push(new self.ListItemExamStatVO(o['ex_app_id'], o['ex_app_name'], o['score'], self.getTime(o['time']), self.getTime(o['per']), o['question_count']));
							}
							callback(rs);
						}, self.onError);
					});
				};
	
	self.GetExamResultInfoByExAppIDs = function(ids,callback){
		
		self.db.transaction(function(tx) {
			
			tx.executeSql(self.selectGetExamResultInfoByExAppIDsStatement,[ids], function(tx,
					result) {
				var rs = new Array();
				var dataset = result.rows;
				var ids = '';
				
				for(var i=0;i<dataset.length;i++){
					var o = dataset.item(i);
					rs.push(new self.ExamResultInfo(o['id'], o['section'], o['ex_app_id'], o['ex_app_name'], o['score'], o['finish'], o['progress'], o['startTime'], o['endTime'], o['questionCount'], new Array()));
					ids +=o['ex_app_id']+",";
				}
				if(ids!=''){
					ids = ids.substring(0, ids.length-1);
					self.GetQuestionResultInfoByExAppIDs(ids, function(questionExamStatuss){
						
						if(questionExamStatuss&&questionExamStatuss.length>1){
							
							for(var k=0;k<questionExamStatuss.length;k++){
							
								var questionExamStatus = questionExamStatuss[k];
								
								for(var j=0;j<rs.length;j++){
									if(questionExamStatus.exAppID==rs[j].exAppID){
										rs[j].QuestionExamStatus.push(rs[j]);
										break;
									}
								}
							}
						}
						
						callback(rs);
					});
				}else{
					callback(rs);
				}
				
				
			}, self.onError);
		});
	};
	
	self.GetQuestionResultInfoByExAppIDs = function(ids,callback){
			
			self.db.transaction(function(tx) {
				
				tx.executeSql(self.selectGetQuestionResultInfoByExAppIDsStatement,[ids], function(tx,
						result) {
					var rs = new Array();
					var dataset = result.rows;
					
					for(var i=0;i<dataset.length;i++){
						var o = dataset.item(i);
						rs.push(new self.QuestionExamStatus(o['id'], o['ex_app_id'], o['question_id'], o['choice'], o['correctChoice'], o['mark']));
					}
					callback(rs);
				}, self.onError);
			});
		};
	

	self.selectListNameStatement = "SELECT name, color FROM lists WHERE name = ?";
	self.selectListName = function(name, callback) {
		self.db.transaction(function(tx) {
			tx.executeSql(self.selectListNameStatement, [ name ], function(tx,
					result) {
				var dataset = result.rows;
				callback(dataset);
			}, self.onError);
		});
	};

	self.selectStoreData = function(callback) {
		self.db.transaction(function(tx) {
			tx.executeSql(self.selectStoreDataStatement, [], function(tx,
					result) {
				var dataset = result.rows;
				callback(dataset);
			}, self.onError);
		});
	};

	self.selectStoreNameStatement = "SELECT name FROM stores WHERE name = ?";
	self.selectStoreName = function(storeName, callback) {
		self.db.transaction(function(tx) {
			tx.executeSql(self.selectStoreNameStatement, [ storeName ],
					function(tx, result) {
						var dataset = result.rows;
						callback(dataset);
					}, self.onError);
		});
	};

	self.selectFavoritesData = function(callback) {
		self.db.transaction(function(tx) {
			tx.executeSql(self.selectFavoritesDataStatement, [], function(tx,
					result) {
				var dataset = result.rows;
				callback(dataset);
			}, self.onError);
		});
	};

	self.selectAllItemData = function(callback) {
		self.db.transaction(function(tx) {
			tx.executeSql(self.selectAllItemDataStatement, [], function(tx,
					result) {
				var dataset = result.rows;
				callback(dataset);
			}, self.onError);
		});
	};

	self.selectAllFavoriteItemData = function(callback) {
		self.db.transaction(function(tx) {
			tx.executeSql(self.selectAllFavoriteItemDataStatement, [],
					function(tx, result) {
						var dataset = result.rows;
						callback(dataset);
					}, self.onError);
		});
	};

	self.selectItemsFromList = function(list, callback, pattern) {
		self.db.transaction(function(tx) {
			tx.executeSql(self.selectItemsFromListStatement.replace("pattern",
					pattern)
					+ self.itemOrderMode, [ list ], function(tx, result) {
				var dataset = result.rows;
				callback(dataset);
			}, self.onError);
		});
	};

	self.searchItemFromListStatement = "SELECT name, list FROM items WHERE list = ? AND name = ?";
	self.searchItemFromList = function(itemName, listName, callback) {
		self.db.transaction(function(tx) {
			tx.executeSql(self.searchItemFromListStatement, [ listName,
					itemName ], function(tx, result) {
				var dataset = result.rows;
				callback(dataset);
			}, self.onError);
		});
	};

	self.selectItemsFromStore = function(store, callback, pattern) {
		self.db.transaction(function(tx) {
			tx.executeSql(self.selectItemsFromStoreStatement.replace("pattern",
					pattern)
					+ self.itemOrderMode, [ store ], function(tx, result) {
				var dataset = result.rows;
				callback(dataset);
			}, self.onError);
		});
	};

	self.selectItemsFromFavorites = function(list, callback, pattern) {
		self.db.transaction(function(tx) {
			tx.executeSql(self.selectItemsFromFavoritesStatement.replace(
					"pattern", pattern)
					+ self.itemOrderMode, [ list ], function(tx, result) {
				var dataset = result.rows;
				callback(dataset);
			}, self.onError);
		});
	};

	self.selectAllItems = function(callback, pattern) {
		self.db.transaction(function(tx) {
			tx.executeSql(self.selectAllItemsStatement.replace("pattern",
					pattern)
					+ self.itemOrderMode, [], function(tx, result) {
				var dataset = result.rows;
				callback(dataset);
			}, self.onError);
		});
	};

	self.selectAllItemsFromFavorites = function(callback, pattern) {
		self.db.transaction(function(tx) {
			tx.executeSql(self.selectAllItemsFromFavoritesStatement.replace(
					"pattern", pattern)
					+ self.itemOrderMode, [], function(tx, result) {
				var dataset = result.rows;
				callback(dataset);
			}, self.onError);
		});
	};

	self.updateItemBought = function(id, bought, callback) {
		self.db.transaction(function(tx) {
			tx.executeSql(self.updateItemBoughtStatement, [ bought, id ],
					function(tx, result) {
						var dataset = result.rows;
						callback(dataset);
					}, self.onError);
		});
	};

	self.updateItemFavorite = function(id, favorite, callback) {
		self.db.transaction(function(tx) {
			tx.executeSql(self.updateItemFavoriteStatement, [ favorite, id ],
					function(tx, result) {
						var dataset = result.rows;
						callback(dataset);
					}, self.onError);
		});
	};

	self.deleteAllItemsFromListStatement = "DELETE FROM items WHERE list = ?";
	self.deleteAllItemsFromList = function(listname) {
		self.db.transaction(function(tx) {
			tx.executeSql(self.deleteAllItemsFromListStatement, [ listname ],
					self.onSuccess, self.onError);
		});
	};

	self.deleteListStatement = "DELETE FROM lists WHERE name = ?";
	self.deleteList = function(listname) {
		self.db.transaction(function(tx) {
			tx.executeSql(self.deleteListStatement, [ listname ],
					self.onSuccess, self.onError);
		});
	};

	self.uncheckAllListItemsStatement = "UPDATE items SET bought = 0 WHERE list = ?";
	self.uncheckAllListItems = function(listname) {
		self.db.transaction(function(tx) {
			tx.executeSql(self.uncheckAllListItemsStatement, [ listname ],
					self.onSuccess, self.onError);
		});
	};

	self.deleteItemStatement = "DELETE FROM items WHERE _id = ?";
	self.deleteItem = function(itemId) {
		self.db.transaction(function(tx) {
			tx.executeSql(self.deleteItemStatement, [ itemId ], self.onSuccess,
					self.onError);
		});
	};

	self.updateListColorStatement = "UPDATE lists SET color = ? WHERE name = ?";
	self.updateListColor = function(listName, listColor) {
		self.db.transaction(function(tx) {
			tx.executeSql(self.updateListColorStatement,
					[ listColor, listName ], self.onSuccess, self.onError);
		});
	};

	self.updateListStatement = "UPDATE lists SET name = ?, color = ? WHERE name = ?";
	self.updateList = function(newListName, newColor, oldListName) {
		self.db.transaction(function(tx) {
			tx.executeSql(self.updateListStatement, [ newListName, newColor,
					oldListName ], self.onSuccess, self.onError);
		});
	};

	self.updateItemsListNameStatement = "UPDATE items SET list = ? WHERE list = ?";
	self.updateItemsListName = function(newListName, oldListName) {
		self.db.transaction(function(tx) {
			tx.executeSql(self.updateItemsListNameStatement, [ newListName,
					oldListName ], self.onSuccess, self.onError);
		});
	};

	self.updateSingleItemListNameStatement = "UPDATE items SET list = ? WHERE _id = ?";
	self.updateSingleItemListName = function(newListName, itemId) {
		self.db.transaction(function(tx) {
			tx.executeSql(self.updateSingleItemListNameStatement, [
					newListName, itemId ], self.onSuccess, self.onError);
		});
	};

	self.selectSingleItemStatement = "SELECT * FROM items WHERE _id = ?";
	self.selectSingleItem = function(itemId, callback) {
		self.db.transaction(function(tx) {
			tx.executeSql(self.selectSingleItemStatement, [ itemId ], function(
					tx, result) {
				var dataset = result.rows;
				callback(dataset);
			}, self.onError);
		});
	};

	self.updateItemStatement = "UPDATE items SET name = ?, list = ?, store = ?, type = ?,"
			+ " image = ? WHERE _id = ?";
	self.updateItem = function(id, name, list, store, type, image) {
		self.db.transaction(function(tx) {
			tx.executeSql(self.updateItemStatement, [ name, list, store, type,
					image, id ], self.onSuccess, self.onError);
		});
	};

	self.updateItemFavoriteByIdStatement = "UPDATE items SET favorite = ? WHERE _id = ?";
	self.updateItemFavoriteById = function(id, favorite) {
		self.db.transaction(function(tx) {
			tx.executeSql(self.updateItemFavoriteByIdStatement,
					[ favorite, id ], self.onSuccess, self.onError);
		});
	};

	self.selectAllFavoritesStatement = "SELECT * FROM items WHERE favorite = 1";
	self.selectAllFavorites = function(callback) {
		self.db.transaction(function(tx) {
			tx.executeSql(self.selectAllFavoritesStatement, [], function(tx,
					result) {
				var dataset = result.rows;
				callback(dataset);
			}, self.onError);
		});
	};

	self.uncheckAllStoreItemsStatement = "UPDATE items SET bought = 0 WHERE store = ?";
	self.uncheckAllStoreItems = function(storeName) {
		self.db.transaction(function(tx) {
			tx.executeSql(self.uncheckAllStoreItemsStatement, [ storeName ],
					self.onSuccess, self.onError);
		});
	};

	self.deleteAllItemsFromStoreStatement = "DELETE FROM items WHERE store = ?";
	self.deleteAllItemsFromStore = function(storeName) {
		self.db.transaction(function(tx) {
			tx.executeSql(self.deleteAllItemsFromStoreStatement, [ storeName ],
					self.onSuccess, self.onError);
		});
	};

	self.deleteStoreStatement = "DELETE FROM stores WHERE name = ?";
	self.deleteStore = function(storeName) {
		self.db.transaction(function(tx) {
			tx.executeSql(self.deleteStoreStatement, [ storeName ],
					self.onSuccess, self.onError);
		});
	};

	self.updateItemsStoreNameStatement = "UPDATE items SET store = ? WHERE store = ?";
	self.updateItemsStoreName = function(newStoreName, oldStoreName) {
		self.db.transaction(function(tx) {
			tx.executeSql(self.updateItemsStoreNameStatement, [ newStoreName,
					oldStoreName ], self.onSuccess, self.onError);
		});
	};

	self.updateStoreNameStatement = "UPDATE stores SET name = ? WHERE name = ?";
	self.updateStoreName = function(newStoreName, oldStoreName) {
		self.db.transaction(function(tx) {
			tx.executeSql(self.updateStoreNameStatement, [ newStoreName,
					oldStoreName ], self.onSuccess, self.onError);
		});
	};

	self.updateItemsStoreNameStatement = "UPDATE items SET store = ? WHERE store = ?";
	self.updateItemsStoreName = function(newStoreName, oldStoreName) {
		self.db.transaction(function(tx) {
			tx.executeSql(self.updateItemsStoreNameStatement, [ newStoreName,
					oldStoreName ], self.onSuccess, self.onError);
		});
	};

	self.selectAllItemNamesFromListStatement = "SELECT name FROM items WHERE list = ?";
	self.selectAllItemNamesFromList = function(listName, callback) {
		self.db.transaction(function(tx) {
			tx.executeSql(self.selectAllItemNamesFromListStatement,
					[ listName ], function(tx, result) {
						var dataset = result.rows;
						callback(dataset);
					}, self.onError);
		});
	};

	self.exsitsIphoneExAppPagesStatement = "select count(*) as c from iphone_ex_app_pages";
	self.checkIphoneExAppPagesExists = function(callback, error) {
		self.db.transaction(function(tx) {
			tx.executeSql(self.exsitsIphoneExAppPagesStatement, [], function(
					tx, result) {
				var dataset = result.rows;
				callback(dataset);
			}, error);
		});
	};
	
	self.getIphoneExAppPagesCount = function() {
		self.db.transaction(function(tx) {
			tx.executeSql(self.exsitsIphoneExAppPagesStatement, [], function(tx,
					result) {
				var dataset = result.rows;
				self.data_count_IphoneExAppPages = dataset.item(0)['c'];
				
			}, self.onError);
		});
	};

	self.exsitsStatement = "select count(*) as c from iphone_ex_apps";
	self.checkExists = function(callback, error) {
		self.db.transaction(function(tx) {
			tx.executeSql(self.exsitsStatement, [], function(tx, result) {
				var dataset = result.rows;
				// alert(dataset.item(0)['c']);
				callback(dataset);
			}, error);
		});
	};
	
	self.getIphoneExAppsCount = function(callback) {
		self.db.transaction(function(tx) {
			tx.executeSql(self.exsitsStatement, [], function(tx,
					result) {
				var dataset = result.rows;
				self.data_count_iphone_ex_apps = dataset.item(0)['c'];
			}, self.onError);
		});
	};
	
	
	self.exsitsiphoneQuestionsStatement = "select count(*) as c from iphone_questions";
	self.checkiphoneQuestionsExists = function(callback, error) {
		self.db.transaction(function(tx) {
			tx.executeSql(self.exsitsiphoneQuestionsStatement, [], function(tx,
					result) {
				var dataset = result.rows;
				callback(dataset);
			}, error);
		});
	};
	
	self.getIphoneQuestionsCount = function(callback) {
		self.db.transaction(function(tx) {
			tx.executeSql(self.exsitsiphoneQuestionsStatement, [], function(tx,
					result) {
				var dataset = result.rows;
				self.data_count_iphoneQuestions = dataset.item(0)['c'];
			}, self.onError);
		});
	};
	
	
	self.findMyQuestionSets = function(section,callback) {
		self.findExAppsBySection(section, function(exApps){
			
			var rs = new Array();
			//generate ids
			var ids = '';
			
			for(var i=0;i<exApps.length;i++){
				var exapp = exApps[i];
				ids +=exapp.id+",";
			}
			if(ids!=''){
				ids = ids.substring(0, ids.length-1);
			}
			//generate over
			
			self.GetExamResultInfoByExAppIDs(ids, function(examResultInfos){
				for(var i=0;i<exApps.length;i++){
					var exapp = exApps[i];
					var item = new self.ListItemMyQuestionVO(exapp.id, exapp.section, self.convertImg(exapp.difficulty), exapp.name.split(":")[0], exapp.name.split(":")[1], "", "false", "0", 100, 0, "", false, "0", ""); 
					item.totalTime = exapp.totalTime;
					for(var j=0;j<examResultInfos.length;j++){
						var examinfo = examResultInfos[j];
						if(examinfo.exAppID == exapp.id){
							if(examinfo.finish=="true"){
								item.progress = "Last Score: "+examinfo.ScoreView;
							}else{
								item.progressMax = examinfo.questionCount;
								item.progressCount = examinfo.progress;
								item.progress = "In progress: "+examinfo.progress+"/"+examinfo.questionCount;
							}
						}
					}
					rs.push(item);
				}
				callback(rs);
			});
			
			
			
		});
	};
//	var kkk=0;
	self.convertImg = function(difficult){
//		if(kkk<5)
//		alert(difficult);
//		kkk++;
		if(!difficult||difficult==""){
			return "difficult0.png";
		}else if(difficult==0){
			return "difficult5.png";
		}else if(difficult==1){
			return "difficult1.png";
		}else if(difficult==2){
			return "difficult2.png";
		}else if(difficult==3){
			return "difficult3.png";
		}else if(difficult==4){
			return "difficult4.png";
		}else 
			return "difficult0.png";
	};

	self.data_count_iphone_ex_apps = 0;
	self.data_count_IphoneExAppPages = 0;
	self.data_count_iphoneQuestions = 0;
	
	self.exists_iphone_ex_apps = -1;
	self.exists_IphoneExAppPages = -1;
	self.exists_iphoneQuestions = -1;

	self.exists = function() {

		self.checkExists(function(data) {
			self.exists_iphone_ex_apps = 0;
		}, function() {
			self.exists_iphone_ex_apps=1;
		});

		self.checkIphoneExAppPagesExists(function(data) {
			self.exists_iphone_ex_apps=0;
		}, function() {
			self.exists_iphone_ex_apps=1;
		});

		self.checkiphoneQuestionsExists(function(data) {
			self.exists_iphone_ex_apps=0;
		}, function() {
			self.exists_iphone_ex_apps = 1;
		});

	};

	self.insertTest = function() {
		self.insertBookmark("1", "1", "1", "title", "" + new Date());
		self.insertExamResultInfo("1", "name", "10", "true", "1", "start_time",
				"end_time", "20", "section name");
		self.insertquestionExamResultInfo("1", "1", "0", "1", "true");
		self.insertQuestionWorkSpaceNote("1", "1", "note");

		self.insertIphoneExApps(774, 'Package', '',
				'2011 LSAT Package (PT 63, 64, 65)', '2012-02-09 16:56:07',
				'0', 'The Complete Package of 2011 LSATs', '', '0.0', '', '5',
				'');
		self.insertIphoneExAppPages(69, 388, 'content', 1,
				"2011-06-07 10:51:38", "1");
		self
				.insertIphoneQuestions(
						1585,
						321,
						'A company employee generates a series of five-digit productcodes in accordance ... ...',
						1,
						'd212a2d21b66e1811b2495fe8b05bd1293ab05b5UVZYVVUHVlIHB1dTAwoDClwABlAiGVVaXkIHCB0RUQsSVQtBA1MWUlcMXBEHEABFE1YTQlJAC10WFl9TQ19fQ1YfAg8DWEBGEksLXBNVQhU/aFoMAgEWFlpZE1BUUQ1KAVdeVgYZQVxHWkYSDFQUAA1VCFcRX1hSEhBMDwMXXxY+PT47C0JCSxFPXFBeG1tUQVUPCF4BRB5CCRRARgZGTRJRCRMeXxFTS0MeWFlWB1YRDB0EU0lOFw0/bEZEEWAOBxkHVwJTRRVHEVxDEgwAFldeVFhDQUIISRYBGUMLGhUAHkYHClUUUk4ZBVYCFlhaEg1NCwMWFhgTCxxBCT9oNW8KQBUQTU9ZVg9ECwVDUw8MA1RIHhYGRUpCCRMeRFYGQ08IRVJKFhUMWFRQDU0MGAICFh5GDzlsQhlEfQdVXhVWC14KEkQKVVBCQUIXVxpZBkJcTENWWFZWEg8IRFBaH0JaC1wDGBYJHRIHbmxYFRZAQ0pdUg9AVQREV1wNAwZFSxJWFhwRBBYaGVcIFk4NQVcaTU4PCgFTXUMJHAYCEkBHCD0/QxkWYVtXRhUBUlsIBhkAUQFfQhVaA0pDB0QTV19CVhFSSgNbEVpJFRdOX1ZWEhIOBUUUCQQZEFADFjs/EkIZQwANF0VHF1dYUFsWFkUKH0VdNDwJQxIVEh1dUVtAVAVKAV9YDwISQUNWFB0WA0dLEQQCEkBeQlVNFxRfW1dXCBJeHAVWEkFGBms8FhUSNlEGRhIEWkZSE15REhZQABZEXQpLUhVXWwEPEBFdFUJVAUsVFkJdUwwZFw4BRUBSW0ZUF10EGBFeVRVuMxYVExIADwJFXEYGUANREhgWODheFhNYXVBQVg9RAQJQBglXDwNUAQkDVwY',
						'table ',
						'text_block1c',
						'text_block1d',
						'',
						'cf3795403e71f3a2fe7169d399194c8a452cccd9UlZUBQpWCgBXAwUEDFkHBQEDAgMrAkVDUFUWWgBHQUVdWldfEkENAxEDWxNYVloBE0cABFQERkdKWlATARBFVFdUUxYIRxVUFRNZQkZsaAhEEUETW1AZEBFGBEZMCQdDGEFcA1RdAQQBCQcPVVcNBA0GAlUFAgZc',
						'Zone 1: Kim, Parra Zone 2: Stuckey, Udall Zone 3: Mahr, Quinn, Tiao',
						'Zone 1: Kim, Tiao Zone 2: Stuckey, Udall Zone 3: Mahr, Parra, Quinn',
						'Zone 1: Parra, Quinn Zone 2: Kim, Udall Zone 3: Mahr, Stuckey, Tiao',
						'Zone 1: Stuckey, Udall Zone 2: Kim, Tiao Zone 3: Mahr, Parra, Quinn',
						'Zone 1: Tiao Zone 2: Kim, Parra, Quinn Zone 3: Stuckey, Udall',
						'', '', '', '', 'b', '', '', '', '', '', '',
						'2012-08-28 17:19:32', 1, 66, 3, 12, 0);

	};

	self.executeSQL = function(sql) {
		self.db.transaction(function(tx) {
			tx.executeSql(sql, [], self.onSuccess, self.onError);
		});
	};
	self.fillData = function() {
		$.ajax({
			url : "database.xml",
			type : 'GET',
			dataType : 'xml',
			success : function(xml) {

				$(xml).find("sql").each(function() {
					self.executeSQL($(this).text());
				});
			}
		});
	};

	self.dropDB = function() {
		self.db.transaction(function(tx) {
			tx.executeSql(self.dropBookmarkStatement, [], function(tx, result) {
			});
		});
		self.db.transaction(function(tx) {
			tx.executeSql(self.dropExamResultInfoStatement, [], function(tx,
					result) {
			});
		});
		self.db.transaction(function(tx) {
			tx.executeSql(self.dropExAppPagesStatement, [],
					function(tx, result) {
					});
		});
		self.db.transaction(function(tx) {
			tx.executeSql(self.dropIphoneExAppsStatement, [], function(tx,
					result) {
			});
		});
		self.db.transaction(function(tx) {
			tx.executeSql(self.dropQuestionExamResultInfoStatement, [],
					function(tx, result) {
					});
		});
		self.db.transaction(function(tx) {
			tx.executeSql(self.dropQuestionsStatement, [],
					function(tx, result) {
					});
		});
	};

	/**
	 * 
	 * @param exAppId
	 * @param section
	 * @param logoImg
	 * @param title
	 * @param info
	 * @param progress
	 * @param finish if true show Last Score:xx% otherwise in progress:x/xx and progress legend
	 * @param progressCount
	 * @param progressMax default-100
	 * @param resume 0 false 1 true
	 * @param totalTime
	 * @param isRecommends indicate type:myquestionset or recommendations
	 * @param recommendId
	 * @param packageSetName
	 */
	self.ListItemMyQuestionVO = function(exAppId,section,logoImg,title,info,progress,finish,progressCount,progressMax,resume,totalTime,isRecommends,recommendId,packageSetName){
		this.exAppId = exAppId; 
		this.section = section;
		this.logoImg = logoImg;
		this.title = title;
		this.info = info;
		this.progress = progress;
		this.finish = finish;
		this.progressCount = progressCount;
		this.progressMax = progressMax;
		this.resume = resume;
		this.totalTime = totalTime;
		this.isRecommends = isRecommends;
		this.recommendId = recommendId;
		this.packageSetName = packageSetName;
	};
	
	/**
	 * 
	 * @param id
	 * @param section
	 * @param exAppID
	 * @param exAppName
	 * @param score
	 * @param finish
	 * @param progress
	 * @param startTime
	 * @param endTime
	 * @param questionCount
	 * @param QuestionExamStatus Array
	 */
	self.ExamResultInfo = function(id,section,exAppID,exAppName,score,finish,progress,startTime,endTime,questionCount,QuestionExamStatus){
		this.id = id;
		this.section = section;
		this.exAppID = exAppID;
		this.exAppName = exAppName;
		this.score = score;
		this.finish = finish;
		this.progress = progress;
		this.startTime = startTime;
		this.endTime = endTime;
		this.questionCount = questionCount;
		this.QuestionExamStatus = QuestionExamStatus;
		this.ScoreView = (function(){
			if(this.score>0&&this.questionCount>0){
				var f = this.score/this.questionCount;
				if(f==1)return "100";
				else return (100*f);
			}else{
				return "0";
			}
		})();
	};
	
	/**
	 * type 1 - last 2 - average 3 - best 
	 */
	self.getExamStatsBySectionAndType = function(section,type,callback){
		
		self.getExamResultInfosBySection(section, function(ExamResultInfos){
			console.log("getExamResultInfosBySection() called");
			var exappids = new Array();
			
			var rs = new Array();
			rs.push(new self.ListItemExamStatVO(89, 'Main Point: Intro Set', '20%', self.getTime(126), self.getTime(12), 15));
			if(type==1){
				for(var i=0;i<ExamResultInfos.length;i++){
					var exists = false;
					for(var j=0;j<exappids.length;j++){
						if(exappids[j]==ExamResultInfos[i].exAppID){
							exists = true;
							break;
						}
					}
					if(!exists){
						var per=0;
						var score=0;
						if(ExamResultInfos[i].questionCount>0){
							per = self.getTime(ExamResultInfos[i].endTime/ExamResultInfos[i].questionCount);
							score = (ExamResultInfos[i].score*100/ExamResultInfos[i].questionCount)+"%";
						}
						
						rs.push(new self.ListItemExamStatVO(ExamResultInfos[i].exAppID, ExamResultInfos[i].exAppName, score, self.getTime(ExamResultInfos[i].endTime), per, ExamResultInfos[i].questionCount));
						exappids.push(ExamResultInfos[i].exAppID);
					}
				}
				callback(rs);
			}else if(type==2){
				self.getAverageExamResultInfosBySection(section, function(data){
					callback(data);
				});
			}else if(type==3){
				ExamResultInfos.sort(function(a,b){
					return (a.score<b.score)?1:-1;
				});
				for(var i=0;i<ExamResultInfos.length;i++){
					var exists = false;
					for(var j=0;j<exappids.length;j++){
						if(exappids[j]==ExamResultInfos[i].exAppID){
							exists = true;
							break;
						}
					}
					if(!exists){
						var per=0;
						if(ExamResultInfos[i].questionCount>0)
							per = self.getTime(ExamResultInfos[i].endTime/ExamResultInfos[i].questionCount);
						rs.push(new self.ListItemExamStatVO(ExamResultInfos[i].exAppID, ExamResultInfos[i].exAppName, ExamResultInfos[i].score, self.getTime(ExamResultInfos[i].endTime), per, ExamResultInfos[i].questionCount));
						exappids.push(ExamResultInfos[i].exAppID);
					}
				}
				callback(rs);
			}
		});
//		getExamResultInfosBySection
	};
	
	/**
	 * 
	 * @param id
	 * @param exAppID
	 * @param questionId
	 * @param choice  0-A 1-B 2-C 3-D 4-E 5-F -1 no choice default is -1
	 * @param correctChoice  0-A 1-B 2-C 3-D 4-E 5-F
	 * @param mark
	 */
	self.QuestionExamStatus = function(id,exAppID,questionId,choice,correctChoice,mark){
		this.id = id;
		this.exAppID = exAppID;
		this.questionId = questionId;
		this.choice = choice;
		this.correctChoice = correctChoice;
		this.mark = mark;
	};
	
	self.ExAppsPages = function(id,exAppID,content,idx,date,solving){
		this.id = id;
		this.exAppID = exAppID;
		this.content = content;
		this.idx = idx;
		this.date = date;
		this.solving = solving;
	};
	
	self.BookMark = function(id,exappid,questionId,position,title,date){
		this.id = id;
		this.exappid = exappid;
		this.questionId = questionId;
		this.position = position;
		this.date = date;
		this.title = title;
	};
	
	self.ListItemExamStatVO = function(exAppID,name,score,totalTime,per,numQuestion){
		this.exAppID = exAppID;
		this.name = name;
		this.score = score;
		this.totalTime = totalTime;
		this.per = per;
		this.numQuestion = numQuestion;
	};
	
	/*
	 * self.db = openDatabase("ShoppingListDb", "0.1", "Shopping List DB", 2 *
	 * 1024 * 1024); self.createTables(); self.itemOrderMode =
	 * self.orderItemsByName;
	 */

	self.ExApps = function(id,section,subSection,name,date,duration,solvingTitle,evaluationTitle,price,totalTime,difficulty,videoUrl){
		this.id = id;
		this.section=section;
		this.subSection=subSection;
		this.name=name;
		this.date=date;
		this.duration=duration;
		this.solvingTitle=solvingTitle;
		this.evaluationTitle=evaluationTitle;
		this.price=price;
		this.totalTime=totalTime;
		this.difficulty=difficulty;
		this.videoUrl=videoUrl;
	};
	self.db = openDatabase("db", "0.1", "arcadiaprep DB", 15 * 1024 * 1024);	
	return self;
}