var MarbleSmash = MarbleSmash || {};


MarbleSmash.GameGridComputer = function() {

	this.marbleGroup = game.add.group();

};

MarbleSmash.GameGridComputer.prototype.init = function(width,height,tilesize,margin_x,margin_y,seed) {

	this.m_x = margin_x;
	this.m_y = margin_y;
	this.puzzle_json = null;

	this.seed = seed;
	this.tilesize = tilesize;
	this.width = width;
	this.height = height;
	this.blockGrid = this.makeGrid(width,height);
	this.checkGrid = this.makeGrid(width,height);


}

MarbleSmash.GameGridComputer.prototype.makeGrid = function(width,height) {

	var result_array = [];

	for (var xx = 0; xx < width; xx++) {
		result_array[xx] = [];
		for (var yy = 0; yy < height; yy++) {
			result_array[xx][yy] = 0;
		}
	}
	return result_array;
}

MarbleSmash.GameGridComputer.prototype.getVal = function(x,y) {
	
	if (x < 0 || x >= this.width || y < 0 || y>= this.height) {
		return -1;
	}

	return  this.blockGrid[x][y];


}

MarbleSmash.GameGridComputer.prototype.setVal = function(x,y,val) {
	
	if (x < 0 || x >= this.width || y < 0 || y>= this.height) {
		return false;
	}

	this.blockGrid[x][y] = val;
	return true;

}

MarbleSmash.GameGridComputer.prototype.makeNewMarble = function(x,y,number,cell) {

	var cell = cell || false

	if (!cell) {
		var cell_x = Math.floor(x / this.tilesize);
    	var cell_y = Math.floor(y / this.tilesize); 
	}
	

    if (cell_x < 0 || cell_x >= this.width || cell_y < 0 || cell_y >= this.height) {
    	return;
    }

    var xx = cell_x*this.tilesize+(this.tilesize*0.5);
    var yy = cell_y*this.tilesize+(this.tilesize*0.5);

	this.blockGrid[cell_x][cell_y] = number;

}

MarbleSmash.GameGridComputer.prototype.checkLoop = function() {
	var all_patterns = [];

	for (var yy = 0; yy < this.height; yy++) {
		for (var xx = 0; xx < this.width; xx++) {

			if (this.validCell(xx,yy)) {

				var pattern = this.lookForMatch(xx,yy);
				if (pattern) {
					all_patterns[all_patterns.length] = pattern;
				}
			}

		}
	}

	this.clearCheckGrid();

	return all_patterns;
	//console.log("KONIEC PETLI");
}

MarbleSmash.GameGridComputer.prototype.validCell = function(x,y) {

	if (x < 0 || x >= this.width || y < 0 || y >= this.height || this.blockGrid[x][y] == 0 || this.checkGrid[x][y] == 1) return false;

	return true;

}

MarbleSmash.GameGridComputer.prototype.validCellAndNumber = function(x,y,number_to_check) {



	if (this.validCell(x,y)) {
		return number_to_check == this.getVal(x,y);
	}else {
		return false;
	}

}

MarbleSmash.GameGridComputer.prototype.lookForMatch = function(xx,yy) {

	var number_of_block = this.getVal(xx,yy);
	var pattern = [[xx,yy]];
	var to_check = [[xx,yy]];
	var i_check = 0;

	function lookForMatchingNeighbours(xx,yy,number_of_block) {


		if (this.validCellAndNumber(xx-1,yy,number_of_block)) {
			to_check[to_check.length] = [xx-1,yy]
			pattern[pattern.length] = [xx-1,yy];
			this.setAsCheck(xx-1,yy);
		}

		if (this.validCellAndNumber(xx+1,yy,number_of_block)) {

			to_check[to_check.length] = [xx+1,yy]
			pattern[pattern.length] = [xx+1,yy];
			this.setAsCheck(xx+1,yy);
		}

		if (this.validCellAndNumber(xx,yy-1,number_of_block)) {
	
			to_check[to_check.length] = [xx,yy-1]
			pattern[pattern.length] = [xx,yy-1];
			this.setAsCheck(xx,yy-1);
		}

		if (this.validCellAndNumber(xx,yy+1,number_of_block)) {

			to_check[to_check.length] = [xx,yy+1]
			pattern[pattern.length] = [xx,yy+1];
			this.setAsCheck(xx,yy+1);
		}

	}

	this.setAsCheck(xx,yy);

	while (i_check < to_check.length) {
		lookForMatchingNeighbours.apply(this,[to_check[i_check][0],to_check[i_check][1],number_of_block]);
		i_check++;
	}




	if (pattern.length > 2) {
		return pattern;
	}else {
		return false;
	}



}

