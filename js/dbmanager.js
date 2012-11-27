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
	//self.createQuestionWorkspaceNotes = 'CREATE TABLE question_workspace_notes( id integer primary key,ex_app_id integer, question_id integer, note text);';

	// insert statement
	
	self.insertIphoneExAppsStatement = 'insert into iphone_ex_apps values(?,?,?,?,?,?,?,?,?,?,?,?)';
	self.insertIphoneExAppPagesStatement = 'insert into iphone_ex_app_pages values(?,?,?,?,?,?);';
	self.insertIphoneQuestionsStatement = 'insert into iphone_questions values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
	
	self.insertBookmarkStatement = "insert into  bookmark(ex_app_id,question_id,position,title,date) values (?,?,?,?,?);";
	self.insertExamResultInfoStatement = 'insert into exam_result_info(ex_app_id,ex_app_name,score,finish,progress,start_time,end_time,question_count,section) values(?,?,?,?,?,?,?,?,?);';
	self.insertquestionExamResultInfoStatement = 'insert into  question_exam_result_info(ex_app_id,question_id,choice,correctChoice,mark) values(?,?,?,?,?);';
	self.insertQuestionWorkSpaceNoteStatement = 'insert into question_workspace_notes (ex_app_id,question_id,note) values(?,?,?);';
	//drop statement
	self.dropIphoneExAppsStatement='DROP TABLE iphone_ex_apps';
	self.dropExAppPagesStatement='DROP TABLE iphone_ex_app_pages';
	self.dropQuestionsStatement='DROP TABLE iphone_questions';
	self.dropBookmarkStatement='DROP TABLE bookmark';
	self.dropExamResultInfoStatement='DROP TABLE exam_result_info';
	self.dropQuestionExamResultInfoStatement='DROP TABLE question_exam_result_info';
	self.dropQuestionExamResultInfoStatement='DROP TABLE question_exam_result_info';
	
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

	self.createTables = function() {
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
			tx.executeSql(self.createquestionExamResultInfo, [],
					self.onSuccess, self.onError);
//			tx.executeSql(self.createQuestionWorkspaceNotes, [],
//					self.onSuccess, self.onError);
		});
	};
	
	
	
	self.insertIphoneQuestions = function(id,ex_app_id,name,difficulty,text_block1a,text_block1b,text_block1c,text_block1d,image,question_stem_a,answer1_a,answer2_a,answer3_a,answer4_a,answer5_a,answer6_a,hint1,video2,video1,solution,solution_text,solution_text1,solution_text2,solution_text3,solution_text4,solution_text5,date,idx,pt_id,pt_section,pt_qid,pt_group_first) {
		self.db.transaction(function(tx) {
			tx.executeSql(self.insertIphoneQuestionsStatement, [id,ex_app_id,name,difficulty,text_block1a,text_block1b,text_block1c,text_block1d,image,question_stem_a,answer1_a,answer2_a,answer3_a,answer4_a,answer5_a,answer6_a,hint1,video2,video1,solution,solution_text,solution_text1,solution_text2,solution_text3,solution_text4,solution_text5,date,idx,pt_id,pt_section,pt_qid,pt_group_first], self.onSuccess, self.onError);
		});
	};
	
	self.insertIphoneExAppPages = function(id,ex_app_id,content,idx,date,solving) {
		self.db.transaction(function(tx) {
			tx.executeSql(self.insertIphoneExAppPagesStatement, [id,ex_app_id,content,idx,date,solving], self.onSuccess, self.onError);
		});
	};
	
	self.insertIphoneExApps = function(id,section,subsection,name,date,duration,solving_title,evaluation_title,price,total_time,difficulty,video_url) {
		self.db.transaction(function(tx) {
			tx.executeSql(self.insertIphoneExAppsStatement, [id,section,subsection,name,date,duration,solving_title,evaluation_title,price,total_time,difficulty,video_url], self.onSuccess, self.onError);
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

	self.exsitsStatement = "select count(*) as c from iphone_ex_apps";
	self.checkExists = function(callback,error) {
		self.db.transaction(function(tx) {
			tx.executeSql(self.exsitsStatement, [], function(tx, result) {
				var dataset = result.rows;
				callback(dataset);
			}, error);
		});
	};

	self.exists = function(callback) {
		self.checkExists(function(data) {
			callback(true);
		},function(){callback(false);});
	};
	
	self.insertTest=function(){
		self.insertBookmark("1","1","1","title",""+new Date());
		self.insertExamResultInfo("1","name","10","true","1","start_time","end_time","20","section name");
		self.insertquestionExamResultInfo("1","1","0","1","true");
		self.insertQuestionWorkSpaceNote("1","1","note"); 
		
		self.insertIphoneExApps(774,'Package','','2011 LSAT Package (PT 63, 64, 65)','2012-02-09 16:56:07','0','The Complete Package of 2011 LSATs','','0.0','','5','');
		self.insertIphoneExAppPages(69, 388, 'content', 1, "2011-06-07 10:51:38", "1");
		self.insertIphoneQuestions(1585, 321, 'A company employee generates a series of five-digit productcodes in accordance ... ...', 1, 'd212a2d21b66e1811b2495fe8b05bd1293ab05b5UVZYVVUHVlIHB1dTAwoDClwABlAiGVVaXkIHCB0RUQsSVQtBA1MWUlcMXBEHEABFE1YTQlJAC10WFl9TQ19fQ1YfAg8DWEBGEksLXBNVQhU/aFoMAgEWFlpZE1BUUQ1KAVdeVgYZQVxHWkYSDFQUAA1VCFcRX1hSEhBMDwMXXxY+PT47C0JCSxFPXFBeG1tUQVUPCF4BRB5CCRRARgZGTRJRCRMeXxFTS0MeWFlWB1YRDB0EU0lOFw0/bEZEEWAOBxkHVwJTRRVHEVxDEgwAFldeVFhDQUIISRYBGUMLGhUAHkYHClUUUk4ZBVYCFlhaEg1NCwMWFhgTCxxBCT9oNW8KQBUQTU9ZVg9ECwVDUw8MA1RIHhYGRUpCCRMeRFYGQ08IRVJKFhUMWFRQDU0MGAICFh5GDzlsQhlEfQdVXhVWC14KEkQKVVBCQUIXVxpZBkJcTENWWFZWEg8IRFBaH0JaC1wDGBYJHRIHbmxYFRZAQ0pdUg9AVQREV1wNAwZFSxJWFhwRBBYaGVcIFk4NQVcaTU4PCgFTXUMJHAYCEkBHCD0/QxkWYVtXRhUBUlsIBhkAUQFfQhVaA0pDB0QTV19CVhFSSgNbEVpJFRdOX1ZWEhIOBUUUCQQZEFADFjs/EkIZQwANF0VHF1dYUFsWFkUKH0VdNDwJQxIVEh1dUVtAVAVKAV9YDwISQUNWFB0WA0dLEQQCEkBeQlVNFxRfW1dXCBJeHAVWEkFGBms8FhUSNlEGRhIEWkZSE15REhZQABZEXQpLUhVXWwEPEBFdFUJVAUsVFkJdUwwZFw4BRUBSW0ZUF10EGBFeVRVuMxYVExIADwJFXEYGUANREhgWODheFhNYXVBQVg9RAQJQBglXDwNUAQkDVwY', 'table ', 'text_block1c', 'text_block1d', '', 'cf3795403e71f3a2fe7169d399194c8a452cccd9UlZUBQpWCgBXAwUEDFkHBQEDAgMrAkVDUFUWWgBHQUVdWldfEkENAxEDWxNYVloBE0cABFQERkdKWlATARBFVFdUUxYIRxVUFRNZQkZsaAhEEUETW1AZEBFGBEZMCQdDGEFcA1RdAQQBCQcPVVcNBA0GAlUFAgZc', 'Zone 1: Kim, Parra Zone 2: Stuckey, Udall Zone 3: Mahr, Quinn, Tiao', 'Zone 1: Kim, Tiao Zone 2: Stuckey, Udall Zone 3: Mahr, Parra, Quinn', 'Zone 1: Parra, Quinn Zone 2: Kim, Udall Zone 3: Mahr, Stuckey, Tiao', 'Zone 1: Stuckey, Udall Zone 2: Kim, Tiao Zone 3: Mahr, Parra, Quinn', 'Zone 1: Tiao Zone 2: Kim, Parra, Quinn Zone 3: Stuckey, Udall', '', '', '', '', 'b', '', '', '', '', '', '', '2012-08-28 17:19:32', 1, 66, 3, 12, 0);
		
	};
	
	self.fillData = function(){
		
	};
	
	
	
	self.dropDB = function() {
		self.db.transaction(function(tx) {
			tx.executeSql(self.dropBookmarkStatement, [], function(tx, result) {
			});
		});
		self.db.transaction(function(tx) {
			tx.executeSql(self.dropExamResultInfoStatement, [], function(tx, result) {
			});
		});
		self.db.transaction(function(tx) {
			tx.executeSql(self.dropExAppPagesStatement, [], function(tx, result) {
			});
		});
		self.db.transaction(function(tx) {
			tx.executeSql(self.dropIphoneExAppsStatement, [], function(tx, result) {
			});
		});
		self.db.transaction(function(tx) {
			tx.executeSql(self.dropQuestionExamResultInfoStatement, [], function(tx, result) {
			});
		});
		self.db.transaction(function(tx) {
			tx.executeSql(self.dropQuestionsStatement, [], function(tx, result) {
			});
		});
	};
	
	self.db = openDatabase("db", "0.1", "arcadiaprep DB", 15 * 1024 * 1024);
	return self;
	/*
	 * self.db = openDatabase("ShoppingListDb", "0.1", "Shopping List DB", 2 *
	 * 1024 * 1024); self.createTables(); self.itemOrderMode =
	 * self.orderItemsByName;
	 */

}
