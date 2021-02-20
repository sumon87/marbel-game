var MarbleSmash = MarbleSmash || {};


MarbleSmash.GameGrid = function() {

	this.marbleGroup = game.add.group();
	this.input_active = true;

	this.noMoreMoves = new Phaser.Signal();
	this.allCleared = new Phaser.Signal();
	this.clearedPattern = new Phaser.Signal();

};

MarbleSmash.GameGrid.prototype.destroy = function() {
	this.marbleGroup.destroy();
}

MarbleSmash.GameGrid.prototype.init = function(width,height,tilesize,margin_y,puzzle) {

	this.m_x = (420-(width*tilesize))/2
	this.m_y = margin_y;
	this.marbleGroup.x = this.m_x;
	this.marbleGroup.y = margin_y;
	this.puzzle = puzzle;

	for (var i = 0; i < width*height; i++) {
		this.marbleGroup.add(new Marble());
	}


	this.tilesize = tilesize;
	this.width = width;
	this.height = height;
	this.blockGrid = this.makeGrid(width,height);
	this.checkGrid = this.makeGrid(width,height);


	this.timeAttackMaxNumberOfMarble = 5;

	//PUZZLE_VARs
	this.hint_available = true;
	this.hint_index = 0;
	this.undo_hint_index = 0;

	this.undo_available = false;
	this.undo_array = [];
	this.undo_index = 0

}


MarbleSmash.GameGrid.prototype.resize = function(tilesize,margin_y) {
	this.tilesize = tilesize;
	this.m_x = (420-(this.width*tilesize))/2
	this.m_y = margin_y;

	this.marbleGroup.x = this.m_x;
	this.marbleGroup.y = this.m_y;

	this.marbleGroup.forEach(function(child) {
		child.resize(tilesize);	
	});

	this.import(this.export());
}

MarbleSmash.GameGrid.prototype.makeGrid = function(width,height) {

	var result_array = [];

	for (var xx = 0; xx < width; xx++) {
		result_array[xx] = [];
		for (var yy = 0; yy < height; yy++) {
			result_array[xx][yy] = 0;
		}
	}
	return result_array;
}

MarbleSmash.GameGrid.prototype.getVal = function(x,y) {
	
	if (x < 0 || x >= this.width || y < 0 || y>= this.height) {
		return -1;
	}

	return  this.blockGrid[x][y] == 0 ? 0 : this.blockGrid[x][y].number;

}

MarbleSmash.GameGrid.prototype.setVal = function(x,y,val) {
	
	if (x < 0 || x >= this.width || y < 0 || y>= this.height) {
		return false;
	}

	this.blockGrid[x][y] = val;
	return true;

}

MarbleSmash.GameGrid.prototype.makeNewMarble = function(cell_x,cell_y,number) {


    if (cell_x < 0 || cell_x >= this.width || cell_y < 0 || cell_y >= this.height) {
    	return;
    }

    var xx = (cell_x*this.tilesize)+(this.tilesize*0.5);
    var yy = (cell_y*this.tilesize)+(this.tilesize*0.5);
	var marble = this.marbleGroup.getFirstDead();
	marble.init(xx,yy,number,this.tilesize);
	this.blockGrid[cell_x][cell_y] = marble;

	return marble;

}

MarbleSmash.GameGrid.prototype.checkLoop = function() {



	for (var yy = 0; yy < this.height; yy++) {
		for (var xx = 0; xx < this.width; xx++) {

			if (this.validCell(xx,yy)) {

				this.lookForMatch(xx,yy);

			}

		}
	}

	this.clearCheckGrid();
}


MarbleSmash.GameGrid.prototype.checkIfPosibleMoves = function() {

	
		this.clearCheckGrid();

		for (var yy = 0; yy < this.height; yy++) {
			for (var xx = 0; xx < this.width; xx++) {
				
				if (this.validCell(xx,yy)) {
		
					var pat = this.lookForMatch(xx,yy);
					
					if (pat !== false) {
						this.clearCheckGrid();
						return true;
					}

				}

			}
		}

		this.clearCheckGrid();
		return false;
	

	

}

MarbleSmash.GameGrid.prototype.checkIfCleared = function() {

	
	
	for (var yy = 0; yy < this.height; yy++) {
		for (var xx = 0; xx < this.width; xx++) {

			if (this.validCell(xx,yy)) {

				if (this.getVal(xx,yy) != 0) {
					return false;
				}

			}

		}
	}

	return true;

}