MarbleSmash.GameGridComputer.prototype.lookForMatchAndDestroy = function(xx,yy) {

	var number_of_block = this.getVal(xx,yy);
	var pattern = [[xx,yy]];
	var to_check = [[xx,yy]];
	var i_check = 0;

	function lookForMatchingNeighbours(xx,yy,number_of_block) {


		if (this.validCellAndNumber(xx-1,yy,number_of_block)) {
			to_check[to_check.length] = [xx-1,yy]
			pattern[pattern.length] = [xx-1,yy];
			this.setAsCheck(xx-1,yy);
		}

		if (this.validCellAndNumber(xx+1,yy,number_of_block)) {

			to_check[to_check.length] = [xx+1,yy]
			pattern[pattern.length] = [xx+1,yy];
			this.setAsCheck(xx+1,yy);
		}

		if (this.validCellAndNumber(xx,yy-1,number_of_block)) {
	
			to_check[to_check.length] = [xx,yy-1]
			pattern[pattern.length] = [xx,yy-1];
			this.setAsCheck(xx,yy-1);
		}

		if (this.validCellAndNumber(xx,yy+1,number_of_block)) {

			to_check[to_check.length] = [xx,yy+1]
			pattern[pattern.length] = [xx,yy+1];
			this.setAsCheck(xx,yy+1);
		}

	}

	this.setAsCheck(xx,yy);

	while (i_check < to_check.length) {
		lookForMatchingNeighbours.apply(this,[to_check[i_check][0],to_check[i_check][1],number_of_block]);
		i_check++;
	}




	if (pattern.length > 2) {
		this.clearPattern(pattern);
	}


}


MarbleSmash.GameGridComputer.prototype.clearPattern = function(pattern) {
	var len = pattern.length;
	for (var i = 0; i < len; i++) {
		this.destroyMarble(pattern[i][0],pattern[i][1]);

	}
}

MarbleSmash.GameGridComputer.prototype.destroyMarble = function(x,y) {
	this.setVal(x,y,0);
}

MarbleSmash.GameGridComputer.prototype.setAsCheck = function(x,y) {
	this.checkGrid[x][y] = 1;
}

MarbleSmash.GameGridComputer.prototype.clearCheckGrid = function() {
	for (var yy = 0; yy < this.height; yy++) {
		for (var xx = 0; xx < this.width; xx++) {

			this.checkGrid[xx][yy] = 0;

		}
	}
}

MarbleSmash.GameGridComputer.prototype.moveDown = function() {

	var free_collumns = []

	for (var xx = 0; xx < this.width; xx++) {
		var free_space = 0;
		var delay = 0;
		
		for (var yy = this.height-1; yy >= 0; yy--) {
			if (this.getVal(xx,yy) == 0) {
				free_space++;
			}else {
				if (free_space > 0 ) {
					this.moveMarble(xx,yy,0,free_space,delay);
					delay += 50;
				}
				
			}

			if (free_space == this.height) {
				free_collumns[free_collumns.length] = xx;
			}
		}
	}

	if (free_collumns.length > 0) {


		this.tightCollumnsLeft(free_collumns);
		this.tightCollumnsRight(free_collumns);
	}

	
}


MarbleSmash.GameGridComputer.prototype.tightCollumnsLeft = function(free_collumns) {

	var free_col = 0;
	var delay = 0;

	for (var i = Math.floor(this.width*0.5); i >= 0; i--) {

		
		if (free_collumns.indexOf(i) == -1) {
			if (free_col > 0) {
	;
				this.moveCollumn(i,free_col,delay);
				delay += 50;
			}
		}else {

			free_col++;
		}
	}

}

MarbleSmash.GameGridComputer.prototype.tightCollumnsRight = function(free_collumns) {

	var free_col = 0;
	var delay = 0;
	for (var i = Math.floor(this.width*0.5)+1; i < this.width ; i++) {

		if (free_collumns.indexOf(i) == -1) {
			if (free_col < 0) {

				this.moveCollumn(i,free_col,delay);
				delay += 50;
			}
		}else {
			free_col--;
		}
	}

}


MarbleSmash.GameGridComputer.prototype.moveCollumn = function(collumn_nr,offset,delay) {


	this.blockGrid[collumn_nr].forEach(function(element,row) {
		if (element != 0) {

			var marble = element;
			//game.add.tween(marble).to({x: element.x+(offset*this.tilesize)},Math.abs(offset)*120,Phaser.Easing.Sinusoidal.In,true,delay);
			this.setVal(collumn_nr,row,0);
			this.blockGrid[collumn_nr+offset][row] = marble;
		}
	},this)
}