MarbleSmash.GameGrid.prototype.validCell = function(x,y) {
	if (x < 0 || x >= this.width || y < 0 || y >= this.height || this.blockGrid[x][y] == 0 || this.checkGrid[x][y] == 1) return false;

	return true;

}

MarbleSmash.GameGrid.prototype.validCellAndNumber = function(x,y,number_to_check) {

	

	if (this.validCell(x,y)) {
		return number_to_check == this.getVal(x,y);
	}else {
		
		return false;
	}

}


//
// SZUKA PATERNU 
//
MarbleSmash.GameGrid.prototype.lookForMatch = function(xx,yy,doPowerUps) {
	

	var checkPowerUps = doPowerUps || false;

	if (checkPowerUps && !this.puzzle && this.blockGrid[xx][yy].powerup > 0) {
		return this.processPowerUpPattern(xx,yy);
	}

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

		if (!checkPowerUps) {
			return pattern;
		}else {

			if (pattern.length > 14) {
				this.blockGrid[pattern[0][0]][pattern[0][1]].changeToPowerUp();
				this.blockGrid[pattern[6][0]][pattern[6][1]].changeToPowerUp();
				this.blockGrid[pattern[12][0]][pattern[12][1]].changeToPowerUp();
				pattern.splice(12,1);
				pattern.splice(6,1);
				pattern.splice(0,1);
				return pattern;
			}

			else if (pattern.length > 9) {
				
				this.blockGrid[pattern[0][0]][pattern[0][1]].changeToPowerUp();
				this.blockGrid[pattern[6][0]][pattern[6][1]].changeToPowerUp();
				pattern.splice(6,1);
				pattern.splice(0,1);
				return pattern;
			}

			else if (pattern.length > 5) {
				
				this.blockGrid[pattern[0][0]][pattern[0][1]].changeToPowerUp();
				pattern.splice(0,1);
				return pattern;
			}

			
			return pattern;
			

		}
		
	}

	return false;

}

MarbleSmash.GameGrid.prototype.clearPattern = function(pattern) {
	var len = pattern.length;
	for (var i = 0; i < len; i++) {
		this.destroyMarble(pattern[i][0],pattern[i][1]);
	}
}

MarbleSmash.GameGrid.prototype.destroyMarble = function(x,y) {
	if (this.blockGrid[x][y] == 0) return;
	this.blockGrid[x][y].explode();
	this.setVal(x,y,0);
}

MarbleSmash.GameGrid.prototype.setAsCheck = function(x,y) {
	this.checkGrid[x][y] = 1;
}

MarbleSmash.GameGrid.prototype.clearCheckGrid = function() {
	for (var yy = 0; yy < this.height; yy++) {
		for (var xx = 0; xx < this.width; xx++) {

			this.checkGrid[xx][yy] = 0;

		}
	}
}

MarbleSmash.GameGrid.prototype.moveDown = function() {


	var input_delay = 0;

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
					input_delay = Math.max(input_delay,delay+(free_space*80));
					delay += 50;
				}
				
			}

			if (free_space == this.height) {
				free_collumns[free_collumns.length] = xx;
			}
		}

		if (input_delay < delay) {
			input_delay = delay;
		}

	}


	if (free_collumns.length > 0) {
		var delay_l = this.tightCollumnsLeft(free_collumns);
		var delay_r = this.tightCollumnsRight(free_collumns);

		input_delay += Math.max(input_delay,delay_l,delay_r);
		
	}


	game.time.events.add(input_delay, function() {
		this.input_active = true
	}, this);

}

MarbleSmash.GameGrid.prototype.moveMarble = function(from_x,from_y,offset_x,offset_y,delay,alpha) {
	
	var fade = alpha || false;

	var marble = this.blockGrid[from_x][from_y];
	if (fade) {
		marble.alpha = 0;
		game.add.tween(marble).to({alpha: 1},(offset_y*80)*0.5,Phaser.Easing.Sinusoidal.In,true,delay);
	}
	game.add.tween(marble).to({y: marble.y+(offset_y*this.tilesize)},offset_y*80,Phaser.Easing.Sinusoidal.In,true,delay);
	this.setVal(from_x,from_y,0);
	this.blockGrid[from_x+offset_x][from_y+offset_y] = marble;
	
	
}


MarbleSmash.GameGrid.prototype.moveDownAndRefill = function() {


	var input_delay = 0;

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
					input_delay = Math.max(input_delay,(delay+free_space*80));
					delay += 30;
					
				}
				
			}

			if (free_space == this.height) {
				free_collumns[free_collumns.length] = xx;
			}
		}

		var new_marbles = 0;

		for (var yy = this.height-1; yy >= 0; yy--) {

			if (this.getVal(xx,yy) == 0) {
				var marble = this.makeNewMarble(xx,yy,game.rnd.between(1,this.timeAttackMaxNumberOfMarble))
				var distance_in_cells = (marble.y+100+(new_marbles*this.tilesize))/this.tilesize;
				var tween = game.add.tween(marble).from({y: -1*(100+(new_marbles*this.tilesize))},distance_in_cells*70,Phaser.Easing.Sinusoidal.In,true,delay);
				marble.alpha = 0;
				game.add.tween(marble).to({alpha: 1},(distance_in_cells*70)*0.75,Phaser.Easing.Sinusoidal.In,true,delay);
				input_delay = Math.max(input_delay,delay+(distance_in_cells*80));
				delay += 30;
				new_marbles++; 
				
			
			}

		}
		

	}



	game.time.events.add(input_delay, function() {
		this.input_active = true
	}, this);

}


MarbleSmash.GameGrid.prototype.tightCollumnsLeft = function(free_collumns) {

	var free_col = 0;
	var delay = 0;

	for (var i = Math.floor(this.width*0.5); i >= 0; i--) {
				
		if (free_collumns.indexOf(i) == -1) {
			if (free_col > 0) {
				
				this.moveCollumn(i,free_col,delay);
				delay += 50;
			}
		}else {
			
			free_col++;
		}
	}

	return delay;

}

MarbleSmash.GameGrid.prototype.tightCollumnsRight = function(free_collumns) {

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

	return delay;

}


MarbleSmash.GameGrid.prototype.moveCollumn = function(collumn_nr,offset,delay) {

	

	this.blockGrid[collumn_nr].forEach(function(element,row) {
		if (element != 0) {
			
			var marble = element;
			game.add.tween(marble).to({x: element.x+(offset*this.tilesize)},Math.abs(offset)*120,Phaser.Easing.Sinusoidal.In,true,delay);
			this.setVal(collumn_nr,row,0);
			this.blockGrid[collumn_nr+offset][row] = marble;
		}
	},this)
}




MarbleSmash.GameGrid.prototype.fillRandom = function() {
	do {
		this.clear();
		this.blockGrid.forEach(function(collumn,xx) {
			collumn.forEach(function(cell,yy) {
				var marble = this.makeNewMarble(xx,yy,game.rnd.between(1,this.timeAttackMaxNumberOfMarble));
				this.blockGrid[xx][yy] = marble;
				this.marbleGroup.add(marble);
			},this)
		},this)
	} while (!this.checkIfPosibleMoves());

}

MarbleSmash.GameGrid.prototype.clear = function() {
	this.blockGrid.forEach(function(collumn,xx) {
		collumn.forEach(function(cell,yy) {
			if (this.blockGrid[xx][yy] != 0) {
				this.blockGrid[xx][yy].kill();
				this.setVal(xx,yy,0);
			}
		},this)
	},this)
}



MarbleSmash.GameGrid.prototype.changePxToCell = function(px) {
	return Math.floor(px/this.tilesize);
}

MarbleSmash.GameGrid.prototype.changeCellToPx = function(cell) {
	return cell*this.tilesize;
}






MarbleSmash.GameGrid.prototype.click = function() {

	if (this.input_active && this.mouseInRange()) {

		if (game.tweens.getAll().length > 0) {
			return;
		}

		if (this.getVal(this.changePxToCell(game.input.x-this.m_x),this.changePxToCell(game.input.y-this.m_y)) == 0) return;
		
		

		var pattern = this.lookForMatch(this.changePxToCell(game.input.x-this.m_x),this.changePxToCell(game.input.y-this.m_y),!this.puzzle) 

		if (pattern) {

			game.sfx.pop.play();

			this.clearedPattern.dispatch(pattern.length);

			if (this.puzzle) {
				if (this.hint_available) {
					this.undo_hint_index = this.undo_index;
				}
				

				this.undo_array[this.undo_index] = this.export();
				this.undo_index++;
				this.hint_available = false;

			}

			this.clearPattern(pattern);
			this.input_active = false;


			if (this.puzzle) {
				this.moveDown();
			}
			else {
				this.moveDownAndRefill();
			}



			this.clearCheckGrid();
			

			//SYGNAÅY

			
			if (this.checkIfCleared()) {
				this.allCleared.dispatch();
			}else {
				if (!this.checkIfPosibleMoves()) {
					this.noMoreMoves.dispatch();
				}
			}

			

		}


	}
}