MarbleSmash.GameGridComputer.prototype.moveMarble = function(from_x,from_y,offset_x,offset_y,delay) {
	var marble = this.getVal(from_x,from_y);
	this.setVal(from_x,from_y,0);
	this.blockGrid[from_x+offset_x][from_y+offset_y] = marble;
}

MarbleSmash.GameGridComputer.prototype.fillRandom = function() {
	this.blockGrid.forEach(function(collumn,xx) {
		collumn.forEach(function(cell,yy) {
			var marble = game.rnd.between(1,4);
			this.blockGrid[xx][yy] = marble;
			
		},this)
	},this)
}

MarbleSmash.GameGridComputer.prototype.clearAll = function() {
	this.blockGrid.forEach(function(collumn,xx) {
		collumn.forEach(function(cell,yy) {
			this.blockGrid[xx][yy] = 0;
			
		},this)
	},this)
}




MarbleSmash.GameGridComputer.prototype.changePxToCell = function(px) {
	return Math.floor(px/this.tilesize);
}

MarbleSmash.GameGridComputer.prototype.changeCellToPx = function(cell) {
	return cell*this.tilesize;
}






MarbleSmash.GameGridComputer.prototype.click = function() {
	if (this.mouseInRange()) {
		this.lookForMatchAndDestroy(this.changePxToCell(game.input.x-this.m_x),this.changePxToCell(game.input.y-this.m_y));
		this.moveDown();
		this.clearCheckGrid();
	}

	
}

MarbleSmash.GameGridComputer.prototype.reset = function() {
	this.blockGrid = JSON.parse(this.puzzle_json);
}

MarbleSmash.GameGridComputer.prototype.mouseInRange = function() {
	return game.input.x > this.m_x && game.input.x < this.m_x+this.width*this.tilesize 
		&& game.input.y > this.m_y && game.input.y < this.m_y+this.height*this.tilesize
}

MarbleSmash.GameGridComputer.prototype.countMarbles = function() {
	var result = 0;

	this.blockGrid.forEach(function(col_array,col) {
		col_array.forEach(function(element,row) {
			if (element > 0) {
				result++;
			}
		},this)	
	},this)

	return result;

}

MarbleSmash.GameGridComputer.prototype.solve = function(iterations) {
	var answers = [50,"blanktext"]
	var iterations = iterations;
	var choices = [];

	while (iterations > 0) {

		

		var options = this.checkLoop();

		if (options.length == 0) {
			

			iterations--;

			var marbles_left = this.countMarbles();
			if (marbles_left == 0) {
				iterations = 0;
			}
			if (answers[0] > marbles_left) {
				answers[0] = marbles_left;
				answers[1] = choices;
			}
			choices = [];
			this.reset();

		} else {
			var choice = game.rnd.between(0,options.length-1);
			choices[choices.length] = [options[choice][0][0],options[choice][0][1]];
			this.clearPattern(options[choice]);
			this.moveDown()
			this.clearCheckGrid();

		}

	}

	return answers;

}

MarbleSmash.GameGridComputer.prototype.findPuzzle = function(puzzles_to_make) {
	var puzzles = [];

	while (puzzles.length < puzzles_to_make) {

		this.fillRandom();
		this.puzzle_json = JSON.stringify(this.blockGrid);
		var answers = this.solve(20000);
		if (answers[0] == 0) {
			console.log("found "+puzzles.length);
			puzzles[puzzles.length] = [this.puzzle_json,JSON.stringify(answers[1])]
		}

	}

	console.log(JSON.stringify(puzzles));
	
}


MarbleSmash.GameGridComputer.prototype.findBestSolution = function(puzzles_array) {
	for (var i = 0; i < puzzles_array.length; i++) {
		
		this.puzzle_json = puzzles_array[i][0];
		this.reset();
		var steps = JSON.parse(puzzles_array[i][1]).length;

		for (var attempt = 0; attempt < 50; attempt++) {

			var answer = this.solve(20000);
			if (answer[0] == 0 && answer[1].length < steps) {
				console.log("znaleziono lepsza: "+answer[0]+", steps: "+answer[1].length+", bylo: "+steps);
				steps = answer[1].length;
				puzzles_array[i][1] = JSON.stringify(answer[1])

			}

		}

	}

}