MarbleSmash.GameGrid.prototype.undo = function() {
	if (!this.input_active) return false;

	if (this.undo_index > 0) {

		//PART EFFECT
			var tempToCheck = JSON.parse(this.undo_array[this.undo_index-1]);
			for (var yy = 0; yy < this.height; yy++) {
			for (var xx = 0; xx < this.width; xx++) {

					

						if (this.getVal(xx,yy) != tempToCheck[xx][yy]) {
							game.partSystem.emitHlBall(this.m_x+this.changeCellToPx(xx)+(this.tilesize*0.5),this.m_y+this.changeCellToPx(yy)+(this.tilesize*0.5));
						}


				}
			}


		this.undo_index--;
		this.import(this.undo_array[this.undo_index]);

		if (!this.hint_available) {
			if (this.undo_hint_index == this.undo_index) {
				this.hint_available = true;
			}
		}

		if (this.undo_index == 0) {
			this.hint_available = true;
			this.hint_index = 0;
		}
	}
}


MarbleSmash.GameGrid.prototype.hint = function() {
	if (!this.hint_available || !this.input_active) return false;
	
	var pattern = this.lookForMatch(this.hint_array[this.undo_index][0],this.hint_array[this.undo_index][1]);
	this.hint_index++;

	if (pattern) {

			if (this.puzzle) {

				this.undo_array[this.undo_index] = this.export();
				this.undo_index++;

			}

			this.clearPattern(pattern);
			this.input_active = false;


			if (this.puzzle) {
				this.moveDown();
			}
			else {
				this.moveDownAndRefill();
			}



			this.clearCheckGrid();
			
			//SYGNAÅY

			
			if (this.checkIfCleared()) {
				this.allCleared.dispatch();
			}else {
				if (!this.checkIfPosibleMoves()) {
					this.noMoreMoves.dispatch();
				}
			}

		}

		return true;

}


MarbleSmash.GameGrid.prototype.mouseInRange = function() {
	return game.input.x > this.m_x && game.input.x < this.m_x+this.width*this.tilesize 
		&& game.input.y > this.m_y && game.input.y < this.m_y+this.height*this.tilesize
}

MarbleSmash.GameGrid.prototype.export = function() {
	var export_grid = this.makeGrid(this.width,this.height);
	
	/// WERSJA PUZZLOWA NIE UWZGLEDNIA POWERUPOW	
	if (this.puzzle) {

		this.blockGrid.forEach(function(collumn,xx) {
		collumn.forEach(function(cell,yy) {
			export_grid[xx][yy] = this.getVal(xx,yy);
		},this)
		},this)

	}else {

		this.blockGrid.forEach(function(collumn,xx) {
		collumn.forEach(function(cell,yy) {
			export_grid[xx][yy] = [this.getVal(xx,yy),this.blockGrid[xx][yy].powerup];
		},this)
		},this)

	}
	

	return JSON.stringify(export_grid);
	
}

MarbleSmash.GameGrid.prototype.import = function(import_string) {

	this.clear();
	var import_grid = JSON.parse(import_string);
	

	if (this.puzzle) {

		this.blockGrid.forEach(function(collumn,xx) {
			collumn.forEach(function(cell,yy) {
				if (import_grid[xx][yy] > 0) {
					this.makeNewMarble(xx,yy,import_grid[xx][yy]);
				}
			},this)
		},this)

	}else {

		this.blockGrid.forEach(function(collumn,xx) {
			collumn.forEach(function(cell,yy) {
				if (import_grid[xx][yy][0] > 0) {
					
					var marble = this.makeNewMarble(xx,yy,import_grid[xx][yy][0]);
					marble.powerup = import_grid[xx][yy][1];
					marble.loadImg();
				}
			},this)
		},this)

	}

}

MarbleSmash.GameGrid.prototype.loadPuzzle = function(puzzles) {
	this.hint_array = JSON.parse(puzzles[1]);
	this.puzzle_json = puzzles[0];
	this.import(this.puzzle_json);
}

MarbleSmash.GameGrid.prototype.restart = function() {

	if (!this.input_active) return;
	
	this.undo_index = 0;
	this.hint_index = 0;
	this.hint_available = true;
	this.input_active = false;
	
	var delay = 0;


	for (var yy = 0; yy < this.height; yy++) {
			for (var xx = 0; xx < this.width; xx++) {
				if (this.blockGrid[xx][yy] != 0) {
					game.add.tween(this.blockGrid[xx][yy].scale).to({x:0, y:0},200,Phaser.Easing.Sinusoidal.In,true,delay);
					delay += 10;
				}
		}
	}

	

	game.time.events.add(delay+200,function() {

		this.import(this.puzzle_json);
		this.clearCheckGrid();

		delay = 0;
		for (var yy = 0; yy < this.height; yy++) {
				for (var xx = 0; xx < this.width; xx++) {
					if (this.blockGrid[xx][yy] != 0) {
						game.add.tween(this.blockGrid[xx][yy].scale).from({x:0, y:0},200,Phaser.Easing.Sinusoidal.Out,true,delay);
						delay += 10;
					}
			}
		}

		game.time.events.add(delay+200,function() {
			this.input_active = true;
		},this)

	},this)
	


}


MarbleSmash.GameGrid.prototype.shuffle = function() {

	this.input_active = false;

	do {

		
		var powerups = [];

		for (var yy = 0; yy < this.height; yy++) {
			for (var xx = 0; xx < this.width; xx++) {

				if (this.blockGrid[xx][yy].number == 99) {
					powerups[powerups.length] = this.blockGrid[xx][yy].powerup;
				}
				
				this.blockGrid[xx][yy].number = game.rnd.between(1,this.timeAttackMaxNumberOfMarble);
				this.blockGrid[xx][yy].powerup = 0;

			}
		}

		while(powerups.length > 0) {
			var xx = game.rnd.between(0,this.width-1);
			var yy = game.rnd.between(0,this.height-1);

			if (this.blockGrid[xx][yy].powerup == 0) {
				this.blockGrid[xx][yy].powerup = powerups[0];
				this.blockGrid[xx][yy].number = 99;
				powerups.splice(0,1);
			}


		}

	}while(!this.checkIfPosibleMoves());

	for (var yy = 0; yy < this.height; yy++) {

		for (var xx = 0; xx < this.width; xx++) {

			this.blockGrid[xx][yy].updateAfterShuffle((yy*3)+(xx*3))

		}
	};

	game.time.events.add((7*50)+(7*50)+1000, function() {
		this.input_active = true;
	},this);


}

MarbleSmash.GameGrid.prototype.processPowerUpPattern = function(xx,yy) {
	var pattern = [];

	this.addPowerUpToPattern(pattern,xx,yy);

	while (true) {

		var check_result = this.checkIfPowerUpInPattern(pattern);
		
		if (check_result) {
			this.addPowerUpToPattern(pattern,check_result[0],check_result[1]);
		}else {
			break;
		}
	}

	
	return pattern;
}

MarbleSmash.GameGrid.prototype.checkIfPowerUpInPattern = function(pattern) {

	var len = pattern.length;
	for (var i = 0; i < len; i++) {
		if (this.blockGrid[pattern[i][0]][pattern[i][1]].powerup > 0) {
			return [pattern[i][0],pattern[i][1]];
		}
	}

	return false;
}

MarbleSmash.GameGrid.prototype.addPowerUpToPattern = function(pattern,xx,yy) {


	var powerup = this.blockGrid[xx][yy].powerup;
	if (powerup == 0) return;

	this.blockGrid[xx][yy].powerup *= -1;


	var pu_array = this.powerUpArray[powerup-1];
	var len = pu_array.length;

	for (var i = 0; i < len; i++) {

		var n_xx = xx+pu_array[i][0]
		var n_yy = yy+pu_array[i][1]

		if (this.validCell(n_xx,n_yy) && this.checkIfPutToPattern(pattern, n_xx, n_yy)) {
			pattern[pattern.length] = [n_xx,n_yy];
		}

	}

}

MarbleSmash.GameGrid.prototype.checkIfPutToPattern = function(pattern, xx, yy) {
	var len = pattern.length;
	
	for (var i = 0; i < len; i++) {
		if (pattern[i][0] == xx) {
			if (pattern[i][1] == yy) {
				return false;
			}
		}
	}

	return true;
}


MarbleSmash.GameGrid.prototype.powerUpArray = [
[
[-1,-1],[0,-1],[1,-1],
[-1,0],[0,0],[1,0],
[-1,1],[0,1],[1,1]
],

[
[-9,0],[-8,0],[-7,0],[-6,0],[-5,0],[-4,0],[-3,0],[-2,0],[-1,0],[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0]
],


[
[0,-9],[0,-8],[0,-7],[0,-6],[0,-5],[0,-4],[0,-3],[0,-2],[0,-1],[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,8],[0,9]
]

]